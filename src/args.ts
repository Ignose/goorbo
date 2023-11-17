import { Args } from "grimoire-kolmafia";
import { Item, toClass } from "kolmafia";
import { $class, $classes, $item, $items, get } from "libram";
//import { permTiers } from "./tasks/perm";
import { toMoonSign } from "./tasks/utils";

export const args = Args.create(
  "smolisgarbage",
  `This is a full-day script for smollooping. It aims to be a single-press script that will take you through your Aftercore and Grey You legs, collecting fat loot tokens, getting a Steel Liver, and leveling up to level 13 before running garbo. It chooses a class for you to learn guild skills, and to perm learned skills upon ascension.`,
  {
    //alternate-run flags
    version: Args.flag({
      help: "Output script version number and exit.",
      default: false,
      setting: "",
    }),
    // profits: Args.flag({
    //   help: "If set, displays current session's profits, then return without taking any actions.",
    //   default: false,
    //   setting: "",
    // }),
    sim: Args.flag({
      help: "If set, see the recommended items and skills, then return without taking any actions.",
      default: false,
      setting: "",
    }),
    simperms: Args.flag({
      help: "If set, see your current and available perms, as well as the plan for this run, then return without taking any actions.",
      default: false,
      setting: "",
    }),
    list: Args.flag({
      help: "Show the status of all tasks and exit.",
      setting: "",
    }),

    //partial run args
    actions: Args.number({
      help: "Maximum number of actions to perform, if given. Can be used to execute just a few steps at a time.",
    }),
    abort: Args.string({
      help: "If given, abort during the prepare() step for the task with matching name.",
    }),

    //configuration args
    /*permtier: Args.number({
      help: `Target perming all skills in the given tier and all better tiers. Choose 0 to only perm non-gnome, non-guild skills that you may have manually learned`,
      options: [[-1, "Do not perm anything"] as [number, (string | undefined)?]].concat(
        permTiers.map((str, num) => [
          num,
          str.length < 40 ? str.substring(9) : `${str.substring(9, 37)}...`,
        ])
      ),
      // options: [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => [num]),
      default: 6,
    }),*/
    pvp: Args.flag({ help: "If true, break hippy stone and do pvp.", default: false }),
    ptrack: Args.flag({
      help: "If true, use ptrack at start and finish for ptrack profit tracking.",
      default: false,
    }),
    astralpet: Args.custom(
      {
        help: "Choose the astral pet you want to buy in valhalla",
        options:
          $items`astral bludgeon, astral shield, astral chapeau, astral bracer, astral longbow, astral shorts, astral mace, astral trousers, astral ring, astral statuette, astral pistol, astral mask, astral pet sweater, astral shirt, astral belt, none`.map(
            (it) => [it]
          ),
        default: $item`astral pet sweater`,
      },
      Item.get,
      "ITEM"
    ),
    moonsign: Args.custom(
      {
        help: "Choose the moonsign you want to ascend into",
        options: [
          "mongoose",
          "wallaby",
          "vole",
          "platypus",
          "opossum",
          "marmot",
          "wombat",
          "blender",
          "packrat",
        ].map((str) => [toMoonSign(str)]),
        default: toMoonSign("blender"),
      },
      toMoonSign,
      "MOONSIGN"
    ),
    defaultclass: Args.custom(
      {
        help: "Choose your default class, if smol doesn't have any other goals this run",
        options:
          $classes`Seal Clubber, Turtle Tamer, Pastamancer, Sauceror, Disco Bandit, Accordion Thief`.map(
            (cl) => [cl]
          ),
        default: $class`Seal Clubber`,
      },
      toClass,
      "CLASS"
    ),
    clan: Args.string({
      help: `Your VIP Clan. Smol will whitelist into it at the beginning of your day. Requires clan whitelist.`,
    }),
    pulls: Args.items({
      help: "A list of items to pull at the start of the smol run.",
      default: [
        ...$items`mafia thumb ring, lucky gold ring`,
        ...(get("stenchAirportAlways") || get("_stenchAirportToday")
          ? []
          : $items`one-day ticket to Dinseylandfill`),
      ],
    }),
    smolscript: Args.string({
      help: "The command that will do your smol run for you. Include any arguments desired.",
      default: "loopsmol",
    }),
    garbo: Args.string({
      help: "The command that will be used to diet and use all your adventures after reaching level 13 in Day 1 aftercore.",
      default: "garbo",
    }),
    garboascend: Args.string({
      help: `The command that will be used to diet and use all your adventures in Day 2 aftercore.`,
      default: "garbo ascend",
    }),
    tip: Args.flag({
      help: "Send all your soap knives to the author. Thanks!",
      default: false,
    }),
  }
);
