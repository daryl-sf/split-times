import type { MetaFunction } from "@remix-run/node";
import localforage from "localforage";
import { ChangeEvent, useEffect, useState } from "react";

import { Button } from "~/components/Button";
import { Keypad } from "~/components/Keypad";
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
  const [numberInput, setNumberInput] = useState<number | null>(null);
  const [splitTimes, setSplitTimes] = useState<SplitTime[]>(
    [...Array(numberOfRunners)].map((_, i) => ({
      runner: i + 1,
      stage: [],
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
      setSplitTimes(
        splitTimes.map((splitTime) =>
          splitTime.runner === runner
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
    }
  };

  const handleNumberInput = (key: number | "del" | "enter") => {
    if (typeof key === "string") {
      if (key === "del") {
        console.log(numberInput, Math.floor(numberInput! / 10));
        setNumberInput(Math.floor(numberInput! / 10) || null);
      } else if (key === "enter") {
        handleSplitTime(numberInput!);
        setNumberInput(null);
      }
      return;
    }
    const newKey = numberInput === null ? key : numberInput * 10 + key;
    setNumberInput(newKey);
  };

  return (
    <main className="relative min-h-screenm-6">
      <div className="flex justify-around mb-8 flex-wrap">
        <div className="flex flex-col justify-between gap-2">
          <div
            id="time"
            className="text-4xl font-bold bg-gray-300 p-2 rounded-md text-center"
          >
            {convertMsToTime(time - startTime)}
          </div>
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
        </div>
        <Keypad
          onChange={handleNumberInput}
          disabledEnter={!numberInput}
          disabledDel={!numberInput}
          numberInput={numberInput}
        />
      </div>
      <SplitTime splits={splitTimes} />
    </main>
  );
}
