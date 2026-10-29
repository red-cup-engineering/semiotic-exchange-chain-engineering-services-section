import assert from "node:assert/strict";
import test from "node:test";
import { defineType } from "@red-cup-engineering/computer-data-engine";
import { createSignCell, referenceOf } from "@red-cup-engineering/sign-cell";
import { appendSignClaim, emptySignChain } from "../dist/index.mjs";

const type = defineType({ id: "test.chain-source@1", name: "Chain source", description: "Test cell content.", schema: { type: "object" }, parents: [] } as const);
if (!type.ok) throw new Error(type.refusal.message);
const cell = createSignCell(type.value, { value: "reef" });
if (!cell.ok) throw new Error(cell.refusal.message);
const ref = referenceOf(cell.value);
const claim = Object.freeze({ kind: "sign.claim" as const, subject: ref, predicate: "rumor", object: ref, charge: "true" as const });

test("SignChain appends immutable witnessed claims and refuses an unknown parent", () => {
  const appended = appendSignClaim(emptySignChain(), { author: "kip", witness: "tidepool", claim });
  assert.equal(appended.ok, true);
  if (!appended.ok) throw new Error("append failed");
  assert.equal(appended.value.events.length, 1);
  assert.equal(appended.value.events[0].id.startsWith("ni:"), true);
  const refused = appendSignClaim(emptySignChain(), { author: "reed", witness: "tidepool", parents: [appended.value.events[0].id], claim });
  assert.equal(refused.ok, false);
  if (refused.ok) throw new Error("unknown parent was admitted");
  assert.equal(refused.refusal.code, "unknown-parent");
});
