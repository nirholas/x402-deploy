import { createHash } from "node:crypto";
import { buildFacilitatorRequest } from "./payment-verifier.js";

export interface SettlePaymentOptions {
  paymentHeader: string;
  expectedPrice: string;
  expectedPayTo: string;
  network: string;
  facilitatorUrl: string;
}

export interface SettlementResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

/**
 * Ask the facilitator to settle a verified payment on-chain. The gateway must
 * not release a paid resource until this succeeds: /verify only proves the
 * authorization is well formed, /settle is where funds actually move.
 */
export async function settlePayment(options: SettlePaymentOptions): Promise<SettlementResult> {
  const { paymentHeader, expectedPrice, expectedPayTo, network, facilitatorUrl } = options;

  try {
    const payment = JSON.parse(Buffer.from(paymentHeader, "base64").toString());
    const response = await fetch(`${facilitatorUrl}/settle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildFacilitatorRequest(payment, { expectedPrice, expectedPayTo, network })),
    });
    const result = await response.json().catch(() => ({} as Record<string, any>));

    if (!response.ok || result.success !== true) {
      return {
        success: false,
        error: result.errorReason || result.error || result.message || `Facilitator settlement failed (${response.status})`,
      };
    }

    return { success: true, txHash: result.transaction || result.txHash };
  } catch (error) {
    return {
      success: false,
      error: `Settlement request failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Stable identity of a payment authorization. The EIP-3009 nonce is unique per
 * authorization even when the same signed payload is re-encoded, so it is
 * preferred; a hash of the raw header covers payloads without one.
 */
export function paymentKey(paymentHeader: string): string {
  try {
    const payment = JSON.parse(Buffer.from(paymentHeader, "base64").toString());
    const auth = payment?.authorization ?? payment?.payload?.authorization;
    if (auth?.nonce) {
      return `nonce:${String(auth.from ?? "").toLowerCase()}:${String(auth.nonce).toLowerCase()}`;
    }
  } catch {
    // fall through to the header hash
  }
  return `header:${createHash("sha256").update(paymentHeader).digest("hex")}`;
}

/**
 * In-memory record of payment authorizations that already bought a request, so
 * a captured x-payment header cannot be replayed to get more responses. It is
 * per process and bounded; the on-chain nonce consumed by /settle remains the
 * durable guarantee across restarts and replicas.
 */
export class ReplayGuard {
  private readonly seen = new Map<string, number>();

  constructor(
    private readonly ttlMs = 10 * 60 * 1000,
    private readonly maxEntries = 10_000,
  ) {}

  /** Returns false when the key was already claimed and has not expired. */
  claim(key: string, now = Date.now()): boolean {
    this.prune(now);
    if (this.seen.has(key)) return false;
    this.seen.set(key, now + this.ttlMs);
    return true;
  }

  /** Give a claim back, e.g. when settlement failed and the client may retry. */
  release(key: string): void {
    this.seen.delete(key);
  }

  private prune(now: number): void {
    for (const [key, expires] of this.seen) {
      if (expires > now && this.seen.size < this.maxEntries) break;
      this.seen.delete(key);
    }
  }
}
