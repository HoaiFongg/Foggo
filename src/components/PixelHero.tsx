"use client";

import React, { useMemo } from "react";
import { PixelItemIcon } from "./PixelItemIcon";

export interface PixelHeroProps {
  heroAnim?: "idle" | "attack" | "hurt" | "flee" | "victory";
  weaponId?: string | null;
  armorId?: string | null;
  helmetId?: string | null;
  shieldId?: string | null;
  className?: string;
  size?: number; // pixel width/height (defaults to 112)
  showShadow?: boolean;
  showEquipBadges?: boolean;
}

/**
 * PixelHero: Nhân vật Hiệp Sĩ / Nhà Thám Hiểm phong cách Pixel Art Chibi sống động
 * Hệ thống Modular Paper-Doll Engine tự động cập nhật ngoại hình theo trang bị:
 * 1. Base Sprite: 8 khung hình sprite sắc nét (Idle, Walk, Sword Attack, Staff Attack, Bow Attack, Hurt, Victory, Sit)
 * 2. Phân tầng trang bị (Paper-Doll Layers):
 *    - Back Cape: Áo choàng đỏ hiệp sĩ hoàng gia / Áo choàng pháp sư tím / Ống tên thợ săn
 *    - Headgear: Mũ sắt hiệp sĩ lông vũ đỏ / Mũ da sói có tai / Mũ rơm lữ hành
 *    - Armor Plating: Giáp hoàng gia dát vàng / Giáp sắt kiên cố / Áo choàng pháp sư thêu ngọc / Giáp da sói
 *    - Off-hand Shield: Khiên hộ mệnh pha lê phát sáng / Khiên sắt chữ thập / Khiên gỗ đinh tán
 *    - Weapon VFX & Aura: Lửa rực cháy (Fire Staff), Pha lê tỏa sáng (Crystal Sword), Vầng hào quang ma thuật (Magic Staff)
 *    - Combat VFX: Vệt chém trăng khuyết vàng rực / Cầu lửa ma thuật / Mũi tên phong linh khi tấn công
 */
export const PixelHero: React.FC<PixelHeroProps> = ({
  heroAnim = "idle",
  weaponId,
  armorId,
  helmetId,
  shieldId,
  className = "",
  size = 112,
  showShadow = true,
  showEquipBadges = true,
}) => {
  // Xác định dòng vũ khí
  const weaponType = useMemo(() => {
    if (!weaponId) return "none";
    if (weaponId.includes("fire_staff")) return "fire_staff";
    if (weaponId.includes("staff")) return "staff";
    if (weaponId.includes("bow")) return "bow";
    if (weaponId.includes("axe")) return "axe";
    if (weaponId.includes("club")) return "club";
    if (weaponId.includes("crystal")) return "crystal_sword";
    return "sword";
  }, [weaponId]);

  // Phân loại giáp
  const armorType = useMemo(() => {
    if (!armorId) return "cloth";
    if (armorId.includes("knight")) return "knight";
    if (armorId.includes("mage") || armorId.includes("robe")) return "mage";
    if (armorId.includes("iron")) return "iron";
    if (armorId.includes("leather")) return "leather";
    return "cloth";
  }, [armorId]);

  // Phân loại mũ
  const helmetType = useMemo(() => {
    if (!helmetId) return "none";
    if (helmetId.includes("straw")) return "straw";
    if (helmetId.includes("leather")) return "leather";
    if (helmetId.includes("iron")) return "iron";
    return "none";
  }, [helmetId]);

  // Phân loại khiên
  const shieldType = useMemo(() => {
    if (!shieldId) return "none";
    if (shieldId.includes("magic") || shieldId.includes("crystal")) return "magic";
    if (shieldId.includes("iron")) return "iron";
    if (shieldId.includes("wooden") || shieldId.includes("wood")) return "wood";
    return "none";
  }, [shieldId]);

  // Chọn frame hình ảnh Sprite chính
  const spriteSrc = useMemo(() => {
    if (heroAnim === "hurt") return "/sprites/hero/hurt.png";
    if (heroAnim === "flee") return "/sprites/hero/walk.png";
    if (heroAnim === "victory") return "/sprites/hero/victory.png";
    if (heroAnim === "attack") {
      if (weaponType === "staff" || weaponType === "fire_staff") {
        return "/sprites/hero/staff_attack.png";
      }
      if (weaponType === "bow") {
        return "/sprites/hero/bow_attack.png";
      }
      return "/sprites/hero/sword_attack.png";
    }
    return "/sprites/hero/idle.png";
  }, [heroAnim, weaponType]);

  const isAttacking = heroAnim === "attack";
  const isHurt = heroAnim === "hurt";
  const isFleeing = heroAnim === "flee";
  const isVictory = heroAnim === "victory";

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* KHUNG CHỨA NHÂN VẬT & CÁC LỚP PAPER-DOLL */}
      <div
        className={`relative w-full h-full flex items-center justify-center transition-all duration-150 ${
          isAttacking
            ? "translate-x-3 scale-105"
            : isHurt
            ? "-translate-x-3 filter drop-shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-pulse"
            : isFleeing
            ? "-scale-x-100 translate-x-2"
            : isVictory
            ? "animate-bounce"
            : "hover:scale-105"
        }`}
      >
        {/* =================================================================== */}
        {/* 1. LỚP LƯNG: ÁO CHOÀNG & ỐNG TÊN (BACK CAPE / QUIVER)               */}
        {/* =================================================================== */}
        {armorType === "knight" && (
          <div
            className="absolute top-8 left-2 w-8 h-12 pointer-events-none transition-transform"
            style={{ zIndex: 1 }}
          >
            {/* Áo choàng đỏ hiệp sĩ hoàng gia bay phấp phới */}
            <svg
              viewBox="0 0 32 48"
              className="w-full h-full animate-[pulse_2s_ease-in-out_infinite]"
              shapeRendering="crispEdges"
            >
              <polygon points="10,0 24,0 30,40 18,48 4,44" fill="#991b1b" />
              <polygon points="12,2 22,2 26,38 18,44 8,40" fill="#dc2626" />
              <rect x="14" y="0" width="8" height="4" fill="#fbbf24" />
            </svg>
          </div>
        )}

        {armorType === "mage" && (
          <div
            className="absolute top-8 left-2 w-8 h-12 pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {/* Áo choàng pháp sư tím thẫm huyền bí */}
            <svg
              viewBox="0 0 32 48"
              className="w-full h-full animate-[pulse_2.5s_ease-in-out_infinite]"
              shapeRendering="crispEdges"
            >
              <polygon points="10,0 24,0 30,42 16,48 6,42" fill="#1e1b4b" />
              <polygon points="12,2 22,2 26,38 16,44 8,38" fill="#4338ca" />
              {/* Sao vàng ma thuật */}
              <circle cx="16" cy="40" r="1.5" fill="#facc15" />
            </svg>
          </div>
        )}

        {weaponType === "bow" && (
          <div
            className="absolute top-6 left-3 w-6 h-10 pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {/* Ống tên bằng da thợ săn trên lưng */}
            <svg viewBox="0 0 24 40" className="w-full h-full" shapeRendering="crispEdges">
              <rect x="8" y="10" width="8" height="26" rx="2" fill="#78350f" />
              <line x1="12" y1="2" x2="12" y2="12" stroke="#f8fafc" strokeWidth="1.5" />
              <line x1="9" y1="4" x2="9" y2="12" stroke="#f8fafc" strokeWidth="1.5" />
              <line x1="15" y1="4" x2="15" y2="12" stroke="#f8fafc" strokeWidth="1.5" />
              <polygon points="12,0 10,4 14,4" fill="#38bdf8" />
              <polygon points="9,2 7,6 11,6" fill="#38bdf8" />
              <polygon points="15,2 13,6 17,6" fill="#38bdf8" />
            </svg>
          </div>
        )}

        {/* =================================================================== */}
        {/* 2. BASE SPRITE CHÍNH: HIỆP SĨ PIXEL ART CHIBI 344x384               */}
        {/* =================================================================== */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={spriteSrc}
          alt="Pixel Hero Knight"
          className="relative w-full h-full object-contain [image-rendering:pixelated] select-none pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
          style={{ zIndex: 2 }}
          draggable={false}
        />

        {/* =================================================================== */}
        {/* 3. LỚP MŨ / BẢO HỘ ĐẦU (DYNAMIC HELMET PAPER-DOLL)                  */}
        {/* =================================================================== */}
        {helmetType === "iron" && (
          <div
            className="absolute top-1 left-[28%] w-[44%] h-[28%] pointer-events-none transition-transform"
            style={{ zIndex: 3 }}
          >
            {/* Mũ sắt hiệp sĩ với lông vũ đỏ oai phong */}
            <svg viewBox="0 0 40 28" className="w-full h-full" shapeRendering="crispEdges">
              {/* Chùm lông vũ đỏ phất phới */}
              <polygon points="12,0 18,4 10,10 6,4" fill="#dc2626" />
              <polygon points="16,2 22,6 14,11 10,6" fill="#ef4444" />
              <polygon points="20,4 25,8 18,12 14,8" fill="#f87171" />
              {/* Vòm kim loại mũ sắt */}
              <rect x="8" y="8" width="24" height="6" fill="#64748b" />
              <rect x="10" y="7" width="20" height="2" fill="#94a3b8" />
              <rect x="12" y="9" width="16" height="2" fill="#f1f5f9" />
              <circle cx="20" cy="9" r="1.5" fill="#fbbf24" />
            </svg>
          </div>
        )}

        {helmetType === "leather" && (
          <div
            className="absolute top-2 left-[28%] w-[44%] h-[24%] pointer-events-none"
            style={{ zIndex: 3 }}
          >
            {/* Mũ da sói với 2 tai nhọn cá tính */}
            <svg viewBox="0 0 40 24" className="w-full h-full" shapeRendering="crispEdges">
              <polygon points="8,0 14,10 6,10" fill="#78350f" />
              <polygon points="9,2 13,8 8,8" fill="#fca5a5" />
              <polygon points="32,0 34,10 26,10" fill="#78350f" />
              <polygon points="31,2 33,8 28,8" fill="#fca5a5" />
              <rect x="8" y="8" width="24" height="4" fill="#92400e" />
              <rect x="10" y="9" width="20" height="2" fill="#b45309" />
            </svg>
          </div>
        )}

        {helmetType === "straw" && (
          <div
            className="absolute -top-1 left-[20%] w-[60%] h-[30%] pointer-events-none"
            style={{ zIndex: 3 }}
          >
            {/* Mũ rơm lữ hành rộng vành */}
            <svg viewBox="0 0 48 24" className="w-full h-full" shapeRendering="crispEdges">
              <ellipse cx="24" cy="16" rx="22" ry="6" fill="#ca8a04" />
              <ellipse cx="24" cy="15" rx="20" ry="5" fill="#eab308" />
              <rect x="16" y="8" width="16" height="8" rx="3" fill="#fde047" />
              <rect x="16" y="14" width="16" height="2" fill="#78350f" />
            </svg>
          </div>
        )}

        {/* =================================================================== */}
        {/* 4. LỚP GIÁP / CHESTPLATE ACCENTS (DYNAMIC ARMOR OVERLAY)            */}
        {/* =================================================================== */}
        {armorType === "knight" && (
          <div
            className="absolute top-[36%] left-[32%] w-[36%] h-[28%] pointer-events-none"
            style={{ zIndex: 3 }}
          >
            {/* Tấm giáp ngực hiệp sĩ mạ vàng & đai thắt lưng */}
            <svg viewBox="0 0 36 28" className="w-full h-full" shapeRendering="crispEdges">
              <rect x="6" y="4" width="24" height="18" rx="2" fill="#94a3b8" />
              <rect x="8" y="6" width="20" height="14" fill="#cbd5e1" />
              {/* Biểu tượng chữ thập hoàng gia vàng */}
              <rect x="16" y="8" width="4" height="10" fill="#f59e0b" />
              <rect x="13" y="11" width="10" height="4" fill="#f59e0b" />
              <circle cx="18" cy="13" r="1.5" fill="#ffffff" />
            </svg>
          </div>
        )}

        {armorType === "mage" && (
          <div
            className="absolute top-[38%] left-[32%] w-[36%] h-[30%] pointer-events-none"
            style={{ zIndex: 3 }}
          >
            {/* Phù hiệu ngọc ma thuật trước ngực */}
            <svg viewBox="0 0 36 30" className="w-full h-full" shapeRendering="crispEdges">
              <polygon points="18,4 26,16 18,26 10,16" fill="#6366f1" />
              <polygon points="18,7 23,16 18,23 13,16" fill="#a855f7" />
              <circle cx="18" cy="16" r="2.5" fill="#ffffff" className="animate-pulse" />
            </svg>
          </div>
        )}

        {/* =================================================================== */}
        {/* 5. LỚP KHIÊN BẢO VỆ PHÍA TRƯỚC (DYNAMIC SHIELD PAPER-DOLL)          */}
        {/* =================================================================== */}
        {shieldType === "magic" && (
          <div
            className="absolute top-[28%] -left-1 w-10 h-14 pointer-events-none animate-[pulse_2s_ease-in-out_infinite]"
            style={{ zIndex: 4 }}
          >
            {/* Khiên năng lượng Pha Lê Aura (Crystal Aegis) */}
            <svg viewBox="0 0 32 44" className="w-full h-full" shapeRendering="crispEdges">
              <polygon
                points="16,2 30,10 30,30 16,42 2,30 2,10"
                fill="#0284c7"
                fillOpacity="0.45"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <polygon
                points="16,6 26,13 26,27 16,36 6,27 6,13"
                fill="#38bdf8"
                fillOpacity="0.6"
              />
              <circle cx="16" cy="20" r="3.5" fill="#ffffff" />
            </svg>
          </div>
        )}

        {shieldType === "iron" && (
          <div
            className="absolute top-[32%] -left-1 w-9 h-12 pointer-events-none"
            style={{ zIndex: 4 }}
          >
            {/* Khiên sắt hiệp sĩ chữ thập xanh */}
            <svg viewBox="0 0 28 36" className="w-full h-full" shapeRendering="crispEdges">
              <polygon points="2,2 26,2 26,24 14,34 2,24" fill="#334155" />
              <polygon points="4,4 24,4 24,22 14,31 4,22" fill="#94a3b8" />
              <rect x="12" y="6" width="4" height="20" fill="#2563eb" />
              <rect x="6" y="12" width="16" height="4" fill="#2563eb" />
            </svg>
          </div>
        )}

        {shieldType === "wood" && (
          <div
            className="absolute top-[36%] -left-0.5 w-8 h-10 pointer-events-none"
            style={{ zIndex: 4 }}
          >
            {/* Khiên gỗ tròn đinh tán */}
            <svg viewBox="0 0 28 28" className="w-full h-full" shapeRendering="crispEdges">
              <circle cx="14" cy="14" r="13" fill="#78350f" />
              <circle cx="14" cy="14" r="10" fill="#92400e" />
              <circle cx="14" cy="14" r="4" fill="#cbd5e1" />
              <rect x="13" y="3" width="2" height="2" fill="#cbd5e1" />
              <rect x="13" y="23" width="2" height="2" fill="#cbd5e1" />
              <rect x="3" y="13" width="2" height="2" fill="#cbd5e1" />
              <rect x="23" y="13" width="2" height="2" fill="#cbd5e1" />
            </svg>
          </div>
        )}

        {/* =================================================================== */}
        {/* 6. VŨ KHÍ NGUYÊN TỐ & HIỆU ỨNG CHIẾN ĐẤU (WEAPON ELEMENTAL VFX)     */}
        {/* =================================================================== */}
        {weaponType === "fire_staff" && (
          <div
            className="absolute top-2 right-1 w-8 h-8 pointer-events-none animate-pulse"
            style={{ zIndex: 4 }}
          >
            {/* Ngọn lửa ma thuật cổ đại rực sáng trên đầu gậy */}
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <circle cx="12" cy="12" r="6" fill="#ea580c" fillOpacity="0.8" />
              <circle cx="12" cy="12" r="3.5" fill="#f59e0b" />
              <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
            </svg>
          </div>
        )}

        {weaponType === "crystal_sword" && (
          <div
            className="absolute top-3 right-0 w-8 h-8 pointer-events-none animate-pulse"
            style={{ zIndex: 4 }}
          >
            {/* Hào quang pha lê lấp lánh trên kiếm */}
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <circle cx="14" cy="10" r="5" fill="#38bdf8" fillOpacity="0.75" />
              <polygon points="14,4 17,10 14,16 11,10" fill="#ffffff" />
            </svg>
          </div>
        )}

        {/* VỆT CHÉM / TIA PHÉP KHI TẤN CÔNG (ATTACK SLICE / BOLT VFX) */}
        {isAttacking && (
          <div
            className="absolute -right-4 top-[15%] w-12 h-16 pointer-events-none z-10"
          >
            {weaponType === "staff" || weaponType === "fire_staff" ? (
              // Cầu ma thuật phóng thẳng vào quái vật
              <div className="w-full h-full flex items-center justify-center animate-ping">
                <div
                  className={`w-6 h-6 rounded-full blur-[1px] ${
                    weaponType === "fire_staff"
                      ? "bg-gradient-to-r from-amber-400 to-rose-600 shadow-[0_0_15px_#f97316]"
                      : "bg-gradient-to-r from-sky-300 to-indigo-500 shadow-[0_0_15px_#38bdf8]"
                  }`}
                />
              </div>
            ) : weaponType === "bow" ? (
              // Mũi tên ánh sáng lao vút đi
              <svg viewBox="0 0 40 20" className="w-full h-full animate-pulse">
                <line x1="2" y1="10" x2="34" y2="10" stroke="#38bdf8" strokeWidth="2.5" />
                <polygon points="38,10 30,5 30,15" fill="#38bdf8" />
              </svg>
            ) : (
              // Vệt chém trăng khuyết vàng rực
              <svg viewBox="0 0 40 40" className="w-full h-full animate-ping">
                <path
                  d="M 6,4 A 20,20 0 0,1 36,32"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* HIỆU ỨNG BÓNG CHÂN NHÂN VẬT */}
      {showShadow && (
        <div className="w-14 h-2 -mt-1 bg-black/45 rounded-full blur-[2px] transition-all" />
      )}

      {/* MINI PAPER-DOLL GEAR BADGES (Hiển thị trang bị đang mang bên góc) */}
      {showEquipBadges && (weaponId || shieldId || armorId || helmetId) && (
        <div className="absolute -bottom-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-950/90 border border-slate-800 shadow-lg z-10">
          {weaponId && (
            <div className="w-4 h-4 flex items-center justify-center" title={`Weapon: ${weaponId}`}>
              <PixelItemIcon itemId={weaponId} size={14} />
            </div>
          )}
          {shieldId && (
            <div className="w-4 h-4 flex items-center justify-center" title={`Shield: ${shieldId}`}>
              <PixelItemIcon itemId={shieldId} size={14} />
            </div>
          )}
          {armorId && (
            <div className="w-4 h-4 flex items-center justify-center" title={`Armor: ${armorId}`}>
              <PixelItemIcon itemId={armorId} size={14} />
            </div>
          )}
          {helmetId && (
            <div className="w-4 h-4 flex items-center justify-center" title={`Helmet: ${helmetId}`}>
              <PixelItemIcon itemId={helmetId} size={14} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
