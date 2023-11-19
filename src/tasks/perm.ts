/*import {
  Class,
  getPermedSkills,
  gnomadsAvailable,
  inCasual,
  inHardcore,
  Item,
  myClass,
  print,
  printHtml,
  Skill,
  toClass,
} from "kolmafia";
import { $class, $classes, $item, $skills, get, have, set } from "libram";
import { coloredSkill } from "./sim";
import { args } from "../args";

export function getClass(property: string, _default: Class): Class {
  return toClass(get(property, _default.toString()));
}
export function setClass(property: string, value: Class): void {
  set(property, value.toString());
}

export const baseClasses = $classes`Seal Clubber, Turtle Tamer, Pastamancer, Sauceror, Disco Bandit, Accordion Thief`;
export const gnomeSkills = $skills`Torso Awareness, Gnefarious Pickpocketing, Powers of Observatiogn, Gnomish Hardigness, Cosmic Ugnderstanding`;
const permBlockList = [
  ...$skills`CLEESH, Chronic Indigestion`,
  ...Skill.all().filter((sk) =>
    Item.all().find((it) => it.skill === sk && it.reusable && have(it))
  ),
];

export const permTiers = [
  "Tier 0 - All permable non-guild, non-gnome skills (never target these, but perm them if you know them)",
  "Tier 1 - Needed for the script to run at its best",
  "Tier 2 - Great skills",
  "Tier 3 - Good skills",
  "Tier 4 - QoL skills",
  "Tier 5 - Ascension-relevant skills",
  "Tier 6 - Skills with non-zero utility",
  "Tier 7 - All other guild skills",
  "Tier 8 - Otherwise-blocked skills",
];

const permList = [
  //tier 0
  Skill.all().filter(
    (sk) =>
      sk.permable && sk.level === -1 && !permBlockList.includes(sk) && !gnomeSkills.includes(sk)
  ),
  //tier 1
  $skills`Curse of Weaksauce, Itchy Curse Finger, Torso Awareness, Cannelloni Cocoon`,
  //tier 2
  $skills`Nimble Fingers, Amphibian Sympathy, Leash of Linguini, Thief Among the Honorable, Expert Panhandling, Disco Leer, Wrath of the Wolverine, Furious Wallop, Five Finger Discount, Double-Fisted Skull Smashing, Impetuous Sauciness, Tao of the Terrapin, Saucestorm`,
  //tier 3
  $skills`Tongue of the Walrus, Mad Looting Skillz, Smooth Movement, Musk of the Moose, The Polka of Plenty, The Sonata of Sneakiness, Carlweather's Cantata of Confrontation, Mariachi Memory`,
  //tier 4
  $skills`Gnefarious Pickpocketing, Powers of Observatiogn, Gnomish Hardigness, Cosmic Ugnderstanding, Ambidextrous Funkslinging, The Long View, Wisdom of the Elder Tortoises, Inner Sauce, Springy Fusilli, Overdeveloped Sense of Self Preservation, Pulverize`,
  //tier 5
  $skills`Pastamastery, Advanced Cocktailcrafting, The Ode to Booze, The Magical Mojomuscular Melody, Advanced Saucecrafting, Saucemaven, The Way of Sauce, Fat Leon's Phat Loot Lyric, Empathy of the Newt, The Moxious Madrigal, Stuffed Mortar Shell, Flavour of Magic, Elemental Saucesphere, Spirit of Ravioli, Lunging Thrust-Smack, Entangling Noodles, Cold-Blooded Fearlessness, Northern Exposure, Diminished Gag Reflex, Tolerance of the Kitchen, Heart of Polyester, Irrepressible Spunk, Saucegeyser, Scarysauce, Ire of the Orca, Batter Up!, Disco Fever, Rage of the Reindeer, Testudinal Teachings, Disco Nap, Adventurer of Leisure, Armorcraftiness`,
  //tier 6
  $skills`Superhuman Cocktailcrafting, Transcendental Noodlecraft, Super-Advanced Meatsmithing, Patient Smile, Wry Smile, Knowing Smile, Aloysius' Antiphon of Aptitude, Pride of the Puffin, Ur-Kel's Aria of Annoyance, Sensitive Fingers, Master Accordion Master Thief, Skin of the Leatherback, Hide of the Walrus, Astral Shell, Ghostly Shell, Subtle and Quick to Anger, Master Saucier, Hero of the Half-Shell, Shield of the Pastalord, Saucy Salve, The Power Ballad of the Arrowsmith, Jalapeño Saucesphere, Claws of the Walrus, Shell Up, Brawnee's Anthem of Absorption, Reptilian Fortitude, The Psalm of Pointiness, Spiky Shell, Stiff Upper Lip, Blubber Up, Disco Smirk, Blood Sugar Sauce Magic, Cletus's Canticle of Celerity, Suspicious Gaze, Icy Glare, Dirge of Dreadfulness, Snarl of the Timberwolf, Stevedave's Shanty of Superiority, Northern Explosion, That's Not a Knife`,
  //tier 7
  $skills``.filter((sk) => sk.permable && sk.level >= 0),
  //tier 8
  permBlockList,
];

export const defaultPermList = () => permList.slice(0, 5);

export function permOptions(): Skill[][] {
  //planning = true: next run, false: this ru
  return defaultPermList().map((sks) =>
        sks.filter(
          (sk) =>
            !(sk.toString() in getPermedSkills())
        )
      ); //for next run, exclude all skills that we are planning to perm this run, and allow all guild and gnome skills.
}

export function permTier() {
  // the highest tier of unpermed skills available. Returns 0 if no non-tier 0 skills are available
  return (
    permOptions()
      .slice(1)
      .findIndex((sks) => sks.length !== 0) + 1
  );
}

export function expectedKarma(): number {
  return (
    expectedKarma() -
        targetPerms().length * 100 +
        (inHardcore() ? 200 : inCasual() ? 0 : 100)) + (args.astralpet === $item`none` ? 10 : 0
  );
}

export function targetPerms(): Skill[] {
  const pOptions = permOptions();
  const tier = permTier();
  const maxQty = Math.floor(expectedKarma() / 100);
  if (tier > maxQty || tier === 0)
    //don't perm anything (bank karma), but do perm high-tier skills you happen to already know (probably due to Big Book or manually used skillbooks)
    return pOptions === [][] ? [] :
      pOptions
          .slice(0, tier + 1) //skills in tiers <= your current best perm target
          .flat()
          .filter((sk) => have(sk))
          .slice(0, maxQty); //don't plan to perm more than we have karma for

  const qty = Math.min(maxQty, tier + Math.ceil(Math.sqrt(Math.max(0, maxQty - tier))));
  return (pOptions.flat().filter((sk) => !gnomeSkills.includes(sk) || gnomadsAvailable())
  ) //filter out non-targetClass skills
    .slice(0, qty);
}

function planHelper(perms: string[], karma: number) {
  if (perms.length > 0)
    return `Perm plan: [${perms.join(
      ", "
    )}] - Expected Karma: ${karma}`;
  else return `Nothing to perm!`;
}

export function printPermPlan() {
  const cPerms = targetPerms();
  print();
  printHtml(
    `Current ${planHelper(
      cPerms.map((sk) => coloredSkill(sk, cPerms)),
      expectedKarma()
    )}`,
    true
  );
}*/
