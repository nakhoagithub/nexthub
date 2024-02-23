import { Job } from "node-schedule";

export interface Crobjob {
  id: string;
  nodeSchedule: Job;
}
