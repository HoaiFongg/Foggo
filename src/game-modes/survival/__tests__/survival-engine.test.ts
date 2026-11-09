import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getSurvivalClock } from "../clock";
import {
  initSurvivalState,
  tick,
  applyHunt,
  applyGather,
  applyExplore,
  applyCraft,
  applyEat,
  applyBlacksmith,
  applyNightDefense,
  applyRevive,
  applyFlee,
  addItemToInventory,
  removeItemFromInventory,
  countItemInInventory,
} from "../engine";

describe("Survival Game Engine Unit Tests", () => {
  describe("Clock & Day/Night Cycle", () => {
    test("tính đúng ngày và pha ban ngày", () => {
      const clock = getSurvivalClock(60); // 60s -> Ngày 1, Ban ngày (0..150s)
      assert.equal(clock.dayNumber, 1);
      assert.equal(clock.phase, "day");
      assert.equal(clock.isDay, true);
      assert.equal(clock.phaseRemainingSec, 90);
    });

    test("chuyển sang ban đêm sau 150s", () => {
      const clock = getSurvivalClock(180); // 180s -> Ngày 1, Ban đêm (150..240s)
      assert.equal(clock.dayNumber, 1);
      assert.equal(clock.phase, "night");
      assert.equal(clock.isDay, false);
      assert.equal(clock.phaseRemainingSec, 60);
    });

    test("sang ngày thứ 2 sau 240s", () => {
      const clock = getSurvivalClock(250); // 250s -> Ngày 2, Ban ngày
      assert.equal(clock.dayNumber, 2);
      assert.equal(clock.phase, "day");
      assert.equal(clock.isDay, true);
    });
  });

  describe("Inventory operations", () => {
    test("thêm và xếp chồng vật phẩm", () => {
      const inv = [{ slotIndex: 0, itemId: "wood", qty: 10 }];
      const res = addItemToInventory(inv, "wood", 5);
      assert.equal(res.success, true);
      assert.equal(res.inventory[0].qty, 15);
    });

    test("đếm số lượng và gỡ bỏ vật phẩm", () => {
      const inv = [{ slotIndex: 0, itemId: "wood", qty: 10 }];
      assert.equal(countItemInInventory(inv, "wood"), 10);

      const res = removeItemFromInventory(inv, "wood", 4);
      assert.equal(res.success, true);
      assert.equal(countItemInInventory(res.inventory, "wood"), 6);
    });
  });

  describe("Engine tick() - Đói và Sinh tồn", () => {
    test("giảm điểm đói theo thời gian", () => {
      const state = initSurvivalState(1000);
      const next = tick(state, 1060); // trôi qua 60 giây -> giảm 10 đói
      assert.equal(next.playSec, 60);
      assert.equal(next.hunger, 90);
      assert.equal(next.hp, 100);
    });

    test("khi đói = 0, bắt đầu mất máu (starving)", () => {
      const state = initSurvivalState(1000);
      state.hunger = 0;
      const next = tick(state, 1040); // 40 giây khi đói = 0 -> mất 10 HP (4s/HP)
      assert.equal(next.hp, 90);
    });
  });

  describe("Hunt (Đi săn)", () => {
    test("tấn công trúng gây sát thương và tăng streak", () => {
      const state = initSurvivalState(1000);
      const res = applyHunt(state, "slime", 1.0, false);
      assert.ok(res.damageDealt > 0);
      assert.equal(res.state.streak, 1);
    });

    test("tiêu diệt quái nhận được xu, điểm và loot", () => {
      const state = initSurvivalState(1000);
      // Giả lập slime còn 5 HP
      state.currentBattle = {
        monsterId: "slime",
        monsterHp: 5,
        monsterMaxHp: 40,
        phase: 1,
      };

      const res = applyHunt(state, "slime", 1.0, false);
      assert.equal(res.result, "kill");
      assert.ok(res.coinsAwarded > 0);
      assert.ok(res.scoreAwarded > 0);
      assert.equal(res.state.monstersKilled, 1);
    });

    test("trả lời sai bị quái đánh trả và trừ máu", () => {
      const state = initSurvivalState(1000);
      const initialHp = state.hp;
      const res = applyHunt(state, "wolf", 0.0, false);
      assert.equal(res.result, "hurt");
      assert.ok(res.damageTaken > 0);
      assert.equal(res.state.hp, initialHp - res.damageTaken);
      assert.equal(res.state.streak, 0);
    });

    test("rút lui khỏi trận chiến bị trừ máu và trừ điểm rank", () => {
      const state = initSurvivalState(1000);
      state.score = 200;
      state.streak = 3;
      const initialHp = state.hp;
      const res = applyFlee(state, "slime");
      assert.ok(res.damageTaken > 0);
      assert.equal(res.scoreLost, 50);
      assert.equal(res.state.score, 150);
      assert.equal(res.state.hp, initialHp - res.damageTaken);
      assert.equal(res.state.streak, 0);
      assert.equal(res.state.currentBattle, null);
    });
  });

  describe("Gather & Fog Exploration", () => {
    test("hái lượm đúng nhận được nguyên liệu", () => {
      const state = initSurvivalState(1000);
      const res = applyGather(state, "wood", 1.0);
      assert.ok(res.qtyObtained >= 5);
      assert.ok(countItemInInventory(res.state.inventory, "wood") >= 10);
    });

    test("thám hiểm sương mù đúng làm giảm sương", () => {
      const state = initSurvivalState(1000);
      assert.equal(state.fog.forest, 100);
      const res = applyExplore(state, "forest", 1.0, 5);
      assert.ok(res.fogReduced > 0);
      assert.ok(res.currentFog < 100);
    });

    test("thám hiểm sai làm tăng sương mù", () => {
      const state = initSurvivalState(1000);
      state.fog.forest = 80;
      const res = applyExplore(state, "forest", 0.0, 10);
      assert.equal(res.currentFog, 82);
    });
  });

  describe("Crafting", () => {
    test("chế tạo thành công khi đủ nguyên liệu và đúng câu hỏi", () => {
      const state = initSurvivalState(1000);
      // init state có 5 wood, gậy gỗ cần 4 wood
      const res = applyCraft(state, "craft_wooden_club", 1.0);
      assert.equal(res.success, true);
      assert.equal(countItemInInventory(res.state.inventory, "wood"), 1);
      assert.equal(countItemInInventory(res.state.inventory, "wooden_club"), 1);
    });

    test("từ chối chế tạo khi thiếu nguyên liệu", () => {
      const state = initSurvivalState(1000);
      state.inventory = [];
      const res = applyCraft(state, "craft_wooden_club", 1.0);
      assert.equal(res.success, false);
    });
  });

  describe("Eat & Recovery", () => {
    test("ăn táo hồi phục đói", () => {
      const state = initSurvivalState(1000);
      state.hunger = 50;
      const res = applyEat(state, "apple");
      assert.equal(res.success, true);
      assert.equal(res.state.hunger, 65); // táo +15
    });
  });

  describe("Blacksmith & Night Defense", () => {
    test("mua trang bị bằng xu", () => {
      const state = initSurvivalState(1000);
      state.coins = 200;
      const res = applyBlacksmith(state, "buy_gear", "stone_axe");
      assert.equal(res.success, true);
      assert.equal(res.state.coins, 120); // 200 - 80 = 120
      assert.equal(countItemInInventory(res.state.inventory, "stone_axe"), 1);
    });

    test("phòng thủ trại đêm thành công", () => {
      const state = initSurvivalState(1000);
      const res = applyNightDefense(state, 1.0);
      assert.equal(res.success, true);
      assert.equal(res.state.nightWavesSurvived, 1);
      assert.ok(res.state.coins > state.coins);
    });

    test("hồi sinh sau khi ngất xỉu", () => {
      const state = initSurvivalState(1000);
      state.hp = 0;
      state.coins = 100;
      const revived = applyRevive(state);
      assert.equal(revived.hp, 100);
      assert.equal(revived.coins, 70); // giữ 70% xu
    });
  });
});

