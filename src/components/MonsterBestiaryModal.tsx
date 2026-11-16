"use client";

import React, { useState, useEffect } from "react";
import { X, Shield, Swords, Coins, Sparkles, Skull, Info, Flame, Eye } from "lucide-react";
import { PixelItemIcon } from "./PixelItemIcon";
import { MONSTER_REGISTRY, MonsterDef } from "@/game-modes/survival/monsters";
import { ITEM_REGISTRY } from "@/game-modes/survival/items";

interface MonsterBestiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: "vi" | "en";
}

// 7 Chủng loại quái vật đặc sắc chính thức trong Foggo
const BESTIARY_ORDER = [
  "slime",
  "baby_wolf",
  "mist_spider",
  "forest_goblin",
  "small_golem",
  "skeleton",
  "boar_king",
];

export const MonsterBestiaryModal: React.FC<MonsterBestiaryModalProps> = ({
  isOpen,
  onClose,
  language = "vi",
}) => {
  const isEn = language === "en";
  const [activeTab, setActiveTab] = useState<"all" | "forest" | "cave" | "boss">("all");
  const [animFrame, setAnimFrame] = useState<number>(1);
  const [selectedMonsterId, setSelectedMonsterId] = useState<string>("slime");

  // Animation frame ticker cho sprite quái vật sinh động (chu kỳ 8 frame)
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setAnimFrame((prev) => (prev % 8) + 1);
    }, 450);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  // Lấy sprite theo frame cho từng quái
  const getSpriteForFrame = (id: string, frame: number) => {
    if (id === "slime") {
      switch (frame) {
        case 1: return "/sprites/slime_idle_1_clean.png";
        case 2: return "/sprites/slime_idle_2_clean.png";
        case 3: return "/sprites/slime_prep_clean.png";
        case 4: return "/sprites/slime_jump_clean.png";
        case 5: return "/sprites/slime_land_clean.png";
        case 6: return "/sprites/slime_hit_clean.png";
        default: return "/sprites/slime_idle_1_clean.png";
      }
    }
    if (id === "baby_wolf" || id === "wolf") {
      return `/sprites/baby_wolf/frame_${frame}.png`;
    }
    if (id === "mist_spider") {
      return `/sprites/mist_spider/frame_${frame}.png`;
    }
    if (id === "boar_king" || id === "wild_boar") {
      return `/sprites/boar_king/frame_${frame}.png`;
    }
    if (id === "forest_goblin" || id === "goblin") {
      return `/sprites/goblin/frame_${frame}.png`;
    }
    if (id === "small_golem" || id === "rock_golem") {
      return `/sprites/small_golem/frame_${frame}.png`;
    }
    if (id === "skeleton") {
      return `/sprites/skeleton/frame_${frame}.png`;
    }
    return null;
  };

  const monsterList = BESTIARY_ORDER.map((id) => MONSTER_REGISTRY[id]).filter(Boolean);

  const filteredMonsters = monsterList.filter((m) => {
    if (activeTab === "forest") return m.zoneId === "forest" && !m.isBoss;
    if (activeTab === "cave") return m.zoneId === "cave" && !m.isBoss;
    if (activeTab === "boss") return m.isBoss;
    return true;
  });

  const selectedMonster = MONSTER_REGISTRY[selectedMonsterId] || monsterList[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border-4 border-amber-500/80 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* ============================================================== */}
        {/* HEADER: RETRO BESTIARY CODEX                                  */}
        {/* ============================================================== */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-950/20 border border-slate-950/30 flex items-center justify-center">
              <Skull className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-pixel text-xs sm:text-sm font-bold tracking-wider uppercase text-slate-950">
                  {isEn ? "DUNGEON MONSTER BESTIARY" : "SỔ TAY QUÁI VẬT HẦM NGỤC"}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-slate-950 text-amber-400 font-mono text-[10px] font-bold">
                  {monsterList.length} {isEn ? "TYPES" : "LOÀI"}
                </span>
              </div>
              <p className="text-[11px] text-slate-900 font-medium hidden sm:block">
                {isEn
                  ? "7 Signature Monster Species with complete 8-frame battle animations & loot tables"
                  : "Tổng hợp 7 loại quái vật đặc sắc với đầy đủ animation 8 khung hình & vật phẩm rơi"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 flex items-center justify-center transition-colors duration-150 cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB FILTER & SUMMARY BAR                                      */}
        {/* ============================================================== */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all duration-150 cursor-pointer ${
                activeTab === "all"
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {isEn ? "All (7)" : "Tất cả (7)"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("forest")}
              className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all duration-150 cursor-pointer ${
                activeTab === "forest"
                  ? "bg-emerald-500 text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {isEn ? "Forest (4)" : "Rừng Sương Mù (4)"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cave")}
              className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all duration-150 cursor-pointer ${
                activeTab === "cave"
                  ? "bg-indigo-500 text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {isEn ? "Cave (2)" : "Hang Đá (2)"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("boss")}
              className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all duration-150 cursor-pointer ${
                activeTab === "boss"
                  ? "bg-rose-500 text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {isEn ? "Bosses (1)" : "Trùm Khu Vực (1)"}
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {isEn ? "Click monster to inspect" : "Nhấn để soi chi tiết quái"}
          </span>
        </div>

        {/* ============================================================== */}
        {/* NỘI DUNG: 2 CỘT (DANH SÁCH + THẺ CHI TIẾT)                      */}
        {/* ============================================================== */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
          {/* CỘT TRÁI: DANH SÁCH 7 QUÁI VẬT */}
          <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-3 sm:p-4 overflow-y-auto space-y-2 bg-slate-50/50 dark:bg-slate-900/50">
            {filteredMonsters.map((monster) => {
              const isSelected = selectedMonster.id === monster.id;
              const sprite = getSpriteForFrame(monster.id, isSelected ? animFrame : 1);

              return (
                <button
                  key={monster.id}
                  type="button"
                  onClick={() => setSelectedMonsterId(monster.id)}
                  className={`w-full p-2.5 rounded-2xl text-left flex items-center gap-3 transition-all duration-150 cursor-pointer border-2 ${
                    isSelected
                      ? "bg-amber-500/15 border-amber-500 dark:bg-amber-500/20 shadow-sm"
                      : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-amber-400/50"
                  }`}
                >
                  {/* Sprite thumbnail */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center p-1 shrink-0 overflow-hidden border border-slate-800"
                    style={{ backgroundColor: "#020617" }}
                  >
                    {sprite ? (
                      <img
                        src={sprite}
                        alt={monster.name}
                        className="max-w-full max-h-full object-contain pixelated -scale-x-100"
                      />
                    ) : (
                      <span className="text-2xl">{monster.avatar}</span>
                    )}
                  </div>

                  {/* Thông tin nhanh */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {monster.name}
                      </h4>
                      {monster.isBoss && (
                        <span className="px-1.5 py-0.5 rounded-sm bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[9px] font-mono font-bold shrink-0">
                          BOSS
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                        <Shield className="w-3 h-3 inline" /> {monster.baseHp} HP
                      </span>
                      <span className="flex items-center gap-0.5 text-rose-600 dark:text-rose-400">
                        <Swords className="w-3 h-3 inline" /> {monster.baseAtk} ATK
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400">
                        <Coins className="w-3 h-3 inline" /> {monster.minCoins}-{monster.maxCoins}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* CỘT PHẢI: CHI TIẾT SÂU VỀ QUÁI VẬT ĐANG CHỌN */}
          <div className="flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto space-y-4 bg-white dark:bg-slate-900 flex flex-col justify-between">
            <div className="space-y-4">
              {/* STAGE PREVIEW 2D VỚI ANIMATION ĐỘNG */}
              <div
                className="relative w-full h-44 rounded-2xl border-2 border-slate-700/80 flex flex-col justify-between p-3 overflow-hidden shadow-inner"
                style={{ background: "linear-gradient(180deg, #020617 0%, #0f172a 65%, #064e3b 100%)" }}
              >
                {/* Parallax pixel blue cloud */}
                <div className="absolute top-2 left-6 w-20 h-5 opacity-40 pointer-events-none">
                  <svg viewBox="0 0 128 32" className="w-full h-full fill-[#38bdf8]" shapeRendering="crispEdges">
                    <rect x="24" y="8" width="80" height="16" />
                    <rect x="36" y="4" width="56" height="4" />
                    <rect x="12" y="12" width="104" height="12" />
                    <rect x="0" y="16" width="128" height="8" />
                  </svg>
                </div>

                {/* Badge thông tin cấp và khu vực */}
                <div className="flex items-center justify-between text-xs font-mono relative z-10">
                  <span className="px-2 py-0.5 rounded-full bg-slate-900/90 text-amber-400 border border-slate-700 text-[10px] font-bold">
                    {selectedMonster.zoneId === "forest"
                      ? (isEn ? "Zone: Mist Forest" : "Khu vực: Rừng Sương Mù")
                      : (isEn ? "Zone: Ancient Cave" : "Khu vực: Hang Đá Cổ")}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>{isEn ? "Active" : "Sinh động"}</span>
                  </span>
                </div>

                {/* Center Sprite Animation */}
                <div className="relative z-10 flex flex-col items-center justify-end my-auto">
                  <div className="relative w-28 h-28 flex items-end justify-center -scale-x-100">
                    {getSpriteForFrame(selectedMonster.id, animFrame) ? (
                      <img
                        src={getSpriteForFrame(selectedMonster.id, animFrame)!}
                        alt={selectedMonster.name}
                        className="max-w-full max-h-full object-contain pixelated filter drop-shadow-lg"
                      />
                    ) : (
                      <span className="text-5xl">{selectedMonster.avatar}</span>
                    )}
                    <div className="absolute -bottom-1 w-20 h-2.5 bg-black/50 rounded-full blur-[2px]" />
                  </div>
                </div>

                {/* Tên quái vật & Phân loại */}
                <div className="text-center relative z-10">
                  <span className="font-pixel text-xs font-bold text-amber-300 drop-shadow-md">
                    {selectedMonster.name.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* BẢNG CHỈ SỐ STATS */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block font-semibold">
                    {isEn ? "BASE HP" : "MÁU CƠ BẢN"}
                  </span>
                  <span className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-300">
                    {selectedMonster.baseHp}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
                  <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 block font-semibold">
                    {isEn ? "BASE ATK" : "CÔNG CƠ BẢN"}
                  </span>
                  <span className="text-base font-bold font-mono text-rose-700 dark:text-rose-300">
                    {selectedMonster.baseAtk}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 block font-semibold">
                    {isEn ? "COINS DROP" : "TIỀN RƠI"}
                  </span>
                  <span className="text-base font-bold font-mono text-amber-700 dark:text-amber-300">
                    {selectedMonster.minCoins}-{selectedMonster.maxCoins}
                  </span>
                </div>
              </div>

              {/* MÔ TẢ & ĐIỂM YẾU CHIẾN THUẬT */}
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <p className="flex items-start gap-1.5 font-medium">
                  <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{selectedMonster.description}</span>
                </p>
                {selectedMonster.weakSpotDescription && (
                  <p className="flex items-start gap-1.5 text-[11px] text-rose-600 dark:text-rose-400 font-semibold pt-1 border-t border-slate-200 dark:border-slate-700">
                    <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{isEn ? "Weak point: " : "Điểm yếu chiến thuật: "} {selectedMonster.weakSpotDescription}</span>
                  </p>
                )}
              </div>

              {/* VẬT PHẨM RƠI KHI TIÊU DIỆT (LOOT TABLE) */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isEn ? "Possible Item Drops:" : "Vật phẩm rơi khi tiêu diệt:"}</span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {selectedMonster.lootTable.map((drop) => {
                    const itemDef = ITEM_REGISTRY[drop.itemId];
                    return (
                      <div
                        key={drop.itemId}
                        className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 shadow-2xs"
                      >
                        <PixelItemIcon itemId={drop.itemId} size={24} />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                            {itemDef?.name || drop.itemId}
                          </p>
                          <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                            {Math.round(drop.chance * 100)}% ({drop.minQty}-{drop.maxQty})
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Nút đóng chân trang */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-mono text-xs font-bold transition-colors duration-150 cursor-pointer"
              >
                {isEn ? "Close Bestiary" : "Đóng Sổ Tay"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
