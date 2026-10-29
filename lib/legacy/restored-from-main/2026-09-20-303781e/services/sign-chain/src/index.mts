import { defineType } from "@red-cup-engineering/computer-data-engine";
import { createSignCell } from "@red-cup-engineering/sign-cell";
import type { SignClaim } from "@red-cup-engineering/sign-craft";

/** The SignChain boundary intentionally accepts an admitted value structurally.
 * It does not duplicate SignCraft's claim admission or FOUR-valued algebra. */
export type WitnessedSignClaim = SignClaim;

export type SignChainEvent = Readonly<{
  readonly kind: "sign.chain.event";
  readonly id: string;
  readonly ordinal: number;
  readonly author: string;
  readonly witness: string;
  readonly parents: readonly string[];
  readonly claim: WitnessedSignClaim;
}>;

export type SignChain = Readonly<{
  readonly kind: "sign.chain";
  readonly events: readonly SignChainEvent[];
}>;

export type SignChainRefusal = Readonly<{
  readonly code: "invalid-event" | "unknown-parent" | "duplicate-event";
  readonly message: string;
}>;

export type SignChainResult<Value> =
  | Readonly<{ readonly ok: true; readonly value: Value }>
  | Readonly<{ readonly ok: false; readonly refusal: SignChainRefusal }>;

const accepted = <Value,>(value: Value): SignChainResult<Value> => Object.freeze({ ok: true, value });
const refused = (code: SignChainRefusal["code"], message: string): SignChainResult<never> =>
  Object.freeze({ ok: false, refusal: Object.freeze({ code, message }) });
const validTerm = (value: string): boolean => typeof value === "string" && value.trim().length > 0;
const eventType = (() => {
  const defined = defineType({
    id: "sign.chain.event@1",
    name: "Sign chain event",
    description: "A content-addressed witnessed SignCraft claim transition.",
    schema: { type: "object" },
    parents: [],
  } as const);
  if (!defined.ok) throw new Error(defined.refusal.message);
  return defined.value;
})();

export function emptySignChain(): SignChain {
  return Object.freeze({ kind: "sign.chain", events: Object.freeze([]) });
}

/** Append is the sole state transition. It checks causal parents, derives its
 * own ordinal and content identity, and preserves an immutable event sequence. */
export function appendSignClaim(
  chain: SignChain,
  input: Readonly<{ readonly author: string; readonly witness: string; readonly parents?: readonly string[]; readonly claim: WitnessedSignClaim }>,
): SignChainResult<SignChain> {
  if (!validTerm(input.author) || !validTerm(input.witness)) return refused("invalid-event", "author and witness must be nonempty strings");
  const parents = Object.freeze([...(input.parents ?? [])].sort());
  const known = new Set(chain.events.map((event) => event.id));
  if (parents.some((parent) => !known.has(parent))) return refused("unknown-parent", "every causal parent must already be in this chain");
  const ordinal = chain.events.length;
  const eventContent = Object.freeze({ kind: "sign.chain.event", ordinal, author: input.author, witness: input.witness, parents, claim: input.claim });
  const identified = createSignCell(eventType, eventContent);
  if (!identified.ok) return refused("invalid-event", identified.refusal.message);
  const event: SignChainEvent = Object.freeze({ ...eventContent, id: identified.value.id });
  if (known.has(event.id)) return refused("duplicate-event", "this exact event is already appended");
  return accepted(Object.freeze({ kind: "sign.chain", events: Object.freeze([...chain.events, event]) }));
}

/** Replay exposes only the ordered immutable evidence. Interpretation belongs
 * to SignCraft and application projections, never to the chain. */
export function replaySignChain(chain: SignChain): readonly SignChainEvent[] {
  return chain.events;
}
