/**
 * Gateway settlement and replay tests.
 *
 * These run the real middleware and payment verifier against a stubbed
 * facilitator (global fetch) to prove that a paid resource is only released
 * after /settle succeeds, that the facilitator is sent the standard
 * paymentPayload/paymentRequirements bodies, and that a payment authorization
 * cannot buy a second request.
 */

import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from "vitest";
import type { Request, Response, NextFunction } from "express";

vi.mock("../../src/gateway/helpers.js", () => ({
  getPriceForRoute: vi.fn().mockReturnValue({ price: "$0.01", route: "GET /api/test" }),
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true }),
  trackRequest: vi.fn().mockResolvedValue(undefined),
}));

import { x402Middleware } from "../../src/gateway/middleware.js";
import type { X402Config } from "../../src/types/config.js";

const WALLET = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1";
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const FACILITATOR = "https://facilitator.example.test";

const config = {
  name: "test-api",
  version: "1.0.0",
  type: "express-api",
  payment: { wallet: WALLET, network: "eip155:8453", token: "USDC", facilitator: FACILITATOR },
  pricing: { default: "$0.01" },
} as unknown as X402Config;

function header(nonce: string): string {
  return Buffer.from(
    JSON.stringify({
      chainId: 8453,
      asset: USDC_BASE,
      authorization: {
        from: "0x1111111111111111111111111111111111111111",
        to: WALLET,
        value: "10000",
        validAfter: "0",
        validBefore: "99999999999",
        nonce,
      },
      signature: "0xsig",
    }),
  ).toString("base64");
}

function req(paymentHeader: string): Request {
  return { headers: { "x-payment": paymentHeader }, method: "GET", path: "/api/test" } as unknown as Request;
}

function res(): Response & { status: Mock; json: Mock; setHeader: Mock } {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    setHeader: vi.fn().mockReturnThis(),
  } as any;
}

function reply(body: unknown, status = 200) {
  return Promise.resolve(new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }));
}

describe("x402 gateway settlement", () => {
  let fetchMock: Mock;
  let next: Mock;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    next = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends the facilitator the standard payload and requirements bodies", async () => {
    fetchMock.mockImplementation((url: string) =>
      String(url).endsWith("/verify")
        ? reply({ isValid: true, payer: "0x1111111111111111111111111111111111111111" })
        : reply({ success: true, transaction: "0xtx" }),
    );

    await x402Middleware({ config })(req(header("0xaa")), res(), next as NextFunction);

    const verifyCall = fetchMock.mock.calls.find(([u]) => String(u).endsWith("/verify"))!;
    const body = JSON.parse(verifyCall[1].body);
    expect(body.paymentPayload.authorization.nonce).toBe("0xaa");
    expect(body.paymentRequirements).toMatchObject({
      chainId: 8453,
      asset: USDC_BASE,
      payTo: WALLET,
      maxAmountRequired: "10000",
    });
  });

  it("settles after verifying and only then releases the resource", async () => {
    const order: string[] = [];
    fetchMock.mockImplementation((url: string) => {
      order.push(String(url).replace(FACILITATOR, ""));
      return String(url).endsWith("/verify")
        ? reply({ isValid: true, payer: "0x1111111111111111111111111111111111111111" })
        : reply({ success: true, transaction: "0xtx" });
    });
    next.mockImplementation(() => order.push("next"));

    const response = res();
    await x402Middleware({ config })(req(header("0xbb")), response, next as NextFunction);

    expect(order).toEqual(["/verify", "/settle", "next"]);
    expect(response.setHeader).toHaveBeenCalledWith(
      "x-payment-response",
      expect.stringContaining("0xtx"),
    );
  });

  it("does not release the resource when settlement fails", async () => {
    fetchMock.mockImplementation((url: string) =>
      String(url).endsWith("/verify")
        ? reply({ isValid: true, payer: "0x1111111111111111111111111111111111111111" })
        : reply({ success: false, errorReason: "insufficient funds" }, 400),
    );

    const response = res();
    await x402Middleware({ config })(req(header("0xcc")), response, next as NextFunction);

    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(402);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "payment_settlement_failed" }),
    );
  });

  it("rejects a replay of an authorization that already bought a request", async () => {
    fetchMock.mockImplementation((url: string) =>
      String(url).endsWith("/verify")
        ? reply({ isValid: true, payer: "0x1111111111111111111111111111111111111111" })
        : reply({ success: true, transaction: "0xtx" }),
    );

    const middleware = x402Middleware({ config });
    await middleware(req(header("0xdd")), res(), next as NextFunction);
    expect(next).toHaveBeenCalledTimes(1);

    const replay = res();
    await middleware(req(header("0xdd")), replay, next as NextFunction);

    expect(next).toHaveBeenCalledTimes(1);
    expect(replay.status).toHaveBeenCalledWith(402);
    expect(replay.json).toHaveBeenCalledWith(expect.objectContaining({ error: "payment_already_used" }));
    expect(fetchMock.mock.calls.filter(([u]) => String(u).endsWith("/settle"))).toHaveLength(1);
  });

  it("lets the client retry the same authorization after a failed settlement", async () => {
    let settleAttempts = 0;
    fetchMock.mockImplementation((url: string) => {
      if (String(url).endsWith("/verify")) {
        return reply({ isValid: true, payer: "0x1111111111111111111111111111111111111111" });
      }
      settleAttempts += 1;
      return settleAttempts === 1
        ? reply({ success: false, errorReason: "rpc timeout" }, 502)
        : reply({ success: true, transaction: "0xtx" });
    });

    const middleware = x402Middleware({ config });
    await middleware(req(header("0xee")), res(), next as NextFunction);
    expect(next).not.toHaveBeenCalled();

    await middleware(req(header("0xee")), res(), next as NextFunction);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
