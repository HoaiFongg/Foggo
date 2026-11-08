import { SURVIVAL_CONFIG } from "./config";

export interface SurvivalClockInfo {
  dayNumber: number;
  phase: "day" | "night";
  isDay: boolean;
  cycleSec: number;
  phaseRemainingSec: number;
  nextNightInSec: number;
  lightPct: number; // 0 .. 100% ánh sáng
  formattedTime: string;
}

/**
 * Hàm thuần túy tính toán đồng hồ ngày/đêm từ số giây chơi tích lũy (playSec)
 */
export function getSurvivalClock(playSec: number): SurvivalClockInfo {
  const safePlaySec = Math.max(0, Math.floor(playSec));
  const cycle = SURVIVAL_CONFIG.TOTAL_CYCLE_SEC;
  const dayDuration = SURVIVAL_CONFIG.DAY_DURATION_SEC;

  const dayNumber = Math.floor(safePlaySec / cycle) + 1;
  const cycleSec = safePlaySec % cycle;

  const isDay = cycleSec < dayDuration;
  const phase: "day" | "night" = isDay ? "day" : "night";

  const phaseRemainingSec = isDay
    ? dayDuration - cycleSec
    : cycle - cycleSec;

  const nextNightInSec = isDay
    ? dayDuration - cycleSec
    : 0;

  // Tính tỷ lệ ánh sáng tự nhiên
  let lightPct = 100;
  if (isDay) {
    // 0s .. 150s: Bình minh -> Buổi trưa -> Hoàng hôn
    const dayProgress = cycleSec / dayDuration; // 0.0 .. 1.0
    // Sáng dần lên 100% rồi giảm về 40% lúc hoàng hôn
    lightPct = Math.round(40 + 60 * Math.sin(dayProgress * Math.PI));
  } else {
    // 150s .. 240s: Đêm tối Foggo (từ 35% xuống 10% rồi hửng sáng 40%)
    const nightSec = cycleSec - dayDuration; // 0 .. 90s
    const nightProgress = nightSec / (cycle - dayDuration);
    lightPct = Math.round(35 - 25 * Math.sin(nightProgress * Math.PI));
  }

  // Giờ hiển thị mô phỏng RPG (Ngày bắt đầu lúc 06:00, Đêm lúc 18:00, Ngày mới lúc 06:00)
  // 240 giây game = 24 giờ trong thế giới ảo Foggo (10 giây game = 1 giờ ảo)
  const simulatedHour = Math.floor((cycleSec / cycle) * 24 + 6) % 24;
  const simulatedMinute = Math.floor(((cycleSec % 10) / 10) * 60);
  const formattedTime = `${String(simulatedHour).padStart(2, "0")}:${String(
    simulatedMinute
  ).padStart(2, "0")}`;

  return {
    dayNumber,
    phase,
    isDay,
    cycleSec,
    phaseRemainingSec,
    nextNightInSec,
    lightPct: Math.max(10, Math.min(100, lightPct)),
    formattedTime,
  };
}

