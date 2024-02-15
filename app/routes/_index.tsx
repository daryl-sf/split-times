import type { MetaFunction } from "@remix-run/node";
import localforage from "localforage";
import { useEffect, useState } from "react";

import { Button } from "~/components/Button";
import { useWakeLock } from "~/useWakeLock";
import { convertMsToTime } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Split Times" }];

export interface SplitTime {
  runner: number;
  stage: {
    id: number;
    time: number;
  }[];
}

export default function Index() {
  const [startTime, setStartTime] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [numberOfRunners, setNumberOfRunners] = useState(20);
  const [splitTimes, setSplitTimes] = useState<SplitTime[]>([]);
  const [numberOfStages, setNumberOfStages] = useState(5);
  const { request, release } = useWakeLock({
    onRequest: () => console.log("Screen Wake Lock: requested!"),
    onError: () => console.log("An error happened 💥"),
    onRelease: () => console.log("Screen Wake Lock: released!"),
  });

  useEffect(() => {
    if (!running) {
      clearInterval(intervalId!);
    }
  }, [running, intervalId]);

  const hasRunnerFinished = (runner: number) => {
    return (
      splitTimes.find((splitTime) => splitTime.runner === runner)?.stage
        .length === numberOfStages
    );
  };

  const onFinish = () => {
    setRunning(false);
    release();
    localforage.setItem(`splitTimes-${startTime}`, splitTimes);
  };

  const onStart = () => {
    request();
    setStartTime(Date.now());
    setTime(Date.now());
    setRunning(true);
    setIntervalId(
      setInterval(() => {
        setTime(Date.now());
      }, 1000),
    );
  };

  return (
    <main className="relative min-h-screen bg-white m-6">
      <h1 className="text-4xl font-bold text-center">Split Times</h1>
      <div id="clock" className="flex justify-between my-8">
        <div
          id="time"
          className="text-2xl font-bold bg-gray-100 p-2 rounded-md"
        >
          {convertMsToTime(time - startTime)}
        </div>
        <div className="flex gap-8">
          <label htmlFor="numberOfRunners" className="flex flex-col">
            <span>Number of Runners</span>
            <select
              name="numberOfRunners"
              id="numberOfRunners"
              onChange={(e) => setNumberOfRunners(parseInt(e.target.value, 10))}
              value={numberOfRunners}
              className="p-2 rounded-md border border-gray-300"
            >
              {[...Array(100)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} Runners
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="numberOfStages" className="flex flex-col">
            <span>Number of Stages</span>
            <select
              name="numberOfStages"
              id="numberOfStages"
              onChange={(e) => setNumberOfStages(parseInt(e.target.value, 10))}
              value={numberOfStages}
              className="p-2 rounded-md border border-gray-300"
            >
              {[...Array(5)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} Stages
                </option>
              ))}
            </select>
          </label>

          <Button
            id="startStopButton"
            className="px-12"
            onClick={() => {
              if (!running) {
                onStart();
              } else {
                onFinish();
              }
            }}
            variant={running ? "warn" : "success"}
          >
            {running ? "Finish" : "Start"}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-10 gap-2">
        {[...Array(numberOfRunners)].map((_, i) => (
          <Button
            key={i}
            disabled={hasRunnerFinished(i + 1)}
            onClick={() => {
              const splitTime = splitTimes.find(
                (splitTime) => splitTime.runner === i + 1,
              );
              if (splitTime) {
                setSplitTimes(
                  splitTimes.map((splitTime) =>
                    splitTime.runner === i + 1
                      ? {
                          ...splitTime,
                          stage: [
                            ...splitTime.stage,
                            {
                              id: splitTime.stage.length + 1,
                              time: time - startTime,
                            },
                          ],
                        }
                      : splitTime,
                  ),
                );
              } else {
                setSplitTimes([
                  ...splitTimes,
                  {
                    runner: i + 1,
                    stage: [
                      {
                        id: 1,
                        time: time - startTime,
                      },
                    ],
                  },
                ]);
              }
            }}
          >
            {i + 1}
          </Button>
        ))}
      </div>
      <div>
        {splitTimes.map((splitTime, i) => (
          <div key={i} className="flex gap-2">
            <div>Runner {splitTime.runner}</div>
            <div>
              {splitTime.stage.map((stage, j) => (
                <div key={j}>
                  Stage {stage.id}: {convertMsToTime(stage.time)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
