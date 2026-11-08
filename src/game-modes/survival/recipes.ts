export interface RecipeIngredient {
  itemId: string;
  qty: number;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  outputItemId: string;
  outputQty: number;
  ingredients: RecipeIngredient[];
  requiredCampLevel: number;
  description: string;
}

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: "craft_wooden_club",
    name: "Gậy Gỗ Thô",
    outputItemId: "wooden_club",
    outputQty: 1,
    requiredCampLevel: 1,
    description: "Ghép các cành gỗ chắc nịch thành một cây gậy phòng thân cơ bản.",
    ingredients: [{ itemId: "wood", qty: 4 }],
  },
  {
    id: "craft_stone_axe",
    name: "Rìu Đá",
    outputItemId: "stone_axe",
    outputQty: 1,
    requiredCampLevel: 1,
    description: "Buộc đá cuội sắc nhọn vào cán gỗ để tăng hiệu suất chặt gỗ và chiến đấu.",
    ingredients: [
      { itemId: "wood", qty: 3 },
      { itemId: "stone", qty: 3 },
    ],
  },
  {
    id: "craft_stone_sword",
    name: "Kiếm Đá Săn Bắn",
    outputItemId: "stone_sword",
    outputQty: 1,
    requiredCampLevel: 1,
    description: "Mài nhẵn phiến đá cứng tạo thành lưỡi kiếm săn thú hữu hiệu.",
    ingredients: [
      { itemId: "wood", qty: 2 },
      { itemId: "stone", qty: 5 },
    ],
  },
  {
    id: "craft_iron_sword",
    name: "Kiếm Sắt Hiệp Sĩ",
    outputItemId: "iron_sword",
    outputQty: 1,
    requiredCampLevel: 2,
    description: "Đúc thanh kiếm từ quặng sắt tinh luyện trong lò rèn trại cấp 2.",
    ingredients: [
      { itemId: "wood", qty: 2 },
      { itemId: "iron_ore", qty: 6 },
    ],
  },
  {
    id: "craft_leather_armor",
    name: "Áo Giáp Da",
    outputItemId: "leather_armor",
    outputQty: 1,
    requiredCampLevel: 1,
    description: "Khâu các tấm da thú rừng dẻo dai thành áo bảo hộ.",
    ingredients: [{ itemId: "leather", qty: 5 }],
  },
  {
    id: "craft_iron_armor",
    name: "Giáp Sắt Rèn",
    outputItemId: "iron_armor",
    outputQty: 1,
    requiredCampLevel: 2,
    description: "Ghép các tấm thép rắn chắc che chở lồng ngực.",
    ingredients: [
      { itemId: "iron_ore", qty: 8 },
      { itemId: "leather", qty: 3 },
    ],
  },
  {
    id: "craft_cooked_meat",
    name: "Nướng Thịt",
    outputItemId: "cooked_meat",
    outputQty: 1,
    requiredCampLevel: 1,
    description: "Nướng miếng thịt sống trên củi lửa để ăn an toàn và hồi nhiều sức.",
    ingredients: [
      { itemId: "raw_meat", qty: 1 },
      { itemId: "wood", qty: 1 },
    ],
  },
  {
    id: "craft_meat_stew",
    name: "Nấu Súp Thịt Rau",
    outputItemId: "meat_stew",
    outputQty: 1,
    requiredCampLevel: 1,
    description: "Nồi súp bốc khói nghi ngút từ thịt tươi, táo rừng và thảo dược.",
    ingredients: [
      { itemId: "raw_meat", qty: 2 },
      { itemId: "apple", qty: 1 },
      { itemId: "herb", qty: 1 },
    ],
  },
  {
    id: "craft_bandage",
    name: "Băng Gạc Cứu Thương",
    outputItemId: "bandage",
    outputQty: 1,
    requiredCampLevel: 1,
    description: "Pha thảo dược nghiền nhỏ với chất nhầy kết dính để tạo băng gạc.",
    ingredients: [
      { itemId: "herb", qty: 2 },
      { itemId: "slime_gel", qty: 1 },
    ],
  },
  {
    id: "craft_healing_potion",
    name: "Bình Máu Lớn",
    outputItemId: "healing_potion",
    outputQty: 1,
    requiredCampLevel: 2,
    description: "Chưng cất tinh chất pha lê và thảo dược thành bình máu thần kỳ.",
    ingredients: [
      { itemId: "herb", qty: 3 },
      { itemId: "slime_gel", qty: 2 },
      { itemId: "crystal", qty: 1 },
    ],
  },
  {
    id: "craft_wood_fence",
    name: "Hàng Rào Gỗ",
    outputItemId: "wood_fence",
    outputQty: 1,
    requiredCampLevel: 1,
    description: "Gia cố hàng rào quanh lửa trại để chống đỡ quái vật ban đêm.",
    ingredients: [{ itemId: "wood", qty: 6 }],
  },
  {
    id: "craft_campfire",
    name: "Đống Lửa Trại",
    outputItemId: "campfire",
    outputQty: 1,
    requiredCampLevel: 1,
    description: "Xếp đá và củi nhóm ngọn lửa sưởi ấm.",
    ingredients: [
      { itemId: "wood", qty: 4 },
      { itemId: "stone", qty: 2 },
    ],
  },
];

export function getRecipe(id: string): CraftingRecipe | undefined {
  return CRAFTING_RECIPES.find((r) => r.id === id);
}

