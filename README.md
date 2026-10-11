# Semiotic Exchange Chain Services Section

Specifies the fusion of public standard protocols — EAVT/Datom, EVM
settlement, ActivityPub/WMAP, A2A, x402, UCAN — into one exchange chain in
which the chain is the only durable home, actuators are ephemeral, and the
Semiotic Voxel exists only actively. This section *specifies*; it does not
itself operate a chain.

## What it trades

`lib/contracts/SemioticExchange.sol` (227 lines) is the live actuator
target: `src/semiotic-exchange-demand-induction.mjs` builds
`raiseDemand(...)` call args for it. It defines the exchange primitive:
sovereign function-node **Cells** (`controller`, `law`, `retired`) seat
themselves; a Cell raises a **Demand** (`raiser`, `grounding`,
`wantedLaw`, `claimant`, `result`); other Cells publish RMN **Offers**
against it; one is claimed and the demand **settles** to a result
content-digest.

`src/semiotic-exchange-demand-induction.mjs` exports
`inducePrivateLiveMudDemand` and `induceCapabilityRepairDemand`, both
building typed RMN-addressed demand/grounding/wantedLaw receipts (never
submitting them) via `@lenticule-science/articulating`'s
articulate/predicate/posit/settle pipeline.

## Sub-services

- `sovereign-membrane-admission-service` — binds a die's Ed25519 signing
  material and Agent Card; never mints chain custody in-process.

## Test status

As of 2026-09-02, both packages install their dependencies as exact
registry pins from the canonical Verdaccio (`https://registry.561.group`)
and all 12 individual tests pass (`node --test`, run per package):

- `semiotic-exchange-chain-services-section` (this package): 6/6 pass.
- `sovereign-membrane-admission-service`: 6/6 pass.
