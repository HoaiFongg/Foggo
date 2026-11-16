"use client";

import React from "react";

export interface PixelItemIconProps {
  itemId: string;
  size?: number; // width/height in px, defaults to 32
  className?: string;
}

/**
 * PixelItemIcon: Bộ sưu tập đồ họa Pixel Art 16-bit / 32-bit cho toàn bộ trang bị & vật phẩm Foggo
 * Vẽ bằng SVG vector sắc nét với shapeRendering="crispEdges" (sắc nét tuyệt đối trên mọi màn hình).
 */
export const PixelItemIcon: React.FC<PixelItemIconProps> = ({
  itemId,
  size = 32,
  className = "",
}) => {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={`inline-block select-none shrink-0 ${className}`}
    >
      {renderPixelItem(itemId)}
    </svg>
  );
};

function renderPixelItem(id: string): React.ReactNode {
  switch (id) {
    // =========================================================================
    // VŨ KHÍ (WEAPONS)
    // =========================================================================
    case "wooden_club":
      return (
        <g id="item-wooden_club">
          <rect x="7" y="21" width="4" height="4" fill="#451a03" />
          <rect x="10" y="18" width="4" height="4" fill="#78350f" />
          <rect x="13" y="13" width="6" height="6" fill="#92400e" />
          <rect x="18" y="7" width="7" height="7" fill="#b45309" />
          <rect x="20" y="9" width="3" height="3" fill="#d97706" />
          {/* Đinh tán gỗ */}
          <rect x="17" y="12" width="2" height="2" fill="#451a03" />
          <rect x="23" y="6" width="2" height="2" fill="#78350f" />
        </g>
      );

    case "wooden_sword":
      return (
        <g id="item-wooden_sword">
          {/* Chuôi kiếm */}
          <rect x="6" y="22" width="4" height="4" fill="#451a03" />
          {/* Chuôi bảo vệ (Crossguard) */}
          <rect x="8" y="18" width="7" height="3" fill="#78350f" />
          <rect x="9" y="19" width="5" height="1" fill="#b45309" />
          {/* Lưỡi kiếm gỗ */}
          <rect x="12" y="12" width="5" height="7" fill="#92400e" />
          <rect x="15" y="7" width="5" height="7" fill="#b45309" />
          <rect x="18" y="4" width="4" height="5" fill="#d97706" />
          <polygon points="22,4 26,4 22,8" fill="#fde68a" />
        </g>
      );

    case "stone_axe":
      return (
        <g id="item-stone_axe">
          {/* Cán gỗ */}
          <line x1="6" y1="26" x2="22" y2="10" stroke="#78350f" strokeWidth="3" />
          <line x1="7" y1="25" x2="21" y2="11" stroke="#92400e" strokeWidth="1" />
          {/* Lưỡi rìu đá */}
          <path d="M 18,6 L 27,6 L 28,14 L 20,16 Z" fill="#475569" />
          <path d="M 20,7 L 26,7 L 27,13 L 21,14 Z" fill="#64748b" />
          <rect x="23" y="8" width="3" height="4" fill="#94a3b8" />
          {/* Dây thừng quấn */}
          <rect x="19" y="11" width="3" height="3" fill="#b45309" />
        </g>
      );

    case "stone_sword":
      return (
        <g id="item-stone_sword">
          <rect x="6" y="22" width="4" height="4" fill="#451a03" />
          <rect x="8" y="18" width="7" height="3" fill="#64748b" />
          <rect x="12" y="12" width="5" height="7" fill="#475569" />
          <rect x="15" y="7" width="5" height="7" fill="#64748b" />
          <rect x="18" y="4" width="4" height="5" fill="#94a3b8" />
          <polygon points="22,4 26,4 22,8" fill="#cbd5e1" />
        </g>
      );

    case "iron_sword":
      return (
        <g id="item-iron_sword">
          {/* Đốc kiếm vàng */}
          <rect x="6" y="22" width="4" height="4" fill="#78350f" />
          <circle cx="7" cy="25" r="1.5" fill="#f59e0b" />
          {/* Chắn kiếm vàng */}
          <rect x="8" y="17" width="8" height="3" fill="#d97706" />
          <rect x="9" y="18" width="6" height="1" fill="#fbbf24" />
          {/* Lưỡi kiếm sắt sáng */}
          <polygon points="12,18 25,5 27,7 14,20" fill="#94a3b8" />
          <line x1="13" y1="17" x2="25" y2="5" stroke="#f8fafc" strokeWidth="1.5" />
          <polygon points="25,5 28,5 25,8" fill="#ffffff" />
        </g>
      );

    case "steel_sword":
      return (
        <g id="item-steel_sword">
          <rect x="5" y="23" width="4" height="4" fill="#0f172a" />
          <circle cx="6" cy="26" r="1.5" fill="#38bdf8" />
          <rect x="7" y="17" width="9" height="3" fill="#334155" />
          <rect x="8" y="18" width="7" height="1" fill="#94a3b8" />
          <polygon points="11,18 26,3 29,6 14,21" fill="#64748b" />
          <line x1="12" y1="17" x2="27" y2="2" stroke="#f8fafc" strokeWidth="2" />
          <polygon points="27,2 30,2 27,5" fill="#ffffff" />
        </g>
      );

    case "crystal_sword":
      return (
        <g id="item-crystal_sword">
          <rect x="5" y="23" width="4" height="4" fill="#0369a1" />
          <rect x="7" y="17" width="9" height="3" fill="#0284c7" />
          <circle cx="11.5" cy="18.5" r="1.5" fill="#ffffff" />
          {/* Lưỡi pha lê phát sáng */}
          <polygon points="11,18 26,3 29,6 14,21" fill="#38bdf8" />
          <line x1="12" y1="17" x2="27" y2="2" stroke="#ffffff" strokeWidth="2" />
          {/* Ánh hào quang */}
          <circle cx="27" cy="3" r="2" fill="#ffffff" />
          <circle cx="21" cy="9" r="1" fill="#e0f2fe" />
          <circle cx="16" cy="14" r="1" fill="#e0f2fe" />
        </g>
      );

    case "hunting_bow":
      return (
        <g id="item-hunting_bow">
          <path d="M 6,6 Q 26,16 6,26" stroke="#92400e" strokeWidth="3" fill="none" />
          <path d="M 6,7 Q 24,16 6,25" stroke="#b45309" strokeWidth="1.5" fill="none" />
          {/* Dây cung */}
          <line x1="6" y1="6" x2="6" y2="26" stroke="#f8fafc" strokeWidth="1" />
          {/* Mũi tên */}
          <line x1="4" y1="16" x2="22" y2="16" stroke="#d97706" strokeWidth="1.5" />
          <polygon points="22,16 18,14 18,18" fill="#475569" />
          <polygon points="4,14 7,16 4,18" fill="#ef4444" />
        </g>
      );

    case "iron_bow":
      return (
        <g id="item-iron_bow">
          <path d="M 6,5 Q 27,16 6,27" stroke="#334155" strokeWidth="3.5" fill="none" />
          <path d="M 6,6 Q 25,16 6,26" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
          <line x1="6" y1="5" x2="6" y2="27" stroke="#38bdf8" strokeWidth="1" />
          {/* Tay cầm thép bọc vàng */}
          <rect x="18" y="14" width="4" height="4" fill="#f59e0b" />
          {/* Mũi tên thép */}
          <line x1="4" y1="16" x2="24" y2="16" stroke="#cbd5e1" strokeWidth="2" />
          <polygon points="24,16 20,13 20,19" fill="#0284c7" />
        </g>
      );

    case "magic_staff":
      return (
        <g id="item-magic_staff">
          {/* Cán trượng gỗ sồi */}
          <line x1="7" y1="25" x2="22" y2="10" stroke="#78350f" strokeWidth="3" />
          <line x1="8" y1="24" x2="21" y2="11" stroke="#b45309" strokeWidth="1.5" />
          {/* Đầu gậy nạm ngọc pha lê */}
          <circle cx="24" cy="8" r="4.5" fill="#0284c7" />
          <circle cx="24" cy="8" r="3" fill="#38bdf8" />
          <circle cx="24" cy="8" r="1.5" fill="#ffffff" />
          {/* Hào quang lấp lánh */}
          <rect x="23" y="2" width="2" height="2" fill="#38bdf8" />
          <rect x="29" y="7" width="2" height="2" fill="#38bdf8" />
        </g>
      );

    case "fire_staff":
      return (
        <g id="item-fire_staff">
          {/* Cán hắc diện thạch */}
          <line x1="7" y1="25" x2="22" y2="10" stroke="#0f172a" strokeWidth="3" />
          <line x1="8" y1="24" x2="21" y2="11" stroke="#334155" strokeWidth="1.5" />
          {/* Đầu gậy dung nham */}
          <circle cx="24" cy="8" r="5" fill="#b91c1c" />
          <circle cx="24" cy="8" r="3.5" fill="#ea580c" />
          <circle cx="24" cy="8" r="2" fill="#fbbf24" />
          <circle cx="24" cy="8" r="1" fill="#ffffff" />
          {/* Tàn lửa bốc lên */}
          <circle cx="22" cy="2" r="1" fill="#ea580c" />
          <circle cx="28" cy="4" r="1.5" fill="#f97316" />
        </g>
      );

    // =========================================================================
    // MŨ BẢO HỘ (HELMETS)
    // =========================================================================
    case "straw_hat":
      return (
        <g id="item-straw_hat">
          {/* Vành nón rộng */}
          <ellipse cx="16" cy="20" rx="13" ry="5" fill="#ca8a04" />
          <ellipse cx="16" cy="19" rx="12" ry="4" fill="#eab308" />
          <ellipse cx="16" cy="18" rx="10" ry="3.5" fill="#fde047" />
          {/* Chóp nón */}
          <rect x="11" y="9" width="10" height="9" rx="3" fill="#ca8a04" />
          <rect x="12" y="10" width="8" height="7" fill="#fde047" />
          <rect x="13" y="11" width="6" height="3" fill="#fef08a" />
          {/* Dải băng đỏ */}
          <rect x="11" y="16" width="10" height="2" fill="#b91c1c" />
        </g>
      );

    case "leather_helmet":
      return (
        <g id="item-leather_helmet">
          <rect x="8" y="10" width="16" height="13" rx="4" fill="#78350f" />
          <rect x="9" y="11" width="14" height="11" rx="3" fill="#92400e" />
          {/* Tai sói */}
          <polygon points="8,10 11,4 13,10" fill="#78350f" />
          <polygon points="9,10 11,6 12,10" fill="#fca5a5" />
          <polygon points="24,10 21,4 19,10" fill="#78350f" />
          <polygon points="23,10 21,6 20,10" fill="#fca5a5" />
          {/* Mép lông sói trắng viền dưới */}
          <rect x="8" y="21" width="16" height="3" fill="#e2e8f0" />
        </g>
      );

    case "iron_helmet":
      return (
        <g id="item-iron_helmet">
          {/* Thân mũ sắt */}
          <rect x="8" y="8" width="16" height="16" rx="4" fill="#334155" />
          <rect x="9" y="9" width="14" height="14" rx="3" fill="#64748b" />
          <rect x="11" y="10" width="5" height="5" fill="#cbd5e1" />
          {/* Khe mắt chữ T */}
          <rect x="10" y="15" width="12" height="3" fill="#0f172a" />
          <rect x="14" y="17" width="4" height="6" fill="#0f172a" />
          {/* Chùm lông vũ đỏ */}
          <rect x="14" y="3" width="4" height="5" fill="#dc2626" />
          <rect x="11" y="4" width="3" height="3" fill="#ef4444" />
        </g>
      );

    // =========================================================================
    // ÁO GIÁP (ARMOR)
    // =========================================================================
    case "cloth_armor":
      return (
        <g id="item-cloth_armor">
          <rect x="8" y="8" width="16" height="16" rx="3" fill="#b45309" />
          <rect x="9" y="9" width="14" height="14" fill="#d97706" />
          <polygon points="12,9 16,14 20,9" fill="#fde68a" />
          {/* Thắt lưng da */}
          <rect x="8" y="18" width="16" height="3" fill="#78350f" />
          <rect x="14" y="18" width="4" height="3" fill="#fbbf24" />
        </g>
      );

    case "leather_armor":
      return (
        <g id="item-leather_armor">
          <rect x="7" y="7" width="18" height="18" rx="4" fill="#78350f" />
          <rect x="8" y="8" width="16" height="16" rx="3" fill="#92400e" />
          {/* Cầu vai đinh tán */}
          <rect x="6" y="8" width="4" height="6" fill="#b45309" />
          <rect x="22" y="8" width="4" height="6" fill="#b45309" />
          <circle cx="8" cy="11" r="1" fill="#e2e8f0" />
          <circle cx="24" cy="11" r="1" fill="#e2e8f0" />
          {/* Mảng giáp ngực */}
          <rect x="11" y="11" width="10" height="6" fill="#78350f" />
          <rect x="12" y="12" width="8" height="4" fill="#b45309" />
        </g>
      );

    case "iron_armor":
      return (
        <g id="item-iron_armor">
          <rect x="7" y="7" width="18" height="18" rx="4" fill="#334155" />
          <rect x="8" y="8" width="16" height="16" rx="3" fill="#64748b" />
          {/* Cầu vai kim loại */}
          <rect x="5" y="8" width="5" height="6" rx="1" fill="#94a3b8" />
          <rect x="22" y="8" width="5" height="6" rx="1" fill="#94a3b8" />
          {/* Phiến thép phản quang ngực */}
          <polygon points="10,10 16,16 22,10 16,8" fill="#94a3b8" />
          <polygon points="12,10 16,14 20,10" fill="#cbd5e1" />
          <rect x="8" y="19" width="16" height="3" fill="#475569" />
        </g>
      );

    case "knight_armor":
      return (
        <g id="item-knight_armor">
          {/* Áo choàng đỏ phía sau */}
          <rect x="5" y="6" width="22" height="20" rx="3" fill="#b91c1c" />
          {/* Thân giáp mạ bạc */}
          <rect x="7" y="8" width="18" height="17" rx="3" fill="#cbd5e1" />
          <rect x="8" y="9" width="16" height="15" fill="#f1f5f9" />
          {/* Phù hiệu hoàng gia vàng */}
          <polygon points="12,12 16,16 20,12 16,10" fill="#f59e0b" />
          <circle cx="16" cy="13" r="1.5" fill="#ef4444" />
          {/* Đai lưng vàng */}
          <rect x="7" y="20" width="18" height="3" fill="#b45309" />
          <rect x="14" y="19.5" width="4" height="4" fill="#fbbf24" />
        </g>
      );

    case "mage_robe":
      return (
        <g id="item-mage_robe">
          <rect x="6" y="6" width="20" height="20" rx="4" fill="#1e1b4b" />
          <rect x="7" y="7" width="18" height="18" rx="3" fill="#312e81" />
          <rect x="10" y="8" width="12" height="16" fill="#4338ca" />
          {/* Dải họa tiết vàng huyền bí */}
          <rect x="14" y="8" width="4" height="17" fill="#fbbf24" />
          <circle cx="16" cy="12" r="1.5" fill="#38bdf8" />
          <circle cx="16" cy="18" r="1.5" fill="#38bdf8" />
        </g>
      );

    // =========================================================================
    // KHIÊN PHÒNG THỦ (SHIELDS)
    // =========================================================================
    case "wooden_shield":
      return (
        <g id="item-wooden_shield">
          <circle cx="16" cy="16" r="11" fill="#451a03" />
          <circle cx="16" cy="16" r="9.5" fill="#78350f" />
          <circle cx="16" cy="16" r="7.5" fill="#92400e" />
          {/* Lõi kim loại trung tâm */}
          <circle cx="16" cy="16" r="3.5" fill="#64748b" />
          <circle cx="16" cy="16" r="2" fill="#cbd5e1" />
          {/* 4 đinh tán thép */}
          <circle cx="16" cy="8" r="1" fill="#cbd5e1" />
          <circle cx="16" cy="24" r="1" fill="#cbd5e1" />
          <circle cx="8" cy="16" r="1" fill="#cbd5e1" />
          <circle cx="24" cy="16" r="1" fill="#cbd5e1" />
        </g>
      );

    case "iron_shield":
      return (
        <g id="item-iron_shield">
          <polygon points="8,5 24,5 24,19 16,27 8,19" fill="#1e293b" />
          <polygon points="9,6 23,6 23,18 16,25 9,18" fill="#64748b" />
          <polygon points="10,7 22,7 22,17 16,23 10,17" fill="#94a3b8" />
          {/* Chữ thập hiệp sĩ xanh */}
          <rect x="14.5" y="7" width="3" height="16" fill="#2563eb" />
          <rect x="10" y="11.5" width="12" height="3" fill="#2563eb" />
        </g>
      );

    case "magic_shield":
      return (
        <g id="item-magic_shield">
          {/* Khiên pha lê hình lục giác */}
          <polygon points="16,4 26,9 26,22 16,27 6,22 6,9" fill="#0369a1" fillOpacity="0.7" />
          <polygon points="16,6 24,10 24,21 16,25 8,21 8,10" fill="#38bdf8" fillOpacity="0.85" />
          <polygon points="16,9 21,12 21,19 16,22 11,19 11,12" fill="#e0f2fe" />
          {/* Tâm điểm ánh sáng */}
          <circle cx="16" cy="15.5" r="2.5" fill="#ffffff" />
        </g>
      );

    // =========================================================================
    // THỨC ĂN & TIÊU HAO (FOOD & CONSUMABLES)
    // =========================================================================
    case "apple":
      return (
        <g id="item-apple">
          {/* Thân quả táo đỏ */}
          <circle cx="13.5" cy="17" r="8" fill="#b91c1c" />
          <circle cx="18.5" cy="17" r="8" fill="#dc2626" />
          {/* Điểm sáng */}
          <circle cx="13" cy="14" r="2.5" fill="#f87171" />
          <circle cx="13" cy="14" r="1" fill="#ffffff" />
          {/* Cuống và lá xanh */}
          <path d="M 16,9 C 16,6 18,5 18,5" stroke="#78350f" strokeWidth="1.5" fill="none" />
          <ellipse cx="19" cy="7" rx="3" ry="1.5" fill="#16a34a" transform="rotate(-30 19 7)" />
        </g>
      );

    case "bread":
      return (
        <g id="item-bread">
          <ellipse cx="16" cy="17" rx="12" ry="7" fill="#78350f" />
          <ellipse cx="16" cy="16" rx="11" ry="6" fill="#b45309" />
          <ellipse cx="16" cy="15" rx="9" ry="4.5" fill="#d97706" />
          {/* Vết khía bánh mì */}
          <line x1="11" y1="13" x2="13" y2="17" stroke="#fde68a" strokeWidth="1.5" />
          <line x1="15" y1="13" x2="17" y2="17" stroke="#fde68a" strokeWidth="1.5" />
          <line x1="19" y1="13" x2="21" y2="17" stroke="#fde68a" strokeWidth="1.5" />
        </g>
      );

    case "raw_meat":
      return (
        <g id="item-raw_meat">
          {/* Xương trắng */}
          <circle cx="7" cy="22" r="2.5" fill="#e2e8f0" />
          <circle cx="9" cy="24" r="2.5" fill="#cbd5e1" />
          <line x1="8" y1="23" x2="15" y2="16" stroke="#e2e8f0" strokeWidth="3" />
          {/* Khối thịt đỏ */}
          <ellipse cx="19" cy="13" rx="8" ry="6" fill="#b91c1c" transform="rotate(-30 19 13)" />
          <ellipse cx="19" cy="13" rx="6" ry="4" fill="#ef4444" transform="rotate(-30 19 13)" />
          <circle cx="21" cy="12" r="1.5" fill="#fca5a5" />
        </g>
      );

    case "cooked_meat":
      return (
        <g id="item-cooked_meat">
          {/* Xương trắng */}
          <circle cx="7" cy="22" r="2.5" fill="#e2e8f0" />
          <circle cx="9" cy="24" r="2.5" fill="#cbd5e1" />
          <line x1="8" y1="23" x2="15" y2="16" stroke="#e2e8f0" strokeWidth="3" />
          {/* Thịt nướng chín xém thơm phức */}
          <ellipse cx="19" cy="13" rx="8" ry="6" fill="#78350f" transform="rotate(-30 19 13)" />
          <ellipse cx="19" cy="13" rx="6.5" ry="4.5" fill="#92400e" transform="rotate(-30 19 13)" />
          {/* Vết nướng xèo xèo */}
          <line x1="16" y1="10" x2="18" y2="14" stroke="#451a03" strokeWidth="1.5" />
          <line x1="20" y1="11" x2="22" y2="15" stroke="#451a03" strokeWidth="1.5" />
        </g>
      );

    case "meat_stew":
      return (
        <g id="item-meat_stew">
          {/* Bát gỗ */}
          <path d="M 6,14 C 6,24 26,24 26,14 Z" fill="#78350f" />
          <ellipse cx="16" cy="14" rx="10" ry="3" fill="#92400e" />
          {/* Nước súp hầm thơm ngậy */}
          <ellipse cx="16" cy="14" rx="8.5" ry="2" fill="#b45309" />
          <circle cx="13" cy="14" r="1.5" fill="#b91c1c" />
          <circle cx="18" cy="14" r="1.5" fill="#16a34a" />
          {/* Muỗng gỗ */}
          <line x1="20" y1="13" x2="26" y2="7" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
        </g>
      );

    case "bandage":
      return (
        <g id="item-bandage">
          <rect x="7" y="11" width="18" height="11" rx="2" fill="#cbd5e1" />
          <rect x="8" y="12" width="16" height="9" fill="#f8fafc" />
          {/* Dấu chữ thập xanh chữ lành */}
          <rect x="14.5" y="13.5" width="3" height="6" fill="#10b981" />
          <rect x="13" y="15" width="6" height="3" fill="#10b981" />
          {/* Nếp gấp cuộn băng */}
          <line x1="10" y1="12" x2="10" y2="21" stroke="#e2e8f0" strokeWidth="1" />
        </g>
      );

    case "small_healing_potion":
      return (
        <g id="item-small_healing_potion">
          {/* Nút bần */}
          <rect x="14" y="6" width="4" height="3" fill="#92400e" />
          {/* Cổ chai */}
          <rect x="13.5" y="9" width="5" height="3" fill="#94a3b8" />
          {/* Thân bình cầu */}
          <circle cx="16" cy="19" r="8" fill="#64748b" fillOpacity="0.5" />
          <circle cx="16" cy="19" r="6.5" fill="#ef4444" />
          <circle cx="16" cy="19" r="4.5" fill="#f87171" />
          {/* Bọt khí hồi phục */}
          <circle cx="14" cy="17" r="1" fill="#ffffff" />
          <circle cx="18" cy="20" r="1.5" fill="#ffffff" />
        </g>
      );

    case "healing_potion":
      return (
        <g id="item-healing_potion">
          {/* Nắp ngọc vàng */}
          <rect x="13" y="4" width="6" height="3" fill="#f59e0b" />
          <circle cx="16" cy="4" r="1.5" fill="#fbbf24" />
          {/* Cổ bình thủy tinh */}
          <rect x="13" y="7" width="6" height="4" fill="#cbd5e1" />
          {/* Thân bình pha lê hình thoi vát */}
          <polygon points="16,11 26,17 22,27 10,27 6,17" fill="#b91c1c" />
          <polygon points="16,13 23,18 20,25 12,25 9,18" fill="#ef4444" />
          <polygon points="16,15 20,19 18,23 14,23 12,19" fill="#fca5a5" />
          <circle cx="16" cy="20" r="2" fill="#ffffff" />
        </g>
      );

    // =========================================================================
    // NGUYÊN LIỆU (MATERIALS)
    // =========================================================================
    case "wood":
      return (
        <g id="item-wood">
          {/* 3 khúc gỗ xếp chồng */}
          <ellipse cx="11" cy="22" rx="4" ry="3" fill="#78350f" />
          <rect x="11" y="19" width="13" height="6" fill="#92400e" />
          <ellipse cx="24" cy="22" rx="4" ry="3" fill="#b45309" />

          <ellipse cx="11" cy="14" rx="4" ry="3" fill="#78350f" />
          <rect x="11" y="11" width="13" height="6" fill="#92400e" />
          <ellipse cx="24" cy="14" rx="4" ry="3" fill="#b45309" />
          {/* Vân gỗ */}
          <circle cx="11" cy="14" r="1.5" fill="#451a03" />
        </g>
      );

    case "stone":
      return (
        <g id="item-stone">
          <polygon points="10,23 6,16 13,8 23,9 26,17 21,24" fill="#334155" />
          <polygon points="11,22 8,16 14,10 22,11 24,17 20,23" fill="#64748b" />
          {/* Mặt cắt vát phản quang */}
          <polygon points="14,10 22,11 19,16 13,15" fill="#94a3b8" />
          <polygon points="19,16 24,17 20,23 16,19" fill="#475569" />
        </g>
      );

    case "iron_ore":
      return (
        <g id="item-iron_ore">
          {/* Tảng đá sẫm màu */}
          <polygon points="9,24 5,16 12,8 24,9 27,17 22,25" fill="#1e293b" />
          <polygon points="10,23 7,16 13,10 23,11 25,17 21,24" fill="#475569" />
          {/* Các vân quặng sắt lấp lánh */}
          <rect x="12" y="13" width="3" height="3" fill="#38bdf8" />
          <rect x="17" y="11" width="4" height="3" fill="#cbd5e1" />
          <rect x="15" y="17" width="5" height="3" fill="#f8fafc" />
          <circle cx="17" cy="18" r="1" fill="#ffffff" />
        </g>
      );

    case "leather":
      return (
        <g id="item-leather">
          {/* Tấm da thú thuộc */}
          <path
            d="M 10,7 L 16,5 L 22,7 L 25,12 L 23,19 L 26,24 L 20,26 L 16,24 L 11,26 L 6,24 L 8,18 L 6,12 Z"
            fill="#78350f"
          />
          <path
            d="M 11,8 L 16,6 L 21,8 L 23,13 L 21,19 L 23,23 L 19,24 L 16,22 L 12,24 L 8,22 L 10,17 L 8,13 Z"
            fill="#92400e"
          />
          <circle cx="16" cy="15" r="3" fill="#b45309" />
        </g>
      );

    case "bone":
      return (
        <g id="item-bone">
          {/* Khúc xương trắng */}
          <line x1="10" y1="22" x2="22" y2="10" stroke="#cbd5e1" strokeWidth="4" />
          <line x1="11" y1="21" x2="21" y2="11" stroke="#f8fafc" strokeWidth="2" />
          {/* 2 đầu khớp xương */}
          <circle cx="8" cy="21" r="2.5" fill="#cbd5e1" />
          <circle cx="11" cy="24" r="2.5" fill="#94a3b8" />
          <circle cx="21" cy="8" r="2.5" fill="#f8fafc" />
          <circle cx="24" cy="11" r="2.5" fill="#cbd5e1" />
        </g>
      );

    case "slime_gel":
      return (
        <g id="item-slime_gel">
          {/* Giọt chất nhầy xanh ngọc */}
          <path d="M 16,6 C 9,14 8,23 16,25 C 24,23 23,14 16,6 Z" fill="#0284c7" />
          <path d="M 16,8 C 11,15 10,22 16,23.5 C 22,22 21,15 16,8 Z" fill="#38bdf8" />
          {/* Đốm sáng trong suốt */}
          <ellipse cx="14" cy="14" rx="2" ry="3.5" fill="#ffffff" transform="rotate(-25 14 14)" />
        </g>
      );

    case "crystal":
      return (
        <g id="item-crystal">
          {/* Pha lê 3D phát sáng */}
          <polygon points="16,4 25,12 16,28 7,12" fill="#0284c7" />
          <polygon points="16,4 25,12 16,20" fill="#38bdf8" />
          <polygon points="16,4 7,12 16,20" fill="#bae6fd" />
          <polygon points="7,12 16,20 16,28" fill="#0369a1" />
          <polygon points="25,12 16,20 16,28" fill="#0ea5e9" />
          {/* Tia lấp lánh */}
          <circle cx="16" cy="12" r="1.5" fill="#ffffff" />
        </g>
      );

    case "herb":
      return (
        <g id="item-herb">
          {/* Cành thảo dược 3 lá */}
          <path d="M 16,25 Q 16,14 16,8" stroke="#15803d" strokeWidth="2" fill="none" />
          <ellipse cx="12" cy="17" rx="4" ry="2.5" fill="#16a34a" transform="rotate(-30 12 17)" />
          <ellipse cx="12" cy="16.5" rx="3" ry="1.5" fill="#4ade80" transform="rotate(-30 12 16.5)" />

          <ellipse cx="20" cy="15" rx="4" ry="2.5" fill="#16a34a" transform="rotate(30 20 15)" />
          <ellipse cx="20" cy="14.5" rx="3" ry="1.5" fill="#4ade80" transform="rotate(30 20 14.5)" />

          <ellipse cx="16" cy="8" rx="3" ry="4" fill="#22c55e" />
          <ellipse cx="16" cy="8" rx="2" ry="3" fill="#86efac" />
        </g>
      );

    case "gold_tusk":
      return (
        <g id="item-gold_tusk">
          {/* Nanh vàng cong vuốt của Heo Rừng Chúa */}
          <path
            d="M 8,24 Q 9,8 24,7 Q 15,13 14,24 Z"
            fill="#d97706"
          />
          <path
            d="M 9,23 Q 10,9 23,8 Q 15,14 13,23 Z"
            fill="#f59e0b"
          />
          <path
            d="M 11,21 Q 12,12 21,9 Q 15,14 14,21 Z"
            fill="#fef08a"
          />
          <circle cx="21" cy="9" r="1" fill="#ffffff" />
        </g>
      );

    case "wood_fence":
      return (
        <g id="item-wood_fence">
          {/* Hàng rào gỗ cọc nhọn */}
          <polygon points="9,26 9,8 11,6 13,8 13,26" fill="#78350f" />
          <polygon points="10,25 10,9 11,7 12,9 12,25" fill="#b45309" />

          <polygon points="19,26 19,8 21,6 23,8 23,26" fill="#78350f" />
          <polygon points="20,25 20,9 21,7 22,9 22,25" fill="#b45309" />

          {/* 2 thanh ngang */}
          <rect x="6" y="11" width="20" height="3" fill="#92400e" />
          <rect x="6" y="19" width="20" height="3" fill="#92400e" />
        </g>
      );

    default:
      return (
        <g id="item-generic">
          <circle cx="16" cy="16" r="10" fill="#334155" />
          <circle cx="16" cy="16" r="7" fill="#64748b" />
          <text x="16" y="20" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
            ?
          </text>
        </g>
      );
  }
}
