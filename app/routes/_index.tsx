import { type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
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

export interface RaceInfo {
  startTime: number;
  currentTime: number;
  isRunning: boolean;
  isFinished: boolean;
  numberOfRunners: number;
  numberOfStages: number;
  raceDate: string;
}

export default function Index() {
  const [raceInfo, setRaceInfo] = useState<RaceInfo>({
    startTime: 0,
    currentTime: 0,
    isRunning: false,
    isFinished: false,
    numberOfRunners: 20,
    numberOfStages: 5,
    raceDate: new Date().toLocaleDateString(),
  });
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [splitTimes, setSplitTimes] = useState<SplitTime[]>(
    [...Array(raceInfo.numberOfRunners)].map((_, i) => ({
      runner: i + 1,
      stage: [...Array(raceInfo.numberOfStages)].map((_, i) => ({
        id: i + 1,
        time: 0,
      })),
    })),
  );
  const { request, release } = useWakeLock();

  useEffect(() => {
    if (!raceInfo.isRunning) {
      clearInterval(intervalId!);
    }
  }, [intervalId, raceInfo.isRunning]);

  useEffect(() => {
    if (!raceInfo.isRunning) {
      return;
    }
    const haveAllFinished = splitTimes.every((splitTime) =>
      splitTime.stage.every((stage) => stage.time),
    );
    if (haveAllFinished) {
      setRaceInfo((prev) => ({ ...prev, isRunning: false, isFinished: true }));
      release();
      localforage.setItem(`${raceInfo.startTime}`, {
        splitTimes,
        raceInfo,
      });
    }
  }, [raceInfo, raceInfo.startTime, release, splitTimes]);

  const hasRunnerFinished = (runner: number) => {
    return (
      splitTimes
        .find((splitTime) => splitTime.runner === runner)
        ?.stage.every((stage) => stage.time) || false
    );
  };

  const onFinish = () => {
    setRaceInfo((prev) => ({ ...prev, isRunning: false, isFinished: true }));
    release();
    localforage.setItem(`${raceInfo.startTime}`, {
      splitTimes,
      raceInfo,
    });
  };

  const onStart = () => {
    request();
    setSplitTimes(
      [...Array(raceInfo.numberOfRunners)].map((_, i) => ({
        runner: i + 1,
        stage: [...Array(raceInfo.numberOfStages)].map((_, i) => ({
          id: i + 1,
          time: 0,
        })),
      })),
    );
    const now = Date.now();
    setRaceInfo((prev) => ({
      ...prev,
      startTime: now,
      isRunning: true,
      currentTime: now,
    }));
    setIntervalId(
      setInterval(() => {
        setRaceInfo((prev) => ({ ...prev, currentTime: Date.now() }));
      }, 1000),
    );
  };

  const handleStageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newNum = parseInt(e.target.value, 10) || 0;
    clearInterval(intervalId!);
    setRaceInfo((prev) => ({
      ...prev,
      startTime: 0,
      isRunning: false,
      isFinished: false,
      numberOfStages: newNum,
      currentTime: 0,
    }));
    setSplitTimes(
      newNum
        ? [...Array(raceInfo.numberOfRunners)].map((_, i) => ({
            runner: i + 1,
            stage: [...Array(newNum)].map((_, i) => ({
              id: i + 1,
              time: 0,
            })),
          }))
        : [],
    );
  };

  const handleNumberOfRunnersChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newNum = parseInt(e.target.value, 10) || 0;
    clearInterval(intervalId!);
    setRaceInfo((prev) => ({
      ...prev,
      startTime: 0,
      isRunning: false,
      isFinished: false,
      numberOfRunners: newNum,
      currentTime: 0,
    }));
    setSplitTimes(
      newNum
        ? [...Array(newNum)].map((_, i) => ({
            runner: i + 1,
            stage: [...Array(raceInfo.numberOfStages)].map((_, i) => ({
              id: i + 1,
              time: 0,
            })),
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
      const stages = [...splitTime.stage];
      const index = stages.findIndex((stage) => !stage.time);
      const timeTilNow =
        index === 0
          ? 0
          : stages.slice(0, index).reduce((acc, stage) => acc + stage.time, 0);
      const newSplitTime = {
        ...splitTime,
        stage: [
          ...stages.slice(0, index),
          {
            ...stages[index],
            time: raceInfo.currentTime - raceInfo.startTime - timeTilNow,
          },
          ...stages.slice(index + 1),
        ],
      };
      setSplitTimes(
        splitTimes.map((splitTime) =>
          splitTime.runner === runner ? newSplitTime : splitTime,
        ),
      );
      if (haveAllRunnersFinished()) onFinish();
    }
  };

  const undoLastSplit = (runner: number) => {
    const splitTime = splitTimes.find(
      (splitTime) => splitTime.runner === runner,
    );
    if (!splitTime) return;
    const stages = [...splitTime.stage].reverse();
    const index = stages.findIndex((stage) => stage.time);
    if (index === -1) return;
    const newStages = [
      ...stages.slice(0, index),
      { ...stages[index], time: 0 },
      ...stages.slice(index + 1),
    ].reverse();
    const newSplitTime = {
      ...splitTime,
      stage: newStages,
    };
    setSplitTimes(
      splitTimes.map((splitTime) =>
        splitTime.runner === runner ? newSplitTime : splitTime,
      ),
    );
  };

  const haveAllRunnersFinished = () => {
    return splitTimes.every((splitTime) =>
      splitTime.stage.every((stage) => stage.time),
    );
  };

  return (
    <main className="relative min-h-screenm-6">
      <div className="m-4">
        <div
          className={`flex justify-between gap-2 ${
            raceInfo.isRunning ? "flex-row" : "flex-col"
          }`}
        >
          <div
            id="time"
            className={`text-4xl font-bold bg-gray-300 p-2 rounded-md text-center ${
              !raceInfo.isRunning && "hidden"
            }`}
          >
            {convertMsToTime(raceInfo.currentTime - raceInfo.startTime)}
          </div>
          {!raceInfo.isRunning ? (
            <>
              <label htmlFor="numberOfRunners" className="flex flex-col">
                <span>Number of Runners</span>
                <input
                  type="number"
                  name="numberOfRunners"
                  id="numberOfRunners"
                  onChange={handleNumberOfRunnersChange}
                  defaultValue={raceInfo.numberOfRunners}
                  className="p-2 rounded-md border border-gray-300"
                  disabled={raceInfo.isRunning}
                />
              </label>

              <label htmlFor="numberOfStages" className="flex flex-col">
                <span>Number of Stages (inc transitions if needed)</span>
                <input
                  type="number"
                  name="numberOfStages"
                  id="numberOfStages"
                  onChange={handleStageChange}
                  defaultValue={raceInfo.numberOfStages}
                  className="p-2 rounded-md border border-gray-300"
                  disabled={raceInfo.isRunning}
                />
              </label>
            </>
          ) : null}

          <Button
            id="startStopButton"
            className="px-12"
            onClick={() => {
              if (!raceInfo.isRunning) {
                onStart();
              } else {
                onFinish();
              }
            }}
            variant={raceInfo.isRunning ? "warn" : "success"}
            disabled={!raceInfo.numberOfRunners || !raceInfo.numberOfStages}
          >
            {raceInfo.isRunning ? "Finish" : "Start"} Race
          </Button>
          {!raceInfo.isRunning ? (
            <div className="flex gap-4 w-full">
              {raceInfo.isFinished ? (
                <Link
                  to={`/race/${raceInfo.startTime}`}
                  className="px-12 bg-slate-800 text-white p-2 rounded-md text-center grow"
                >
                  Show Results
                </Link>
              ) : null}
              <Link
                to="/races"
                className="px-12 bg-slate-800 text-white p-2 rounded-md text-center grow"
              >
                View Past Races
              </Link>
            </div>
          ) : null}
        </div>
        <div
          className={`grid gap-4 grid-cols-4 md:grid-cols-9 mt-2 ${
            !raceInfo.isRunning && "hidden"
          }`}
        >
          {splitTimes.map((splitTime, i) => {
            const hasFinished = splitTime.stage.every((stage) => stage.time);
            const currentStage =
              splitTime.stage.findIndex((stage) => !stage.time) + 1;
            return (
              <div key={i} className="flex flex-col gap-2">
                <Button
                  onClick={() => handleSplitTime(splitTime.runner)}
                  disabled={hasRunnerFinished(splitTime.runner)}
                  className="w-full"
                >
                  {splitTime.runner}
                  {hasFinished ? " - 🏁" : ` - S${currentStage}`}
                </Button>
                <Button
                  onClick={() => undoLastSplit(splitTime.runner)}
                  variant="warn"
                  className="text-xs w-full p-1"
                >
                  Undo
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
