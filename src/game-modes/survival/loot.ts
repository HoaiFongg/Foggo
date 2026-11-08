import type { LootDrop } from "./monsters";

export interface ResolvedLoot {
  itemId: string;
  qty: number;
}

/**
 * Hàm giải quyết loot rớt đồ (hỗ trợ deterministic seed hoặc random)
 */
export function resolveLoot(
  lootTable: LootDrop[],
  customRng?: () => number
): ResolvedLoot[] {
  const rng = customRng || Math.random;
  const results: ResolvedLoot[] = [];

  for (const drop of lootTable) {
    const roll = rng();
    if (roll <= drop.chance) {
      const qty =
        drop.minQty === drop.maxQty
          ? drop.minQty
          : Math.floor(rng() * (drop.maxQty - drop.minQty + 1)) + drop.minQty;
      if (qty > 0) {
        results.push({ itemId: drop.itemId, qty });
      }
    }
  }

  return results;
}

