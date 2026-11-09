import { SURVIVAL_CONFIG } from "./config";
import { getSurvivalClock } from "./clock";
import { getItemDef, ITEM_REGISTRY, type SurvivalItemDef } from "./items";
import { getScaledMonster, MONSTER_REGISTRY, type MonsterDef } from "./monsters";
import { getRecipe } from "./recipes";
import { resolveLoot, type ResolvedLoot } from "./loot";

export interface InventorySlot {
  slotIndex: number;
  itemId: string;
  qty: number;
  durability?: number;
}

export interface EquippedItem {
  itemId: string;
  durability: number;
  enhancedLevel?: number;
}

export interface EquippedGear {
  weapon?: EquippedItem;
  armor?: EquippedItem;
  helmet?: EquippedItem;
  shield?: EquippedItem;
}

export interface FogState {
  forest: number;
  cave: number;
  swamp: number;
}

export interface CampState {
  level: number;
  hp: number;
  maxHp: number;
  hasCampfire: boolean;
  barricades: number;
}

export interface CurrentBattle {
  monsterId: string;
  monsterHp: number;
  monsterMaxHp: number;
  phase: number;
}

export interface SurvivalPlayerState {
  hp: number;
  maxHp: number;
  hunger: number;
  maxHunger: number;
  coins: number;
  score: number;
  playSec: number;
  lastTickTimestamp: number;
  streak: number;
  currentZone: "forest" | "cave" | "swamp";
  fog: FogState;
  revealedPoints: string[];
  camp: CampState;
  equipped: EquippedGear;
  inventory: InventorySlot[];
  monstersKilled: number;
  bossesKilled: number;
  deaths: number;
  nightWavesSurvived: number;
  currentBattle?: CurrentBattle | null;
}

/**
 * Khởi tạo trạng thái ban đầu cho người chơi trên đảo Foggo
 */
export function initSurvivalState(nowSec: number = Math.floor(Date.now() / 1000)): SurvivalPlayerState {
  return {
    hp: SURVIVAL_CONFIG.MAX_HP,
    maxHp: SURVIVAL_CONFIG.MAX_HP,
    hunger: SURVIVAL_CONFIG.MAX_HUNGER,
    maxHunger: SURVIVAL_CONFIG.MAX_HUNGER,
    coins: SURVIVAL_CONFIG.INITIAL_GOLD,
    score: 0,
    playSec: 0,
    lastTickTimestamp: nowSec,
    streak: 0,
    currentZone: "forest",
    fog: {
      forest: SURVIVAL_CONFIG.FOG.INITIAL_PCT,
      cave: SURVIVAL_CONFIG.FOG.INITIAL_PCT,
      swamp: SURVIVAL_CONFIG.FOG.INITIAL_PCT,
    },
    revealedPoints: [],
    camp: {
      level: 1,
      hp: 100,
      maxHp: 100,
      hasCampfire: false,
      barricades: 0,
    },
    equipped: {
      weapon: {
        itemId: "wooden_club",
        durability: 40,
        enhancedLevel: 0,
      },
      armor: undefined,
    },
    inventory: [
      { slotIndex: 0, itemId: "apple", qty: 3 },
      { slotIndex: 1, itemId: "wood", qty: 5 },
      { slotIndex: 2, itemId: "bandage", qty: 1 },
    ],
    monstersKilled: 0,
    bossesKilled: 0,
    deaths: 0,
    nightWavesSurvived: 0,
    currentBattle: null,
  };
}

/**
 * Quản lý túi đồ (Inventory Helper Functions)
 */
export function addItemToInventory(
  inventory: InventorySlot[],
  itemId: string,
  qtyToAdd: number,
  durability?: number
): { success: boolean; inventory: InventorySlot[] } {
  const itemDef = getItemDef(itemId);
  if (!itemDef || qtyToAdd <= 0) return { success: false, inventory };

  const nextInv = inventory.map((slot) => ({ ...slot }));
  const isStackable = itemDef.stackLimit > 1;

  let remaining = qtyToAdd;

  // 1. Nếu xếp chồng được, tìm slot có sẵn cùng itemId
  if (isStackable) {
    for (const slot of nextInv) {
      if (slot.itemId === itemId && slot.qty < itemDef.stackLimit) {
        const canAdd = Math.min(remaining, itemDef.stackLimit - slot.qty);
        slot.qty += canAdd;
        remaining -= canAdd;
        if (remaining <= 0) break;
      }
    }
  }

  // 2. Nếu còn dư hoặc là trang bị (không xếp chồng), tìm slot trống
  while (remaining > 0) {
    const occupiedSlots = new Set(nextInv.map((s) => s.slotIndex));
    let emptyIndex = -1;
    for (let i = 0; i < SURVIVAL_CONFIG.MAX_INVENTORY_SLOTS; i++) {
      if (!occupiedSlots.has(i)) {
        emptyIndex = i;
        break;
      }
    }

    if (emptyIndex === -1) {
      // Túi đồ đã đầy
      return { success: false, inventory: nextInv };
    }

    const qtyInSlot = Math.min(remaining, itemDef.stackLimit);
    nextInv.push({
      slotIndex: emptyIndex,
      itemId,
      qty: qtyInSlot,
      durability: durability ?? itemDef.durability,
    });
    remaining -= qtyInSlot;
  }

  return { success: true, inventory: nextInv };
}

export function removeItemFromInventory(
  inventory: InventorySlot[],
  itemId: string,
  qtyToRemove: number
): { success: boolean; inventory: InventorySlot[] } {
  const currentTotal = countItemInInventory(inventory, itemId);
  if (currentTotal < qtyToRemove) {
    return { success: false, inventory };
  }

  let remaining = qtyToRemove;
  const nextInv: InventorySlot[] = [];

  for (const slot of inventory) {
    if (slot.itemId === itemId && remaining > 0) {
      if (slot.qty <= remaining) {
        remaining -= slot.qty;
        // Bỏ qua slot này (đã dùng hết)
      } else {
        nextInv.push({ ...slot, qty: slot.qty - remaining });
        remaining = 0;
      }
    } else {
      nextInv.push({ ...slot });
    }
  }

  return { success: true, inventory: nextInv };
}

export function countItemInInventory(inventory: InventorySlot[], itemId: string): number {
  return inventory
    .filter((slot) => slot.itemId === itemId)
    .reduce((sum, slot) => sum + slot.qty, 0);
}

/**
 * Hàm tick() chạy ở server:
 * Cập nhật đói, mất máu do đói, tính thời gian chơi.
 */
export function tick(state: SurvivalPlayerState, nowSec: number): SurvivalPlayerState {
  if (state.hp <= 0) {
    return state; // Người chơi đã ngất xỉu, cần bấm hồi sinh
  }

  const elapsed = Math.max(0, nowSec - state.lastTickTimestamp);
  if (elapsed <= 0) return state;

  const nextState = { ...state };
  nextState.playSec += elapsed;
  nextState.lastTickTimestamp = nowSec;

  // Trừ điểm đói: 1 điểm mỗi 6 giây
  const hungerLoss = Math.floor(elapsed / SURVIVAL_CONFIG.HUNGER_TICK_SEC);
  if (hungerLoss > 0) {
    nextState.hunger = Math.max(0, nextState.hunger - hungerLoss);
  }

  // Nếu đói = 0: trừ 1 HP mỗi 4 giây
  if (nextState.hunger === 0) {
    const starvingLoss = Math.floor(elapsed / SURVIVAL_CONFIG.STARVING_HP_LOSS_SEC);
    if (starvingLoss > 0) {
      nextState.hp = Math.max(0, nextState.hp - starvingLoss);
    }
  }

  // Tự động kiểm tra nếu HP tụt về 0
  if (nextState.hp <= 0) {
    nextState.hp = 0;
    nextState.deaths += 1;
    nextState.streak = 0;
    nextState.currentBattle = null;
  }

  return nextState;
}

/**
 * Xử lý hành động Đi Săn (Hunt)
 */
export function applyHunt(
  state: SurvivalPlayerState,
  monsterId: string,
  answerScore: number, // 0.0 .. 1.0 từ hàm grade()
  isHotspotCritical: boolean = false,
  timeUsedSec: number = 5,
  options?: {
    dungeonDrops?: Array<{ itemId: string; dropRate: number }>;
  }
): {
  state: SurvivalPlayerState;
  result: "hit" | "kill" | "hurt" | "death";
  damageDealt: number;
  damageTaken: number;
  lootAwarded: ResolvedLoot[];
  coinsAwarded: number;
  scoreAwarded: number;
} {
  const clock = getSurvivalClock(state.playSec);
  const monster = getScaledMonster(monsterId, clock.dayNumber, !clock.isDay);

  let currentHp = state.currentBattle?.monsterId === monsterId
    ? state.currentBattle.monsterHp
    : monster.hp;

  const nextState: SurvivalPlayerState = {
    ...state,
    equipped: { ...state.equipped },
  };
  nextState.coins = Number.isFinite(nextState.coins) ? nextState.coins : 0;
  nextState.score = Number.isFinite(nextState.score) ? nextState.score : 0;

  const isSuccess = answerScore >= 0.5;

  if (isSuccess) {
    // === TẤN CÔNG THÀNH CÔNG ===
    const weaponAtk =
      nextState.equipped?.weapon?.durability && nextState.equipped.weapon.durability > 0
        ? (ITEM_REGISTRY[nextState.equipped.weapon.itemId]?.atk || 0) +
          (nextState.equipped.weapon.enhancedLevel || 0) * 4
        : 0;

    const baseAtk = SURVIVAL_CONFIG.BASE_ATK + weaponAtk;
    const streakBonus = 1 + Math.min(10, nextState.streak) * 0.08;
    const critBonus = isHotspotCritical ? 2.0 : 1.0;

    const damageDealt = Math.round(baseAtk * answerScore * streakBonus * critBonus);
    currentHp = Math.max(0, currentHp - damageDealt);

    // Hao mòn vũ khí
    if (nextState.equipped?.weapon && nextState.equipped.weapon.durability > 0) {
      nextState.equipped.weapon.durability = Math.max(0, nextState.equipped.weapon.durability - 1);
    }

    nextState.streak += 1;

    if (currentHp <= 0) {
      // Quái vật bị tiêu diệt! (Người chơi kết liễu thành công)
      const nightCoinMult = !clock.isDay ? 1 + SURVIVAL_CONFIG.NIGHT_REWARD_BONUS_RATIO : 1.0;
      const baseCoinRoll =
        Math.floor(Math.random() * (monster.maxCoins - monster.minCoins + 1)) + monster.minCoins;
      const coinsAwarded = Math.round(baseCoinRoll * nightCoinMult);

      const lootAwarded = resolveLoot(monster.lootTable);

      // Rơi trang bị hiếm do giáo viên cấu hình trong hầm ngục
      if (options?.dungeonDrops && options.dungeonDrops.length > 0) {
        for (const drop of options.dungeonDrops) {
          const roll = Math.random() * 100;
          if (roll <= drop.dropRate) {
            lootAwarded.push({ itemId: drop.itemId, qty: 1 });
          }
        }
      }

      for (const loot of lootAwarded) {
        const { inventory } = addItemToInventory(nextState.inventory, loot.itemId, loot.qty);
        nextState.inventory = inventory;
      }

      const scoreAwarded = monster.isBoss ? 2000 : 500;
      nextState.coins += coinsAwarded;
      nextState.score += scoreAwarded;
      nextState.monstersKilled += 1;
      if (monster.isBoss) {
        nextState.bossesKilled += 1;
      }
      nextState.currentBattle = null;

      return {
        state: nextState,
        result: "kill",
        damageDealt,
        damageTaken: 0,
        lootAwarded,
        coinsAwarded,
        scoreAwarded,
      };
    } else {
      // === QUÁI CÒN SỐNG: ĐẾN LƯỢT QUÁI TẤN CÔNG PHẢN ĐÒN ===
      const armorDef =
        nextState.equipped?.armor?.durability && nextState.equipped.armor.durability > 0
          ? (ITEM_REGISTRY[nextState.equipped.armor.itemId]?.defensePct || 0)
          : 0;
      const helmetDef =
        nextState.equipped?.helmet?.durability && nextState.equipped.helmet.durability > 0
          ? (ITEM_REGISTRY[nextState.equipped.helmet.itemId]?.defensePct || 0)
          : 0;
      const shieldDef =
        nextState.equipped?.shield?.durability && nextState.equipped.shield.durability > 0
          ? (ITEM_REGISTRY[nextState.equipped.shield.itemId]?.defensePct || 0)
          : 0;

      const totalDefPct = Math.min(0.60, armorDef + helmetDef + shieldDef);
      const damageTaken = Math.max(1, Math.round(monster.atk * (1 - totalDefPct)));
      nextState.hp = Math.max(0, nextState.hp - damageTaken);

      // Hao mòn trang bị phòng thủ khi bị quái đánh trả
      if (nextState.equipped?.armor && nextState.equipped.armor.durability > 0) {
        nextState.equipped.armor.durability = Math.max(0, nextState.equipped.armor.durability - 1);
      }
      if (nextState.equipped?.helmet && nextState.equipped.helmet.durability > 0) {
        nextState.equipped.helmet.durability = Math.max(0, nextState.equipped.helmet.durability - 1);
      }
      if (nextState.equipped?.shield && nextState.equipped.shield.durability > 0) {
        nextState.equipped.shield.durability = Math.max(0, nextState.equipped.shield.durability - 1);
      }

      if (nextState.hp <= 0) {
        nextState.hp = 0;
        nextState.deaths += 1;
        nextState.currentBattle = null;

        return {
          state: nextState,
          result: "death",
          damageDealt,
          damageTaken,
          lootAwarded: [],
          coinsAwarded: 0,
          scoreAwarded: 0,
        };
      }

      // Quái còn sống, tiếp tục hiệp đấu tiếp theo
      nextState.currentBattle = {
        monsterId,
        monsterHp: currentHp,
        monsterMaxHp: monster.hp,
        phase: 1,
      };

      return {
        state: nextState,
        result: "hit",
        damageDealt,
        damageTaken,
        lootAwarded: [],
        coinsAwarded: 0,
        scoreAwarded: 100,
      };
    }
  } else {
    // === TRẢ LỜI SAI HOẶC QUÁ GIỜ: QUÁI ĐÁNH TRẢ ===
    nextState.streak = 0;

    // Tính tổng chỉ số phòng thủ từ Giáp, Mũ và Khiên (cân bằng, tối đa 60% giảm sát thương)
    const armorDef =
      nextState.equipped?.armor?.durability && nextState.equipped.armor.durability > 0
        ? (ITEM_REGISTRY[nextState.equipped.armor.itemId]?.defensePct || 0)
        : 0;
    const helmetDef =
      nextState.equipped?.helmet?.durability && nextState.equipped.helmet.durability > 0
        ? (ITEM_REGISTRY[nextState.equipped.helmet.itemId]?.defensePct || 0)
        : 0;
    const shieldDef =
      nextState.equipped?.shield?.durability && nextState.equipped.shield.durability > 0
        ? (ITEM_REGISTRY[nextState.equipped.shield.itemId]?.defensePct || 0)
        : 0;

    const totalDefPct = Math.min(0.60, armorDef + helmetDef + shieldDef);
    const damageTaken = Math.max(1, Math.round(monster.atk * (1 - totalDefPct)));
    nextState.hp = Math.max(0, nextState.hp - damageTaken);

    // Hao mòn trang bị phòng thủ khi bị đánh
    if (nextState.equipped?.armor && nextState.equipped.armor.durability > 0) {
      nextState.equipped.armor.durability = Math.max(0, nextState.equipped.armor.durability - 1);
    }
    if (nextState.equipped?.helmet && nextState.equipped.helmet.durability > 0) {
      nextState.equipped.helmet.durability = Math.max(0, nextState.equipped.helmet.durability - 1);
    }
    if (nextState.equipped?.shield && nextState.equipped.shield.durability > 0) {
      nextState.equipped.shield.durability = Math.max(0, nextState.equipped.shield.durability - 1);
    }

    if (nextState.hp <= 0) {
      nextState.hp = 0;
      nextState.deaths += 1;
      nextState.currentBattle = null;

      return {
        state: nextState,
        result: "death",
        damageDealt: 0,
        damageTaken,
        lootAwarded: [],
        coinsAwarded: 0,
        scoreAwarded: 0,
      };
    }

    // Giữ trạng thái quái đang đánh dở
    nextState.currentBattle = {
      monsterId,
      monsterHp: currentHp,
      monsterMaxHp: monster.hp,
      phase: 1,
    };

    return {
      state: nextState,
      result: "hurt",
      damageDealt: 0,
      damageTaken,
      lootAwarded: [],
      coinsAwarded: 0,
      scoreAwarded: 0,
    };
  }
}

/**
 * Xử lý hành động Rút lui / Tháo chạy khỏi trận chiến (Flee)
 * Rút lui sẽ khiến người chơi bị quái đuổi theo cào trúng (trừ máu) và bị trừ điểm rank.
 */
export function applyFlee(
  state: SurvivalPlayerState,
  monsterId?: string
): {
  state: SurvivalPlayerState;
  damageTaken: number;
  scoreLost: number;
  message: string;
} {
  const targetId = monsterId || state.currentBattle?.monsterId || "slime";
  const clock = getSurvivalClock(state.playSec);
  const monster = getScaledMonster(targetId, clock.dayNumber, !clock.isDay);

  const nextState: SurvivalPlayerState = {
    ...state,
    equipped: { ...state.equipped },
  };
  nextState.coins = Number.isFinite(nextState.coins) ? nextState.coins : 0;
  nextState.score = Number.isFinite(nextState.score) ? nextState.score : 0;

  // Tính giảm sát thương theo giáp/mũ/khiên
  const armorDef =
    nextState.equipped?.armor?.durability && nextState.equipped.armor.durability > 0
      ? (ITEM_REGISTRY[nextState.equipped.armor.itemId]?.defensePct || 0)
      : 0;
  const helmetDef =
    nextState.equipped?.helmet?.durability && nextState.equipped.helmet.durability > 0
      ? (ITEM_REGISTRY[nextState.equipped.helmet.itemId]?.defensePct || 0)
      : 0;
  const shieldDef =
    nextState.equipped?.shield?.durability && nextState.equipped.shield.durability > 0
      ? (ITEM_REGISTRY[nextState.equipped.shield.itemId]?.defensePct || 0)
      : 0;

  const totalDefPct = Math.min(0.60, armorDef + helmetDef + shieldDef);
  const rawDamage = Math.max(10, Math.round(monster.atk * 1.5));
  const damageTaken = Math.max(5, Math.round(rawDamage * (1 - totalDefPct)));
  const scoreLost = 50; // Trừ 50 điểm rank vì tháo chạy

  nextState.hp = Math.max(0, nextState.hp - damageTaken);
  nextState.score = Math.max(0, nextState.score - scoreLost);
  nextState.streak = 0; // Hủy chuỗi combo khi bỏ chạy
  nextState.currentBattle = null; // Thoát khỏi trạng thái giao chiến

  if (nextState.hp <= 0) {
    nextState.hp = 0;
    nextState.deaths += 1;
  }

  return {
    state: nextState,
    damageTaken,
    scoreLost,
    message: `Bạn đã rút lui khỏi trận chiến! Trong lúc tháo chạy, ${monster.name} đã đuổi theo cào trúng lưng bạn mất ${damageTaken} HP và bạn bị trừ ${scoreLost} điểm rank!`,
  };
}


/**
 * Xử lý hành động Hái lượm (Gather)
 */
export function applyGather(
  state: SurvivalPlayerState,
  resourceType: "wood" | "stone" | "herb",
  answerScore: number,
  timeUsedSec: number = 5
): {
  state: SurvivalPlayerState;
  qtyObtained: number;
  itemId: string;
} {
  const nextState = { ...state };
  if (answerScore < 0.5) {
    return { state: nextState, qtyObtained: 0, itemId: resourceType };
  }

  // Kiểm tra xem khu vực hiện tại có sương mù <= 70% không (bãi tài nguyên giàu)
  const currentFog = nextState.fog[nextState.currentZone] || 100;
  const isRich = currentFog <= SURVIVAL_CONFIG.FOG.THRESHOLDS.RICH_RESOURCES;

  let qty = Math.round(2 + answerScore * 3);
  if (isRich) {
    qty *= 2; // Gấp đôi sản lượng nếu đã xua bớt sương!
  }

  const { inventory } = addItemToInventory(nextState.inventory, resourceType, qty);
  nextState.inventory = inventory;
  nextState.score += qty * 20;

  return {
    state: nextState,
    qtyObtained: qty,
    itemId: resourceType,
  };
}

/**
 * Xử lý hành động Thám hiểm Sương Mù (Explore Fog)
 */
export function applyExplore(
  state: SurvivalPlayerState,
  zoneId: "forest" | "cave" | "swamp",
  answerScore: number,
  timeUsedSec: number = 5
): {
  state: SurvivalPlayerState;
  fogReduced: number;
  currentFog: number;
  newDiscovery: string | null;
} {
  const nextState = {
    ...state,
    fog: { ...state.fog },
    revealedPoints: [...state.revealedPoints],
  };

  const oldFog = nextState.fog[zoneId] ?? 100;

  if (answerScore >= 0.5) {
    // Giảm sương theo công thức mục 5A.21
    const baseRed = SURVIVAL_CONFIG.FOG.BASE_REDUCTION_PCT;
    const speedBonus = timeUsedSec <= 10 ? 1.2 : 1.0;
    const curve = 0.5 + 0.5 * (oldFog / 100);

    const fogReduced = Number((baseRed * answerScore * speedBonus * curve).toFixed(1));
    const newFog = Math.max(0, Number((oldFog - fogReduced).toFixed(1)));
    nextState.fog[zoneId] = newFog;
    nextState.score += Math.round(fogReduced * 50);

    // Kiểm tra các mốc khám phá
    let newDiscovery: string | null = null;
    const thresholds = SURVIVAL_CONFIG.FOG.THRESHOLDS;

    if (newFog <= thresholds.RICH_RESOURCES && !nextState.revealedPoints.includes(`${zoneId}_rich`)) {
      nextState.revealedPoints.push(`${zoneId}_rich`);
      newDiscovery = "Bãi tài nguyên giàu đã lộ ra (+100% sản lượng hái lượm)";
    } else if (newFog <= thresholds.DISCOVERY_CHEST && !nextState.revealedPoints.includes(`${zoneId}_chest`)) {
      nextState.revealedPoints.push(`${zoneId}_chest`);
      newDiscovery = "Phát hiện Rương thám hiểm bí ẩn (+50 xu & thức ăn)";
      nextState.coins += 50;
      const { inventory } = addItemToInventory(nextState.inventory, "cooked_meat", 2);
      nextState.inventory = inventory;
    } else if (newFog <= thresholds.BOSS_LAIR && !nextState.revealedPoints.includes(`${zoneId}_boss`)) {
      nextState.revealedPoints.push(`${zoneId}_boss`);
      newDiscovery = "Hang ổ Trùm Khu Vực đã hiển lộ! Hãy chuẩn bị trước khi thách đấu!";
    }

    return {
      state: nextState,
      fogReduced,
      currentFog: newFog,
      newDiscovery,
    };
  } else {
    // Sai câu hỏi: Sương dày thêm 2%
    const newFog = Math.min(100, oldFog + SURVIVAL_CONFIG.FOG.WRONG_INCREASE_PCT);
    nextState.fog[zoneId] = newFog;

    return {
      state: nextState,
      fogReduced: -SURVIVAL_CONFIG.FOG.WRONG_INCREASE_PCT,
      currentFog: newFog,
      newDiscovery: null,
    };
  }
}

/**
 * Xử lý Chế tạo (Crafting)
 */
export function applyCraft(
  state: SurvivalPlayerState,
  recipeId: string,
  answerScore: number
): {
  state: SurvivalPlayerState;
  success: boolean;
  message: string;
} {
  const recipe = getRecipe(recipeId);
  if (!recipe) {
    return { state, success: false, message: "Công thức không tồn tại" };
  }

  const nextState = { ...state };

  if (nextState.camp.level < recipe.requiredCampLevel) {
    return {
      state: nextState,
      success: false,
      message: `Yêu cầu trại cấp ${recipe.requiredCampLevel} để chế tạo món này.`,
    };
  }

  // Kiểm tra đủ nguyên liệu
  for (const ing of recipe.ingredients) {
    if (countItemInInventory(nextState.inventory, ing.itemId) < ing.qty) {
      const itemDef = getItemDef(ing.itemId);
      return {
        state: nextState,
        success: false,
        message: `Thiếu nguyên liệu: ${itemDef?.name || ing.itemId} (cần ${ing.qty}).`,
      };
    }
  }

  if (answerScore >= 0.5) {
    // Trả lời đúng: Trừ nguyên liệu và nhận vật phẩm
    for (const ing of recipe.ingredients) {
      const { inventory } = removeItemFromInventory(nextState.inventory, ing.itemId, ing.qty);
      nextState.inventory = inventory;
    }

    const { inventory, success } = addItemToInventory(
      nextState.inventory,
      recipe.outputItemId,
      recipe.outputQty
    );
    nextState.inventory = inventory;
    nextState.score += 150;

    return {
      state: nextState,
      success,
      message: `Chế tạo thành công: ${recipe.name}!`,
    };
  } else {
    // Trả lời sai: Bị mất 1 phần nguyên liệu nhỏ
    const firstIng = recipe.ingredients[0];
    const { inventory } = removeItemFromInventory(nextState.inventory, firstIng.itemId, 1);
    nextState.inventory = inventory;

    return {
      state: nextState,
      success: false,
      message: "Chế tạo thất bại do trả lời chưa chính xác! Hao hụt 1 nguyên liệu.",
    };
  }
}

/**
 * Xử lý Ăn / Hồi phục
 */
export function applyEat(
  state: SurvivalPlayerState,
  itemId: string
): { state: SurvivalPlayerState; success: boolean; message: string } {
  const itemDef = getItemDef(itemId);
  if (!itemDef) {
    return { state, success: false, message: "Vật phẩm không hợp lệ" };
  }

  const count = countItemInInventory(state.inventory, itemId);
  if (count <= 0) {
    return { state, success: false, message: "Bạn không có vật phẩm này trong túi" };
  }

  const nextState = { ...state };
  const { inventory } = removeItemFromInventory(nextState.inventory, itemId, 1);
  nextState.inventory = inventory;

  if (itemDef.healHunger) {
    nextState.hunger = Math.min(nextState.maxHunger, nextState.hunger + itemDef.healHunger);
  }

  if (itemDef.healHp) {
    nextState.hp = Math.max(1, Math.min(nextState.maxHp, nextState.hp + itemDef.healHp));
  }

  return {
    state: nextState,
    success: true,
    message: `Đã sử dụng ${itemDef.name}.`,
  };
}

/**
 * Xử lý Trang bị vật phẩm từ ba lô vào người (vũ khí, giáp, mũ, khiên)
 */
export function applyEquipGear(
  state: SurvivalPlayerState,
  slotIndex: number
): { state: SurvivalPlayerState; success: boolean; message: string } {
  const nextState: SurvivalPlayerState = {
    ...state,
    equipped: { ...state.equipped },
    inventory: state.inventory.map((s) => ({ ...s })),
  };

  const invSlot = nextState.inventory.find((s) => s.slotIndex === slotIndex);
  if (!invSlot) {
    return { state, success: false, message: "Không tìm thấy vật phẩm trong ô này" };
  }

  const itemDef = getItemDef(invSlot.itemId);
  if (!itemDef) {
    return { state, success: false, message: "Vật phẩm không hợp lệ" };
  }

  let gearSlot: "weapon" | "armor" | "helmet" | "shield" | null = null;
  if (itemDef.category === "weapon") gearSlot = "weapon";
  else if (itemDef.category === "armor") gearSlot = "armor";
  else if (itemDef.category === "helmet") gearSlot = "helmet";
  else if (itemDef.category === "shield") gearSlot = "shield";

  if (!gearSlot) {
    return { state, success: false, message: "Vật phẩm này không thể trang bị" };
  }

  const currentEquipped = nextState.equipped[gearSlot];

  // Gỡ bỏ slot này trong inventory
  nextState.inventory = nextState.inventory.filter((s) => s.slotIndex !== slotIndex);

  // Nếu đã có trang bị đang mặc ở ô đó, hoán đổi đưa vào inventory
  if (currentEquipped) {
    const { inventory, success } = addItemToInventory(
      nextState.inventory,
      currentEquipped.itemId,
      1,
      currentEquipped.durability
    );
    if (!success) {
      return { state, success: false, message: "Túi đồ không đủ chỗ để đổi trang bị" };
    }
    nextState.inventory = inventory;
  }

  // Mặc trang bị mới
  nextState.equipped[gearSlot] = {
    itemId: itemDef.id,
    durability: invSlot.durability ?? itemDef.durability ?? 50,
    enhancedLevel: 0,
  };

  return {
    state: nextState,
    success: true,
    message: `Đã trang bị ${itemDef.name}!`,
  };
}

/**
 * Xử lý Giao dịch Thợ rèn / Cửa hàng mua vật phẩm bằng xu
 */
export function applyBlacksmith(
  state: SurvivalPlayerState,
  action: "buy_gear" | "repair" | "enhance",
  itemId: string
): { state: SurvivalPlayerState; success: boolean; message: string } {
  const nextState = { ...state, equipped: { ...state.equipped } };
  const itemDef = getItemDef(itemId);

  if (action === "buy_gear") {
    if (!itemDef || itemDef.buyPrice <= 0) {
      return { state, success: false, message: "Vật phẩm không hợp lệ để mua" };
    }
    if (nextState.coins < itemDef.buyPrice) {
      return { state, success: false, message: "Bạn không đủ xu để mua vật phẩm này" };
    }

    // Nếu là trang bị và ô đó người chơi đang để trống -> tự động trang bị luôn
    let autoEquipped = false;
    if (itemDef.category === "weapon" && !nextState.equipped.weapon) {
      nextState.equipped.weapon = {
        itemId,
        durability: itemDef.durability || 40,
        enhancedLevel: 0,
      };
      autoEquipped = true;
    } else if (itemDef.category === "armor" && !nextState.equipped.armor) {
      nextState.equipped.armor = {
        itemId,
        durability: itemDef.durability || 50,
        enhancedLevel: 0,
      };
      autoEquipped = true;
    } else if (itemDef.category === "helmet" && !nextState.equipped.helmet) {
      nextState.equipped.helmet = {
        itemId,
        durability: itemDef.durability || 40,
        enhancedLevel: 0,
      };
      autoEquipped = true;
    } else if (itemDef.category === "shield" && !nextState.equipped.shield) {
      nextState.equipped.shield = {
        itemId,
        durability: itemDef.durability || 45,
        enhancedLevel: 0,
      };
      autoEquipped = true;
    } else {
      const { inventory, success } = addItemToInventory(nextState.inventory, itemId, 1);
      if (!success) {
        return { state, success: false, message: "Túi đồ của bạn đã đầy" };
      }
      nextState.inventory = inventory;
    }

    nextState.coins -= itemDef.buyPrice;

    return {
      state: nextState,
      success: true,
      message: autoEquipped
        ? `Đã mua và trang bị ngay ${itemDef.name}!`
        : `Đã mua thành công ${itemDef.name}!`,
    };
  }

  if (action === "repair") {
    // Sửa trang bị theo itemId hoặc ô trang bị tương ứng
    let gear: EquippedItem | undefined = nextState.equipped.weapon;
    if (itemId === "armor" || nextState.equipped.armor?.itemId === itemId) {
      gear = nextState.equipped.armor;
    } else if (itemId === "helmet" || nextState.equipped.helmet?.itemId === itemId) {
      gear = nextState.equipped.helmet;
    } else if (itemId === "shield" || nextState.equipped.shield?.itemId === itemId) {
      gear = nextState.equipped.shield;
    } else if (itemId === "weapon" || nextState.equipped.weapon?.itemId === itemId) {
      gear = nextState.equipped.weapon;
    }

    if (!gear) {
      return { state, success: false, message: "Chưa có trang bị nào ở ô này để sửa" };
    }
    const def = getItemDef(gear.itemId);
    const repairCost = Math.max(5, Math.round((def?.buyPrice || 40) * 0.3));

    if (nextState.coins < repairCost) {
      return { state, success: false, message: `Cần ${repairCost} xu để sửa trang bị` };
    }

    nextState.coins -= repairCost;
    gear.durability = def?.durability || 50;

    return {
      state: nextState,
      success: true,
      message: `Đã phục hồi độ bền cho ${def?.name || "trang bị"}!`,
    };
  }

  if (action === "enhance") {
    // Cường hóa vũ khí: Tốn 1 pha lê + 50 xu
    const weapon = nextState.equipped.weapon;
    if (!weapon) {
      return { state, success: false, message: "Chưa trang bị vũ khí để cường hóa" };
    }
    if (nextState.coins < 50 || countItemInInventory(nextState.inventory, "crystal") < 1) {
      return { state, success: false, message: "Cần 50 xu và 1 Pha Lê để cường hóa" };
    }

    const { inventory } = removeItemFromInventory(nextState.inventory, "crystal", 1);
    nextState.inventory = inventory;
    nextState.coins -= 50;
    weapon.enhancedLevel = (weapon.enhancedLevel || 0) + 1;

    return {
      state: nextState,
      success: true,
      message: `Cường hóa thành công lên +${weapon.enhancedLevel}! (+4 Sát thương)`,
    };
  }

  return { state, success: false, message: "Hành động không hợp lệ" };
}

/**
 * Xử lý Đợt tấn công đêm (Night Defense)
 */
export function applyNightDefense(
  state: SurvivalPlayerState,
  answerScore: number
): { state: SurvivalPlayerState; success: boolean; message: string } {
  const nextState = { ...state, camp: { ...state.camp } };

  if (answerScore >= 0.5) {
    // Đẩy lùi quái đêm thành công
    nextState.nightWavesSurvived += 1;
    nextState.coins += 40;
    nextState.score += 800;

    return {
      state: nextState,
      success: true,
      message: "Bạn đã bảo vệ lửa trại thành công! (+40 xu, +800 điểm)",
    };
  } else {
    // Bị quái đêm cắn phá hàng rào hoặc lửa trại
    if (nextState.camp.barricades > 0) {
      nextState.camp.barricades -= 1;
    } else {
      nextState.camp.hp = Math.max(0, nextState.camp.hp - 25);
      nextState.hp = Math.max(1, nextState.hp - 15);
    }

    return {
      state: nextState,
      success: false,
      message: "Hàng rào phòng thủ bị quái đêm công phá! Bạn chịu 15 sát thương.",
    };
  }
}

/**
 * Hồi sinh tại Trại sau khi ngất xỉu
 */
export function applyRevive(state: SurvivalPlayerState): SurvivalPlayerState {
  const nextState = { ...state };
  nextState.hp = SURVIVAL_CONFIG.MAX_HP;
  nextState.hunger = 100;
  // Xu được bảo lưu 100%, không bị mất khi ngất xỉu
  nextState.coins = Number.isFinite(state.coins) ? state.coins : 0;
  nextState.score = Number.isFinite(state.score) ? state.score : 0;
  nextState.currentBattle = null;
  nextState.streak = 0;
  return nextState;
}

