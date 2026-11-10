/**
 * RPG GAME ENTITIES TRANSLATION (ITEMS, MONSTERS & WORLD STRINGS)
 */

export interface TranslatedEntity {
  name: string;
  description: string;
}

export const ITEM_TRANSLATIONS_EN: Record<string, TranslatedEntity> = {
  wood: {
    name: "Forest Wood",
    description: "Dry firewood branches from Foggo forest, used for campfires and crafting clubs, fences.",
  },
  stone: {
    name: "Cobblestone",
    description: "Hard rock gathered from mining, used to craft stone axes and reinforce camp walls.",
  },
  iron_ore: {
    name: "Iron Ore",
    description: "Solid metallic ore found in caves, used to forge iron swords and armor.",
  },
  leather: {
    name: "Animal Hide",
    description: "Tough leather from wolves and wild boars, used for lightweight armor.",
  },
  bone: {
    name: "White Bone",
    description: "Remnant bones from shadow skeletons.",
  },
  slime_gel: {
    name: "Slime Gel",
    description: "Sticky viscous fluid with strong adhesion, used in potion brewing.",
  },
  crystal: {
    name: "Luminous Crystal",
    description: "Gleaming magical crystal, material for legendary weapons.",
  },
  herb: {
    name: "Green Herb",
    description: "Medicinal leaves capable of disinfecting and restoring vitality.",
  },
  gold_tusk: {
    name: "Golden Tusk",
    description: "Glittering golden tusk claimed from King Boar.",
  },
  apple: {
    name: "Forest Apple",
    description: "Sweet wild apple, dispels hunger and restores a little health.",
  },
  bread: {
    name: "Barley Bread",
    description: "Crisp, fragrant baked bread that keeps explorers energized.",
  },
  raw_meat: {
    name: "Raw Meat",
    description: "Meat gathered from beasts. Can be eaten in emergencies but causes upset stomach (-5 HP).",
  },
  cooked_meat: {
    name: "Roasted Meat",
    description: "Sizzling meat grilled over the campfire, recovers substantial stamina.",
  },
  meat_stew: {
    name: "Wild Stew",
    description: "Hot stew that restores high stamina and warms you through the night.",
  },
  wooden_club: {
    name: "Crude Wooden Club",
    description: "Wooden club carved from oak, initial self-defense weapon against small beasts.",
  },
  wooden_sword: {
    name: "Trainee Wooden Sword",
    description: "Well-balanced trainee wooden sword, slightly boosts sword swings.",
  },
  stone_axe: {
    name: "Stone Axe",
    description: "Sharp carved stone axe, used for chopping trees and melee combat.",
  },
  stone_sword: {
    name: "Stone Hunting Sword",
    description: "Blade honed from hard slate, swings solidly against beasts.",
  },
  iron_sword: {
    name: "Knight's Iron Sword",
    description: "Forged from iron ore, razor-sharp and durable in major hunts.",
  },
  steel_sword: {
    name: "Warrior Steel Sword",
    description: "Polished steel sword delivering overwhelming force against deep forest beasts.",
  },
  crystal_sword: {
    name: "Crystal Blade",
    description: "Weapon radiating mythical brilliance, cutting cleanly through misty nights.",
  },
  straw_hat: {
    name: "Straw Sun Hat",
    description: "Rustic woven straw hat, shields against wind and mist, reducing damage by 3%.",
  },
  leather_helmet: {
    name: "Wolf Leather Cap",
    description: "Supple wolfskin cap, keeps head warm and reduces incoming damage by 6%.",
  },
  iron_helmet: {
    name: "Knight's Iron Helmet",
    description: "Armored helmet with protective visor for the head, reduces damage by 10%.",
  },
  cloth_armor: {
    name: "Crude Cloth Shirt",
    description: "Tightly woven linen shirt, softens minor claws and bites, reducing damage by 5%.",
  },
  leather_armor: {
    name: "Leather Armor",
    description: "Durable beast hide armor, reduces incoming monster damage by 10%.",
  },
  iron_armor: {
    name: "Forged Iron Armor",
    description: "Sturdy metallic armor protecting the torso, reducing incoming damage by 18%.",
  },
  wooden_shield: {
    name: "Round Wooden Shield",
    description: "Pine wood shield with leather straps, reduces monster damage by an additional 6%.",
  },
  iron_shield: {
    name: "Reinforced Iron Shield",
    description: "Sturdy steel shield blocking fierce lunges, reducing damage by 12%.",
  },
  bandage: {
    name: "Herbal Bandage",
    description: "Quickly binds wounds, recovering 25 HP.",
  },
  small_healing_potion: {
    name: "Small Health Potion",
    description: "Medicinal extract mending scratches, instantly restoring 40 HP.",
  },
  healing_potion: {
    name: "Greater Health Potion",
    description: "Elixir distilled from herbs and dew gems, restoring 75 HP.",
  },
  wood_fence: {
    name: "Wooden Barricade",
    description: "Sharpened wooden stakes defending the camp against night monster attacks.",
  },
};

export const MONSTER_TRANSLATIONS_EN: Record<string, TranslatedEntity> = {
  slime: {
    name: "Forest Slime",
    description: "A slow, gelatinous creature crawling through bushes, easiest to face.",
  },
  baby_wolf: {
    name: "Mist Wolf Pup",
    description: "A nimble young wolf hiding behind bushes along the forest edge.",
  },
  wolf: {
    name: "Deep Forest Wolf",
    description: "A dangerous predator with glowing eyes hidden inside the mist.",
  },
  mist_spider: {
    name: "Poisonous Mist Spider",
    description: "A venomous spider weaving webs in the dim, misty shadows.",
  },
  wild_boar: {
    name: "Tusked Wild Boar",
    description: "A ferocious beast that violently charges at strangers entering its territory.",
  },
  forest_goblin: {
    name: "Forest Goblin",
    description: "A nimble goblin lurking behind ancient trees with poisoned daggers.",
  },
  boar_king: {
    name: "King Boar",
    description: "Ruler of the Green Forest boasting massive golden tusks and destructive charge power.",
  },
  skeleton: {
    name: "Shadow Skeleton",
    description: "Ancient warriors reanimated under the night mist.",
  },
  stone_gargoyle: {
    name: "Stone Gargoyle",
    description: "A petrified stone gargoyle awakened by ancient magic.",
  },
};

/**
 * Returns localized name and description for an item
 */
export function localizeItemDef(item: any, language: "vi" | "en"): { name: string; description: string } {
  if (!item) return { name: "", description: "" };
  if (language === "en" && ITEM_TRANSLATIONS_EN[item.id]) {
    return ITEM_TRANSLATIONS_EN[item.id];
  }
  return {
    name: item.name || "",
    description: item.description || "",
  };
}

/**
 * Returns localized name and description for a monster
 */
export function localizeMonsterDef(monster: any, language: "vi" | "en"): { name: string; description: string } {
  if (!monster) return { name: "", description: "" };
  if (language === "en" && MONSTER_TRANSLATIONS_EN[monster.id]) {
    return MONSTER_TRANSLATIONS_EN[monster.id];
  }
  return {
    name: monster.name || "",
    description: monster.description || "",
  };
}

/**
 * Localizes world session titles
 */
export function localizeWorldTitle(title: string, language: "vi" | "en"): string {
  if (!title || language !== "en") return title;
  if (title.startsWith("Bãi Farm Quái Của ")) {
    const owner = title.replace("Bãi Farm Quái Của ", "");
    return `Solo Monster Farm (${owner})`;
  }
  if (title.startsWith("Bãi Farm Quái của ")) {
    const owner = title.replace("Bãi Farm Quái của ", "");
    return `Solo Monster Farm (${owner})`;
  }
  if (title === "Bãi Farm Quái") return "Solo Monster Farm";
  if (title === "Hầm Ngục Lớp Học") return "Classroom Arena";
  return title;
}
