import { type MetaFunction } from "@remix-run/node";
import localforage from "localforage";
import { ChangeEvent, useEffect, useState } from "react";

import { Button } from "~/components/Button";
import { SplitTime } from "~/components/SplitTime";
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
  const [numberOfStages, setNumberOfStages] = useState(5);
  const [showSplitTimes, setShowSplitTimes] = useState(false);
  const [splitTimes, setSplitTimes] = useState<SplitTime[]>(
    [...Array(numberOfRunners)].map((_, i) => ({
      runner: i + 1,
      stage: [...Array(numberOfStages)].map((_, i) => ({ id: i + 1, time: 0 })),
    })),
  );
  const { request, release } = useWakeLock();

  useEffect(() => {
    if (!running) {
      clearInterval(intervalId!);
    }
  }, [running, intervalId]);

  const hasRunnerFinished = (runner: number) => {
    return (
      splitTimes
        .find((splitTime) => splitTime.runner === runner)
        ?.stage.every((stage) => stage.time) || false
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

  const handleStageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newNum = parseInt(e.target.value, 10) || 0;
    clearInterval(intervalId!);
    setStartTime(0);
    setTime(0);
    setRunning(false);
    setNumberOfStages(newNum);
  };

  const handleNumberOfRunnersChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newNum = parseInt(e.target.value, 10) || 0;
    clearInterval(intervalId!);
    setStartTime(0);
    setTime(0);
    setRunning(false);
    setNumberOfRunners(newNum);
    setSplitTimes(
      newNum
        ? [...Array(newNum)].map((_, i) => ({
            runner: i + 1,
            stage: [],
          }))
        : [],
    );
  };

  const handleSplitTime = (runner: number) => {
    const splitTime = splitTimes.find(
      (splitTime) => splitTime.runner === runner,
    );
    if (hasRunnerFinished(runner)) return;
    if (splitTime) {
      const stages = splitTime.stage;
      const index = stages.findIndex((stage) => !stage.time);
      const newSplitTime = {
        ...splitTime,
        stage: stages.map((stage, i) =>
          i === index ? { id: i + 1, time: time - startTime } : stage,
        ),
      };
      setSplitTimes(
        splitTimes.map((splitTime) =>
          splitTime.runner === runner ? newSplitTime : splitTime,
        ),
      );
    }
  };

  return (
    <main className="relative min-h-screenm-6">
      {showSplitTimes ? (
        <SplitTime splits={splitTimes} close={() => setShowSplitTimes(false)} />
      ) : null}
      <div className="m-4">
        <div
          className={`flex justify-between gap-2 ${
            running ? "flex-row" : "flex-col"
          }`}
        >
          <div
            id="time"
            className="text-4xl font-bold bg-gray-300 p-2 rounded-md text-center"
          >
            {convertMsToTime(time - startTime)}
          </div>
          {!running ? (
            <>
              <label htmlFor="numberOfRunners" className="flex flex-col">
                <span>Number of Runners</span>
                <input
                  type="number"
                  name="numberOfRunners"
                  id="numberOfRunners"
                  onChange={handleNumberOfRunnersChange}
                  defaultValue={numberOfRunners}
                  className="p-2 rounded-md border border-gray-300"
                  disabled={running}
                />
              </label>

              <label htmlFor="numberOfStages" className="flex flex-col">
                <span>Number of Stages (inc transitions if needed)</span>
                <input
                  type="number"
                  name="numberOfStages"
                  id="numberOfStages"
                  onChange={handleStageChange}
                  defaultValue={numberOfStages}
                  className="p-2 rounded-md border border-gray-300"
                  disabled={running}
                />
              </label>
            </>
          ) : null}

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
            disabled={!numberOfRunners || !numberOfStages}
          >
            {running ? "Finish" : "Start"} Race
          </Button>
          {!running ? (
            <Button
              className="px-12 bg-slate-800 text-white p-2 rounded-md text-center"
              onClick={() => setShowSplitTimes(true)}
            >
              Show Split Times
            </Button>
          ) : null}
        </div>
        <div className="grid gap-4 grid-cols-4 md:grid-cols-9 mt-2">
          {splitTimes.map((splitTime, i) => (
            <Button
              key={i}
              onClick={() => handleSplitTime(splitTime.runner)}
              disabled={hasRunnerFinished(splitTime.runner)}
              className="w-full"
            >
              {splitTime.runner}
              {splitTime.stage.map((stage, j) => (
                <div key={j}>{convertMsToTime(stage.time)}</div>
              ))}
            </Button>
          ))}
        </div>
      </div>
    </main>
  );
}
