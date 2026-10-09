import test from "node:test";
import assert from "node:assert/strict";
import { toNumber, bn, sortProducts, topMovers, priceSummary, unitName } from "../lib/format.ts";
import type { Product } from "../lib/types.ts";

const product = (id: number, price: string | number, pct = 0): Product => ({
  id, slug: `product-${id}`, nameBn: "পণ্য", category: "chal", categoryNameBn: "চাল", categoryIcon: "🍚", unit: "kg", image: "🍚",
  today: price, yesterday: price, lastWeek: 0, lastMonth: 0, change: { dir: pct > 0 ? "up" : pct < 0 ? "down" : "flat", pct }, markets: [],
});
test("Bengali currency values become numbers, including separators", () => {
  assert.equal(toNumber("১,৮৫০ টাকা"), 1850);
  assert.equal(toNumber("৬৩.৫০"), 63.5);
  assert.equal(bn(1850), "১,৮৫০");
});
test("sorting compares numbers and preserves original/default order", () => {
  const original = [product(1, "৯৯"), product(2, "১,৮৫০"), product(3, "৩০")];
  assert.deepEqual(sortProducts(original, "low").map(p => p.id), [3, 1, 2]);
  assert.deepEqual(sortProducts(original, "high").map(p => p.id), [2, 1, 3]);
  assert.deepEqual(sortProducts(original, "default").map(p => p.id), [1, 2, 3]);
  assert.deepEqual(original.map(p => p.id), [1, 2, 3]);
});
test("top movers exclude flat/opposite changes and cap at six", () => {
  const products = Array.from({ length: 8 }, (_, i) => product(i, 100, i + 1));
  products.push(product(10, 100, -20), product(11, 100, 0));
  assert.deepEqual(topMovers(products, "up").map(p => p.id), [7, 6, 5, 4, 3, 2]);
  assert.deepEqual(topMovers([product(1, 20, -2), product(2, 40, -12), product(3, 60, 4)], "down").map(p => p.id), [2, 1]);
});
test("summary averages market midpoints and uses overall min/max", () => {
  const p = product(1, 99);
  p.markets = [{ market: "A", division: "ঢাকা", min: 50, max: 70 }, { market: "B", division: "রাজশাহী", min: 70, max: 90 }];
  assert.deepEqual(priceSummary(p), { min: 50, max: 90, average: 70 });
  assert.deepEqual(priceSummary(product(2, "৯৯")), { min: 99, max: 99, average: 99 });
});
test("supported units have readable Bengali labels", () => {
  assert.equal(unitName("kg"), "কেজি"); assert.equal(unitName("liter"), "লিটার"); assert.equal(unitName("dozen"), "ডজন"); assert.equal(unitName("piece"), "পিস");
});
