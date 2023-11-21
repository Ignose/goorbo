import { gamedayToInt, print, todayToString } from "kolmafia";
import { Args, getTasks } from "grimoire-kolmafia";
import { AftercoreQuest } from "./tasks/smolaftercore";
import { GyouQuests } from "./tasks/smol";
import { ProfitTrackingEngine } from "./engine/engine";
import { checkReqs } from "./tasks/sim";
import { args } from "./args";
//import { printPermPlan } from "./tasks/perm";

const version = "0.6.8";

const dontSmol = gamedayToInt() === 79 || todayToString().includes("1031");

export function main(command?: string): void {
  Args.fill(args, command);
  if (args.help) {
    Args.showHelp(args);
    return;
  }

  if (dontSmol && args.halloween) {
    throw `Today is halloween, run CS if you can!`;
  }
  // if (args.profits) {
  //   print("work in progress");
  //   return;
  // }
  /*if (args.simperms) {
    checkPerms();
    printPermPlan();
    return;
  }*/
  if (args.sim) {
    checkReqs();
    //printPermPlan();
    return;
  }
  if (args.version) {
    print(`smol v${version}`);
    return;
  }

  print(`Running: smol v${version}`);

  const tasks = getTasks([AftercoreQuest(), ...GyouQuests()]);

  // Abort during the prepare() step of the specified task
  if (args.abort) {
    const to_abort = tasks.find((task) => task.name === args.abort);
    if (!to_abort) throw `Unable to identify task ${args.abort}`;
    to_abort.prepare = (): void => {
      throw `Abort requested`;
    };
  }

  const engine = new ProfitTrackingEngine(tasks, "loop_profit_tracker");
  try {
    if (args.list) {
      listTasks(engine);
      return;
    }

    engine.run(args.actions);

    // Print the next task that will be executed, if it exists
    const task = engine.getNextTask();
    if (task) {
      print(`Next: ${task.name}`, "blue");
    }

    // If the engine ran to completion, all tasks should be complete.
    // Print any tasks that are not complete.
    if (args.actions === undefined) {
      const uncompletedTasks = engine.tasks.filter((t) => !t.completed());
      if (uncompletedTasks.length > 0) {
        print("Uncompleted Tasks:");
        for (const t of uncompletedTasks) {
          print(t.name);
        }
      }
    }
  } finally {
    engine.destruct();
  }
}

function listTasks(engine: ProfitTrackingEngine): void {
  for (const task of engine.tasks) {
    if (task.completed()) {
      print(`${task.name}: Done`, "blue");
    } else {
      if (engine.available(task)) {
        print(`${task.name}: Available`);
      } else {
        print(`${task.name}: Not Available`, "red");
      }
    }
  }
}
