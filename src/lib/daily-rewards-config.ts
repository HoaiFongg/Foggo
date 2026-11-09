export interface DailyRewardItem {
  day: number;
  title: string;
  coins: number;
  fireflies: number;
  icon: string;
  desc: string;
  items: Array<{ itemId: string; qty: number }>;
}

export const DAILY_REWARDS_CONFIG: DailyRewardItem[] = [
  {
    day: 1,
    title: "Ngày 1: Khởi Đầu Thuận Lợi",
    coins: 50,
    fireflies: 10,
    icon: "🪙",
    desc: "+50 Vàng & +10 Đom Đóm",
    items: [],
  },
  {
    day: 2,
    title: "Ngày 2: Dược Liệu Sinh Tồn",
    coins: 80,
    fireflies: 15,
    icon: "🧪",
    desc: "+80 Vàng & +1 Bình Máu Nhỏ",
    items: [{ itemId: "bandage", qty: 2 }],
  },
  {
    day: 3,
    title: "Ngày 3: Tiếp Sức Hành Trình",
    coins: 120,
    fireflies: 20,
    icon: "🪲",
    desc: "+120 Vàng & +20 Đom Đóm",
    items: [],
  },
  {
    day: 4,
    title: "Ngày 4: Giáp Trụ Tân Thủ",
    coins: 150,
    fireflies: 25,
    icon: "🛡️",
    desc: "+150 Vàng, +2 Bánh Mì & Giáp Vải",
    items: [
      { itemId: "apple", qty: 3 },
      { itemId: "leather_armor", qty: 1 },
    ],
  },
  {
    day: 5,
    title: "Ngày 5: Cơn Mưa Đom Đóm",
    coins: 200,
    fireflies: 35,
    icon: "✨",
    desc: "+200 Vàng & +35 Đom Đóm",
    items: [],
  },
  {
    day: 6,
    title: "Ngày 6: Vũ Khí Sắc Bén",
    coins: 250,
    fireflies: 40,
    icon: "⚔️",
    desc: "+250 Vàng & +1 Kiếm Gỗ Rừng",
    items: [{ itemId: "wooden_sword", qty: 1 }],
  },
  {
    day: 7,
    title: "Ngày 7: Rương Báu Hoàng Gia",
    coins: 500,
    fireflies: 60,
    icon: "👑",
    desc: "+500 Vàng, +60 Đom Đóm & Rương Báu",
    items: [
      { itemId: "bandage", qty: 3 },
      { itemId: "iron_ore", qty: 2 },
    ],
  },
];
