# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Fixed

- Gateway settles every verified payment through the facilitator `/settle` endpoint and releases the paid resource only after settlement succeeds.
- Gateway rejects a payment authorization that already bought a request (replay guard keyed on the EIP-3009 nonce) and lets a client retry after a failed settlement.
- Gateway sends the facilitator the standard `paymentPayload` and `paymentRequirements` bodies (the previous request failed to serialize a BigInt and never verified).
- Bundled facilitator binds `/verify` and `/settle` to the supplied payment requirements (chain, asset, recipient, amount, expiry).

## [1.0.0] - 2026-02-11

### Added

- Initial release
