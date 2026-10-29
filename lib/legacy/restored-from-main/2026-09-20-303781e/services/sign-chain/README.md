# SignChain

`@red-cup-engineering/sign-chain` owns the pure append/replay boundary for
witnessed sign claims. It derives a content identity, requires already-known
causal parents, and records no external effects. It deliberately accepts the
admitted SignCraft shape structurally so package publication, not a `file:`
dependency, establishes the production tower edge.

The source-only Tidepool receiver test is a pre-publication contract check. A
production Tidepool import may change only after both providers are published
as exact registry pins and the fresh-install receiver test passes.
