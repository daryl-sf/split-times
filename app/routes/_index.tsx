import type { MetaFunction } from "@remix-run/node";
import localforage from "localforage";
import { ChangeEvent, useEffect, useState } from "react";

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

  const handleStageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setNumberOfStages(parseInt(e.target.value, 10));
    setSplitTimes(
      [...Array(numberOfRunners)].map((_, i) => ({
        runner: i + 1,
        stage: [...Array(numberOfStages)].map((_, j) => ({
          id: j + 1,
          time: 0,
        })),
      })),
    );
  };

  const handleNumberOfRunnersChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setNumberOfRunners(parseInt(e.target.value, 10));
    setSplitTimes(
      [...Array(numberOfRunners)].map((_, i) => ({
        runner: i + 1,
        stage: [...Array(numberOfStages)].map((_, j) => ({
          id: j + 1,
          time: 0,
        })),
      })),
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
      <h1 className="text-6xl font-bold text-center">Simple Split Times</h1>
      <div
        id="time"
        className="text-4xl font-bold bg-gray-300 p-2 rounded-md text-center my-8"
      >
        {convertMsToTime(time - startTime)}
      </div>
      <div className="flex justify-center mb-8">
        <div className="flex gap-8">
          <label htmlFor="numberOfRunners" className="flex flex-col">
            <span>Number of Runners</span>
            <select
              name="numberOfRunners"
              id="numberOfRunners"
              onChange={handleNumberOfRunnersChange}
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
              onChange={handleStageChange}
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
            {running ? "Finish" : "Start"} Race
          </Button>
        </div>
      </div>
      <div className="col-span-3 text-2xl my-2 mx-auto text-center">
        {numberInput || <>&nbsp;</>}
      </div>
      <div className="grid grid-cols-3 grid-rows-4 gap-4 w-1/2 mx-auto">
        <Button onClick={() => handleNumberInput(1)}>1</Button>
        <Button onClick={() => handleNumberInput(2)}>2</Button>
        <Button onClick={() => handleNumberInput(3)}>3</Button>
        <Button onClick={() => handleNumberInput(4)}>4</Button>
        <Button onClick={() => handleNumberInput(5)}>5</Button>
        <Button onClick={() => handleNumberInput(6)}>6</Button>
        <Button onClick={() => handleNumberInput(7)}>7</Button>
        <Button onClick={() => handleNumberInput(8)}>8</Button>
        <Button onClick={() => handleNumberInput(9)}>9</Button>
        <Button
          onClick={() => handleNumberInput("del")}
          disabled={!numberInput}
        >
          &lt;
        </Button>
        <Button onClick={() => handleNumberInput(0)}>0</Button>
        <Button
          onClick={() => handleNumberInput("enter")}
          disabled={!numberInput}
        >
          Enter
        </Button>
      </div>
      <div className="grid grid-cols-5 gap-4 justify-items-center mt-8">
        {splitTimes.map((splitTime, i) => (
          <div key={i}>
            <div>Runner {splitTime.runner}</div>
            <div>
              {!splitTime.stage.length ? <>&nbsp;</> : null}
              {splitTime.stage.map((stage, j) => (
                <div key={j}>
                  {stage.id}: {convertMsToTime(stage.time)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
