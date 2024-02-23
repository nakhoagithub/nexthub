import mongoose from "mongoose";
import schedule from "node-schedule";
import { StaticPool } from "node-worker-threads-pool";

process.on("SIGINT", function () {
  schedule.gracefulShutdown().then(() => process.exit(0));
});

export const createCronjob = async () => {
  console.log("createCronJob");
};

const fibonacci = (n: number) => {
  var i;
  var fib = [];

  fib[0] = 0;
  fib[1] = 1;
  for (i = 2; i <= n; i++) {
    fib[i] = fib[i - 2] + fib[i - 1];
  }
  return fib;
};

const staticPool = new StaticPool({
  size: 4,
  task: fibonacci,
});

staticPool.exec(9).then(console.log);

// staticPool.destroy();
