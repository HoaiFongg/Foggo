export type ItemCategory =
  | "material"
  | "food"
  | "weapon"
  | "armor"
  | "consumable"
  | "camp";

export type ItemRarity = "common" | "rare" | "epic" | "legendary";

export interface SurvivalItemDef {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: ItemRarity;
  description: string;
  icon: string;
  stackLimit: number;
  buyPrice: number; // Giá mua từ Thương nhân / Thợ rèn (0 nếu không bán)
  sellPrice: number; // Giá bán lại
  // Chỉ số
  atk?: number;
  durability?: number;
  defensePct?: number;
  healHp?: number;
  healHunger?: number;
  campHpBonus?: number;
  burnsCold?: boolean;
}

export const ITEM_REGISTRY: Record<string, SurvivalItemDef> = {
  // === NGUYÊN LIỆU (MATERIALS) ===
  wood: {
    id: "wood",
    name: "Gỗ Rừng",
    category: "material",
    rarity: "common",
    description: "Nhánh củi khô từ rừng Foggo, dùng để nhóm lửa và chế tạo gậy, hàng rào.",
    icon: "TreePine",
    stackLimit: 20,
    buyPrice: 6,
    sellPrice: 3,
  },
  stone: {
    id: "stone",
    name: "Đá Cuội",
    category: "material",
    rarity: "common",
    description: "Khối đá cứng thu được khi khai thác, dùng đẽo rìu đá và gia cố tường trại.",
    icon: "Gem",
    stackLimit: 20,
    buyPrice: 8,
    sellPrice: 4,
  },
  iron_ore: {
    id: "iron_ore",
    name: "Quặng Sắt",
    category: "material",
    rarity: "rare",
    description: "Quặng kim loại rắn chắc trong hang động, dùng để rèn kiếm sắt và giáp sắt.",
    icon: "Shield",
    stackLimit: 20,
    buyPrice: 20,
    sellPrice: 10,
  },
  leather: {
    id: "leather",
    name: "Da Thú",
    category: "material",
    rarity: "common",
    description: "Tấm da dẻo dai từ sói và heo rừng, dùng may áo giáp nhẹ.",
    icon: "Scroll",
    stackLimit: 20,
    buyPrice: 12,
    sellPrice: 6,
  },
  bone: {
    id: "bone",
    name: "Xương Trắng",
    category: "material",
    rarity: "common",
    description: "Mảnh xương sót lại từ bộ xương bóng đêm.",
    icon: "Bone",
    stackLimit: 20,
    buyPrice: 10,
    sellPrice: 5,
  },
  slime_gel: {
    id: "slime_gel",
    name: "Chất Nhầy Slime",
    category: "material",
    rarity: "common",
    description: "Dung dịch nhớt có độ kết dính cao, dùng pha chế thuốc.",
    icon: "Droplet",
    stackLimit: 20,
    buyPrice: 8,
    sellPrice: 4,
  },
  crystal: {
    id: "crystal",
    name: "Pha Lê Sáng",
    category: "material",
    rarity: "epic",
    description: "Viên tinh thể tỏa sáng ma thuật, nguyên liệu của vũ khí huyền thoại.",
    icon: "Sparkles",
    stackLimit: 10,
    buyPrice: 80,
    sellPrice: 40,
  },
  herb: {
    id: "herb",
    name: "Thảo Dược Xanh",
    category: "material",
    rarity: "common",
    description: "Lá cây có khả năng sát trùng và phục hồi sinh lực.",
    icon: "Leaf",
    stackLimit: 20,
    buyPrice: 10,
    sellPrice: 5,
  },
  gold_tusk: {
    id: "gold_tusk",
    name: "Ngà Heo Vàng",
    category: "material",
    rarity: "epic",
    description: "Chiếc ngà vàng óng ánh đoạt được từ Heo Rừng Chúa.",
    icon: "Trophy",
    stackLimit: 5,
    buyPrice: 0,
    sellPrice: 100,
  },

  // === THỨC ĂN (FOOD) ===
  apple: {
    id: "apple",
    name: "Táo Rừng",
    category: "food",
    rarity: "common",
    description: "Quả táo dại ngọt ngào, xua tan cơn đói tức thì.",
    icon: "Apple",
    stackLimit: 20,
    buyPrice: 10,
    sellPrice: 5,
    healHunger: 15,
  },
  raw_meat: {
    id: "raw_meat",
    name: "Thịt Sống",
    category: "food",
    rarity: "common",
    description: "Thịt săn được từ thú rừng. Có thể ăn khi nguy cấp nhưng dễ đau bụng (-5 HP).",
    icon: "Drumstick",
    stackLimit: 20,
    buyPrice: 12,
    sellPrice: 6,
    healHunger: 10,
    healHp: -5,
  },
  cooked_meat: {
    id: "cooked_meat",
    name: "Thịt Nướng Thơm",
    category: "food",
    rarity: "common",
    description: "Thịt nướng xèo xèo trên lửa trại, hồi phục nhiều thể lực.",
    icon: "Flame",
    stackLimit: 20,
    buyPrice: 24,
    sellPrice: 12,
    healHunger: 40,
    healHp: 10,
  },
  meat_stew: {
    id: "meat_stew",
    name: "Súp Thịt Rau Rừng",
    category: "food",
    rarity: "rare",
    description: "Bát súp nóng hổi hồi phục thể lực dồi dào và làm ấm người trong đêm.",
    icon: "Soup",
    stackLimit: 10,
    buyPrice: 45,
    sellPrice: 22,
    healHunger: 65,
    healHp: 25,
  },

  // === VŨ KHÍ (WEAPONS) ===
  wooden_club: {
    id: "wooden_club",
    name: "Gậy Gỗ Thô",
    category: "weapon",
    rarity: "common",
    description: "Cây gậy gỗ gồ ghề nhưng đập quái rất đau.",
    icon: "Hammer",
    stackLimit: 1,
    buyPrice: 40,
    sellPrice: 15,
    atk: 12,
    durability: 40,
  },
  stone_axe: {
    id: "stone_axe",
    name: "Rìu Đá",
    category: "weapon",
    rarity: "common",
    description: "Rìu đá đẽo sắc bén, dùng chặt cây và cận chiến.",
    icon: "Axe",
    stackLimit: 1,
    buyPrice: 80,
    sellPrice: 30,
    atk: 18,
    durability: 50,
  },
  stone_sword: {
    id: "stone_sword",
    name: "Kiếm Đá Săn Bắn",
    category: "weapon",
    rarity: "common",
    description: "Lưỡi kiếm mài từ đá phiến, tăng đáng kể sát thương.",
    icon: "Sword",
    stackLimit: 1,
    buyPrice: 120,
    sellPrice: 45,
    atk: 24,
    durability: 60,
  },
  iron_sword: {
    id: "iron_sword",
    name: "Kiếm Sắt Hiệp Sĩ",
    category: "weapon",
    rarity: "rare",
    description: "Thanh kiếm tôi luyện từ quặng sắt tinh khiết, chém sắt như chém bùn.",
    icon: "Sword",
    stackLimit: 1,
    buyPrice: 350,
    sellPrice: 140,
    atk: 40,
    durability: 85,
  },
  crystal_sword: {
    id: "crystal_sword",
    name: "Thanh Kiếm Pha Lê",
    category: "weapon",
    rarity: "epic",
    description: "Vũ khí tỏa ánh hào quang huyền ảo, chém đứt màn đêm sương mù.",
    icon: "Sparkles",
    stackLimit: 1,
    buyPrice: 800,
    sellPrice: 350,
    atk: 65,
    durability: 120,
  },

  // === GIÁP (ARMOR) ===
  leather_armor: {
    id: "leather_armor",
    name: "Áo Giáp Da",
    category: "armor",
    rarity: "common",
    description: "Áo da sói bền bỉ, giảm bớt 15% đòn tấn công của quái.",
    icon: "Shield",
    stackLimit: 1,
    buyPrice: 100,
    sellPrice: 40,
    defensePct: 0.15,
    durability: 50,
  },
  iron_armor: {
    id: "iron_armor",
    name: "Giáp Sắt Rèn",
    category: "armor",
    rarity: "rare",
    description: "Áo giáp kim loại cứng cáp, giảm 30% sát thương nhận vào.",
    icon: "Shield",
    stackLimit: 1,
    buyPrice: 300,
    sellPrice: 120,
    defensePct: 0.30,
    durability: 80,
  },

  // === TIÊU HAO (CONSUMABLE) ===
  bandage: {
    id: "bandage",
    name: "Băng Gạc Thảo Dược",
    category: "consumable",
    rarity: "common",
    description: "Băng vết thương nhanh chóng, hồi phục 30 HP.",
    icon: "HeartPulse",
    stackLimit: 10,
    buyPrice: 20,
    sellPrice: 8,
    healHp: 30,
  },
  healing_potion: {
    id: "healing_potion",
    name: "Bình Máu Lớn",
    category: "consumable",
    rarity: "rare",
    description: "Thần dược pha từ thảo dược và chất nhầy, hồi phục 70 HP.",
    icon: "FlaskConical",
    stackLimit: 5,
    buyPrice: 50,
    sellPrice: 20,
    healHp: 70,
  },

  // === CÔNG TRÌNH TRẠI (CAMP) ===
  wood_fence: {
    id: "wood_fence",
    name: "Hàng Rào Gỗ",
    category: "camp",
    rarity: "common",
    description: "Hàng cọc nhọn phòng thủ trại trước các đợt quái đêm.",
    icon: "Fence",
    stackLimit: 5,
    buyPrice: 40,
    sellPrice: 15,
    campHpBonus: 100,
  },
  campfire: {
    id: "campfire",
    name: "Đống Lửa Trại",
    category: "camp",
    rarity: "common",
    description: "Ngọn lửa bập bùng giúp xua bớt sương lạnh và nướng chín thịt sống.",
    icon: "Flame",
    stackLimit: 1,
    buyPrice: 30,
    sellPrice: 10,
    burnsCold: true,
  },
};

export function getItemDef(id: string): SurvivalItemDef | undefined {
  return ITEM_REGISTRY[id];
}
