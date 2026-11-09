export const SURVIVAL_CONFIG = {
  // Chu kỳ ngày đêm (240 giây = 1 ngày Foggo)
  DAY_DURATION_SEC: 150,
  NIGHT_DURATION_SEC: 90,
  TOTAL_CYCLE_SEC: 240,

  // Chỉ số cơ bản của người chơi (Cân bằng & thân thiện cho tân thủ)
  MAX_HP: 100,
  MAX_HUNGER: 100,
  INITIAL_GOLD: 50,
  BASE_ATK: 12,
  MAX_INVENTORY_SLOTS: 16,
  MAX_STACK_SIZE: 20,

  // Quy tắc đói & mất máu
  HUNGER_TICK_SEC: 6, // 1 điểm đói mỗi 6 giây (10 phút mới cạn)
  STARVING_HP_LOSS_SEC: 4, // Đói = 0: mất 1 HP mỗi 4 giây

  // Giữ nguyên 100% xu và trang bị khi ngất xỉu (không trừ xu của người chơi)
  DEATH_GOLD_KEEP_RATIO: 1.0,
  DEATH_MATERIAL_LOSS_RATIO: 1.0,

  // Tăng tiến sức mạnh quái theo ngày
  MONSTER_HP_GROWTH_PER_DAY: 0.10, // +10% HP mỗi ngày
  MONSTER_ATK_GROWTH_PER_DAY: 0.08, // +8% ATK mỗi ngày

  // Tăng tiến ban đêm
  NIGHT_MONSTER_BUFF_RATIO: 0.20, // Quái đêm mạnh hơn 20%
  NIGHT_REWARD_BONUS_RATIO: 0.30, // Thưởng xu đêm +30%

  // Thời gian hồi quái
  MONSTER_RESPAWN_SEC: 20,

  // Khu vực
  ZONES: {
    forest: {
      id: "forest",
      name: "Rừng Xanh",
      icon: "Trees",
      description: "Khu rừng ngập tràn sương sớm, nơi sinh sống của Slime, Sói và Heo rừng.",
      requiredCampLevel: 1,
      bossId: "boar_king",
    },
    cave: {
      id: "cave",
      name: "Hang Đá",
      icon: "Mountain",
      description: "Hang động tối tăm đầy thạch nhũ, nơi ẩn náu của Dơi, Bộ xương và Golem Đá.",
      requiredCampLevel: 2,
      bossId: "rock_golem",
    },
    swamp: {
      id: "swamp",
      name: "Đầm Lầy Độc",
      icon: "Skull",
      description: "Vùng nước độc bốc khói tím ma mị, nơi cư ngụ của Cóc độc và Phù Thủy Đầm Lầy.",
      requiredCampLevel: 3,
      bossId: "swamp_witch",
    },
  },

  // Cơ chế sương mù Foggo
  FOG: {
    INITIAL_PCT: 100,
    BASE_REDUCTION_PCT: 5,
    WRONG_INCREASE_PCT: 2,
    NIGHT_RECURRENCE_PCT: 10,
    THRESHOLDS: {
      RICH_RESOURCES: 70, // Sương <= 70%: Lộ bãi tài nguyên giàu
      DISCOVERY_CHEST: 50, // Sương <= 50%: Lộ rương kho báu
      BOSS_LAIR: 30, // Sương <= 30%: Lộ hang trùm
      CLEARED: 0, // Sương 0%: Khám phá 100%
    },
  },
} as const;

