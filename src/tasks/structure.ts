import { Quest as BaseQuest, Task as BaseTask, Limit } from "grimoire-kolmafia";
import { myDaycount } from "kolmafia";
import { get } from "libram";

export type Task = BaseTask & {
  tracking?: string;
  limit?: Limit;
  clear?: "all" | "outfit" | "macro" | ("outfit" | "macro")[];
};
export type Quest = BaseQuest<Task>;

export enum Leg {
  Aftercore = 0,
  Smol = 1,
  last = 1,
}

export function getCurrentLeg(): number {
  if (myDaycount() === 1 || get("kingLiberated", false)) return Leg.Smol;
  return Leg.Aftercore;
}
