import { SURVIVAL_CONFIG } from "./config";

export interface LootDrop {
  itemId: string;
  chance: number; // 0.0 .. 1.0 (ví dụ 0.6 = 60%)
  minQty: number;
  maxQty: number;
}

export interface MonsterDef {
  id: string;
  name: string;
  zoneId: "forest" | "cave" | "swamp";
  baseHp: number;
  baseAtk: number;
  minCoins: number;
  maxCoins: number;
  isBoss: boolean;
  avatar: string;
  description: string;
  weakSpotDescription?: string;
  phases?: number;
  lootTable: LootDrop[];
}

export const MONSTER_REGISTRY: Record<string, MonsterDef> = {
  // === RỪNG XANH (FOREST) - QUÁI CƠ BẢN CÂN BẰNG CHỈ SỐ ===
  slime: {
    id: "slime",
    name: "Slime Xanh",
    zoneId: "forest",
    baseHp: 30,
    baseAtk: 5,
    minCoins: 3,
    maxCoins: 6,
    isBoss: false,
    avatar: "💧",
    description: "Khối sinh vật nhầy nhụa chậm chạp trườn qua bụi cỏ, dễ đối phó nhất.",
    lootTable: [
      { itemId: "slime_gel", chance: 0.7, minQty: 1, maxQty: 2 },
      { itemId: "herb", chance: 0.3, minQty: 1, maxQty: 1 },
    ],
  },
  baby_wolf: {
    id: "baby_wolf",
    name: "Sói Con Rừng Sương",
    zoneId: "forest",
    baseHp: 40,
    baseAtk: 6,
    minCoins: 5,
    maxCoins: 8,
    isBoss: false,
    avatar: "🐺",
    description: "Chú sói nhỏ nhanh nhẹn ẩn mình sau những lùm cây ven rừng.",
    lootTable: [
      { itemId: "raw_meat", chance: 0.6, minQty: 1, maxQty: 1 },
      { itemId: "leather", chance: 0.3, minQty: 1, maxQty: 1 },
    ],
  },
  wolf: {
    id: "wolf",
    name: "Sói Xám Rừng Rậm",
    zoneId: "forest",
    baseHp: 55,
    baseAtk: 8,
    minCoins: 7,
    maxCoins: 12,
    isBoss: false,
    avatar: "🐺",
    description: "Kẻ săn mồi nguy hiểm với đôi mắt rực sáng trong màn sương.",
    lootTable: [
      { itemId: "raw_meat", chance: 0.8, minQty: 1, maxQty: 2 },
      { itemId: "leather", chance: 0.5, minQty: 1, maxQty: 1 },
    ],
  },
  mist_spider: {
    id: "mist_spider",
    name: "Nhện Độc Sương Mù",
    zoneId: "forest",
    baseHp: 48,
    baseAtk: 10,
    minCoins: 7,
    maxCoins: 12,
    isBoss: false,
    avatar: "🕷️",
    description: "Loài nhện độc chăng tơ rình mồi trong bóng tối sương mờ.",
    lootTable: [
      { itemId: "slime_gel", chance: 0.5, minQty: 1, maxQty: 2 },
      { itemId: "herb", chance: 0.4, minQty: 1, maxQty: 1 },
    ],
  },
  wild_boar: {
    id: "wild_boar",
    name: "Heo Rừng Nanh Nhọn",
    zoneId: "forest",
    baseHp: 65,
    baseAtk: 9,
    minCoins: 8,
    maxCoins: 14,
    isBoss: false,
    avatar: "🐗",
    description: "Sinh vật hung tợn thích húc ngã người lạ xâm nhập lãnh thổ.",
    lootTable: [
      { itemId: "raw_meat", chance: 0.9, minQty: 1, maxQty: 2 },
      { itemId: "apple", chance: 0.4, minQty: 1, maxQty: 2 },
      { itemId: "leather", chance: 0.4, minQty: 1, maxQty: 1 },
    ],
  },
  forest_goblin: {
    id: "forest_goblin",
    name: "Yêu Tinh Rừng",
    zoneId: "forest",
    baseHp: 80,
    baseAtk: 12,
    minCoins: 12,
    maxCoins: 18,
    isBoss: false,
    avatar: "👺",
    description: "Tên yêu tinh tinh quái thích cướp giật hành lý của người thám hiểm.",
    lootTable: [
      { itemId: "wood", chance: 0.8, minQty: 2, maxQty: 4 },
      { itemId: "stone", chance: 0.6, minQty: 1, maxQty: 3 },
      { itemId: "bandage", chance: 0.3, minQty: 1, maxQty: 1 },
    ],
  },
  boar_king: {
    id: "boar_king",
    name: "Heo Rừng Chúa",
    zoneId: "forest",
    baseHp: 200,
    baseAtk: 16,
    minCoins: 70,
    maxCoins: 110,
    isBoss: true,
    avatar: "👑🐗",
    phases: 2,
    description: "Chúa tể Rừng Xanh sở hữu cặp ngà vàng khổng lồ và sức mạnh càn quét.",
    weakSpotDescription: "Lõi sương mù ở giữa trán",
    lootTable: [
      { itemId: "gold_tusk", chance: 1.0, minQty: 1, maxQty: 1 },
      { itemId: "crystal", chance: 0.5, minQty: 1, maxQty: 2 },
      { itemId: "cooked_meat", chance: 1.0, minQty: 2, maxQty: 4 },
    ],
  },

  // === HANG ĐÁ (CAVE) ===
  bat: {
    id: "bat",
    name: "Dơi Hút Máu",
    zoneId: "cave",
    baseHp: 60,
    baseAtk: 12,
    minCoins: 12,
    maxCoins: 20,
    isBoss: false,
    avatar: "🦇",
    description: "Lao vút từ trần hang trong bóng tối.",
    lootTable: [
      { itemId: "stone", chance: 0.4, minQty: 1, maxQty: 2 },
      { itemId: "bone", chance: 0.5, minQty: 1, maxQty: 1 },
    ],
  },
  skeleton: {
    id: "skeleton",
    name: "Bộ Xương Cổ Đại",
    zoneId: "cave",
    baseHp: 110,
    baseAtk: 18,
    minCoins: 20,
    maxCoins: 30,
    isBoss: false,
    avatar: "💀",
    description: "Tàn tích của những nhà thám hiểm xấu số trong hang tối.",
    lootTable: [
      { itemId: "bone", chance: 0.8, minQty: 2, maxQty: 4 },
      { itemId: "iron_ore", chance: 0.35, minQty: 1, maxQty: 2 },
    ],
  },
  small_golem: {
    id: "small_golem",
    name: "Golem Nhỏ",
    zoneId: "cave",
    baseHp: 160,
    baseAtk: 22,
    minCoins: 30,
    maxCoins: 45,
    isBoss: false,
    avatar: "🗿",
    description: "Người đá chuyển động được nuôi dưỡng bởi ma thuật pha lê.",
    lootTable: [
      { itemId: "stone", chance: 1.0, minQty: 2, maxQty: 4 },
      { itemId: "iron_ore", chance: 0.6, minQty: 1, maxQty: 2 },
      { itemId: "crystal", chance: 0.1, minQty: 1, maxQty: 1 },
    ],
  },
  rock_golem: {
    id: "rock_golem",
    name: "Golem Đá Khổng Lồ",
    zoneId: "cave",
    baseHp: 700,
    baseAtk: 32,
    minCoins: 200,
    maxCoins: 300,
    isBoss: true,
    avatar: "👑🗿",
    phases: 3,
    description: "Hộ vệ cổ xưa bảo vệ mỏ pha lê, lớp giáp đá miễn nhiễm với vũ khí thô sơ.",
    weakSpotDescription: "Viên pha lê đỏ ở ngực trái",
    lootTable: [
      { itemId: "crystal", chance: 1.0, minQty: 2, maxQty: 3 },
      { itemId: "iron_ore", chance: 0.9, minQty: 3, maxQty: 6 },
    ],
  },
};

/**
 * Tính toán chỉ số quái theo ngày chơi và thời gian đêm
 */
export function getScaledMonster(
  monsterId: string,
  dayNumber: number,
  isNight: boolean = false
): MonsterDef & { hp: number; atk: number } {
  const base = MONSTER_REGISTRY[monsterId] || MONSTER_REGISTRY.slime;
  const dayFactor = Math.max(0, dayNumber - 1);

  const hpScale = 1 + dayFactor * SURVIVAL_CONFIG.MONSTER_HP_GROWTH_PER_DAY;
  const atkScale = 1 + dayFactor * SURVIVAL_CONFIG.MONSTER_ATK_GROWTH_PER_DAY;

  let scaledHp = Math.round(base.baseHp * hpScale);
  let scaledAtk = Math.round(base.baseAtk * atkScale);

  if (isNight) {
    scaledAtk = Math.round(scaledAtk * (1 + SURVIVAL_CONFIG.NIGHT_MONSTER_BUFF_RATIO));
  }

  return {
    ...base,
    hp: scaledHp,
    atk: scaledAtk,
  };
}

/**
 * Lấy ngẫu nhiên một quái vật xuất hiện trong bãi farm
 */
export function getRandomFarmMonster(excludeBoss: boolean = true): MonsterDef {
  const candidates = Object.values(MONSTER_REGISTRY).filter((m) => {
    if (excludeBoss && m.isBoss) return false;
    return m.zoneId === "forest";
  });
  if (candidates.length === 0) return MONSTER_REGISTRY.slime;
  const idx = Math.floor(Math.random() * candidates.length);
  return candidates[idx];
}


