import { privateKeyToAccount } from "viem/accounts";

/**
 * Get wallet address from private key.
 *
 * Ownership-proof signing lives in `src/discovery/ownership.ts`
 * (`generateOwnershipProof`), which supports every CAIP-2 network rather than
 * only Arbitrum and returns a structured `OwnershipProof`.
 */
export function getAddressFromPrivateKey(privateKey: `0x${string}`): `0x${string}` {
  const account = privateKeyToAccount(privateKey);
  return account.address;
}
