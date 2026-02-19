import { type MetaFunction } from "@remix-run/node";
import { isRouteErrorResponse, Link, useRouteError } from "@remix-run/react";
import localforage from "localforage";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import { Button } from "~/components/Button";
import { Keypad } from "~/components/Keypad";
import { RaceInfo, RunnerSplitTime } from "~/types";
import { useWakeLock } from "~/useWakeLock";
import { convertMsToTime } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Split Times" }];

function createSplitTimes(runners: number, stages: number): RunnerSplitTime[] {
  if (!runners || !stages) return [];
  return [...Array(runners)].map((_, i) => ({
    runner: i + 1,
    stage: [...Array(stages)].map((_, j) => ({
      id: j + 1,
      time: 0,
    })),
  }));
}

interface UndoToast {
  runner: number;
  stageId: number;
  time: number;
  splitTimesSnapshot: RunnerSplitTime[];
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
    raceName: "",
  });
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [splitTimes, setSplitTimes] = useState<RunnerSplitTime[]>(
    createSplitTimes(20, 5),
  );
  const { request, release } = useWakeLock();
  const [uiMode, setUiMode] = useState<"buttons" | "keypad">("keypad");
  const [keypadInput, setKeypadInput] = useState<number | null>(null);
  const [undoToast, setUndoToast] = useState<UndoToast | null>(null);
  const undoToastTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!raceInfo.isRunning) {
      clearInterval(intervalId!);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId, raceInfo.isRunning]);

  useEffect(() => {
    if (!raceInfo.isRunning) {
      return;
    }
    const haveAllFinished = splitTimes.every((splitTime) =>
      splitTime.stage.every((stage) => stage.time),
    );
    if (haveAllFinished) {
      const finishedRaceInfo = { ...raceInfo, isRunning: false, isFinished: true };
      setRaceInfo(finishedRaceInfo);
      release();
      localforage.setItem(`${raceInfo.startTime}`, {
        splitTimes,
        raceInfo: finishedRaceInfo,
      });
    }
  }, [raceInfo, raceInfo.startTime, release, splitTimes]);

  useEffect(() => {
    if (!raceInfo.isRunning) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [raceInfo.isRunning]);

  const saveRaceProgress = (currentSplitTimes: RunnerSplitTime[]) => {
    if (raceInfo.startTime) {
      localforage.setItem(`${raceInfo.startTime}`, {
        splitTimes: currentSplitTimes,
        raceInfo,
      });
    }
  };

  const hasRunnerFinished = (runner: number) => {
    return (
      splitTimes
        .find((splitTime) => splitTime.runner === runner)
        ?.stage.every((stage) => stage.time) || false
    );
  };

  const onFinish = () => {
    const finishedRaceInfo = { ...raceInfo, isRunning: false, isFinished: true };
    setRaceInfo(finishedRaceInfo);
    release();
    localforage.setItem(`${raceInfo.startTime}`, {
      splitTimes,
      raceInfo: finishedRaceInfo,
    });
  };

  const onStart = () => {
    request();
    setSplitTimes(createSplitTimes(raceInfo.numberOfRunners, raceInfo.numberOfStages));
    setKeypadInput(null);
    dismissUndoToast();
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
    setSplitTimes(createSplitTimes(raceInfo.numberOfRunners, newNum));
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
    setSplitTimes(createSplitTimes(newNum, raceInfo.numberOfStages));
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
      const updatedSplitTimes = splitTimes.map((splitTime) =>
        splitTime.runner === runner ? newSplitTime : splitTime,
      );
      setSplitTimes(updatedSplitTimes);
      saveRaceProgress(updatedSplitTimes);
    }
  };

  const dismissUndoToast = useCallback(() => {
    setUndoToast(null);
    if (undoToastTimerRef.current) {
      clearTimeout(undoToastTimerRef.current);
      undoToastTimerRef.current = null;
    }
  }, []);

  const showUndoToast = useCallback(
    (runner: number, stageId: number, time: number, snapshot: RunnerSplitTime[]) => {
      if (undoToastTimerRef.current) clearTimeout(undoToastTimerRef.current);
      setUndoToast({ runner, stageId, time, splitTimesSnapshot: snapshot });
      undoToastTimerRef.current = setTimeout(() => {
        setUndoToast(null);
        undoToastTimerRef.current = null;
      }, 5000);
    },
    [],
  );

  const handleRedoFromToast = () => {
    if (!undoToast) return;
    setSplitTimes(undoToast.splitTimesSnapshot);
    saveRaceProgress(undoToast.splitTimesSnapshot);
    dismissUndoToast();
  };

  const undoLastSplit = (runner: number) => {
    const splitTime = splitTimes.find(
      (splitTime) => splitTime.runner === runner,
    );
    if (!splitTime) return;
    const stages = [...splitTime.stage].reverse();
    const index = stages.findIndex((stage) => stage.time);
    if (index === -1) return;

    const undoneStage = stages[index];
    const snapshotBeforeUndo = splitTimes;

    const newStages = [
      ...stages.slice(0, index),
      { ...stages[index], time: 0 },
      ...stages.slice(index + 1),
    ].reverse();
    const newSplitTime = {
      ...splitTime,
      stage: newStages,
    };
    const updatedSplitTimes = splitTimes.map((splitTime) =>
      splitTime.runner === runner ? newSplitTime : splitTime,
    );
    setSplitTimes(updatedSplitTimes);
    saveRaceProgress(updatedSplitTimes);

    if (uiMode === "keypad") {
      showUndoToast(runner, undoneStage.id, undoneStage.time, snapshotBeforeUndo);
    }
  };

  const getLastRecordedSplit = (runner: number) => {
    const splitTime = splitTimes.find((st) => st.runner === runner);
    if (!splitTime) return null;
    return [...splitTime.stage].reverse().find((s) => s.time > 0) || null;
  };

  const handleKeypadChange = (value: number | "del" | "enter") => {
    if (value === "del") {
      setKeypadInput((prev) => {
        if (prev === null) return null;
        const str = String(prev).slice(0, -1);
        return str ? parseInt(str, 10) : null;
      });
    } else if (value === "enter") {
      if (
        keypadInput !== null &&
        keypadInput > 0 &&
        keypadInput <= raceInfo.numberOfRunners
      ) {
        if (!hasRunnerFinished(keypadInput)) {
          handleSplitTime(keypadInput);
        }
        setKeypadInput(null);
      }
    } else {
      setKeypadInput((prev) => {
        const newVal =
          prev === null ? value : parseInt(`${prev}${value}`, 10);
        return newVal;
      });
    }
  };

  return (
    <main className="relative min-h-screen">
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
            {raceInfo.raceName ? (
              <div className="text-sm font-normal text-gray-600">{raceInfo.raceName}</div>
            ) : null}
            {convertMsToTime(raceInfo.currentTime - raceInfo.startTime)}
          </div>
          {!raceInfo.isRunning ? (
            <>
              <label htmlFor="raceName" className="flex flex-col">
                <span>Race Name (optional)</span>
                <input
                  type="text"
                  name="raceName"
                  id="raceName"
                  onChange={(e) =>
                    setRaceInfo((prev) => ({ ...prev, raceName: e.target.value }))
                  }
                  value={raceInfo.raceName || ""}
                  placeholder="e.g. Parkrun #42"
                  className="p-2 rounded-md border border-gray-300"
                />
              </label>

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

              <fieldset className="flex flex-col">
                <legend>Input Mode</legend>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex flex-col rounded-md p-3 cursor-pointer transition-colors border ${
                      uiMode === "buttons"
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="uiMode"
                      value="buttons"
                      checked={uiMode === "buttons"}
                      onChange={() => setUiMode("buttons")}
                      className="sr-only"
                    />
                    <span className="font-medium">Buttons</span>
                    <span className={`text-xs mt-1 ${
                      uiMode === "buttons" ? "text-blue-100" : "text-gray-500"
                    }`}>
                      One button per runner. Tap to record, with individual undo.
                    </span>
                  </label>
                  <label
                    className={`flex flex-col rounded-md p-3 cursor-pointer transition-colors border ${
                      uiMode === "keypad"
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="uiMode"
                      value="keypad"
                      checked={uiMode === "keypad"}
                      onChange={() => setUiMode("keypad")}
                      className="sr-only"
                    />
                    <span className="font-medium">Keypad</span>
                    <span className={`text-xs mt-1 ${
                      uiMode === "keypad" ? "text-blue-100" : "text-gray-500"
                    }`}>
                      Type a runner number and press enter. Tap a runner to undo.
                    </span>
                  </label>
                </div>
              </fieldset>
            </>
          ) : null}

          <Button
            id="startStopButton"
            className="px-12"
            onClick={() => {
              if (!raceInfo.isRunning) {
                onStart();
              } else if (window.confirm("Are you sure you want to finish the race?")) {
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
        {raceInfo.isRunning && uiMode === "buttons" ? (
          <div className="grid gap-4 grid-cols-4 md:grid-cols-9 mt-2">
            {splitTimes.map((splitTime, i) => {
              const hasFinished = splitTime.stage.every(
                (stage) => stage.time,
              );
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
        ) : null}

        {raceInfo.isRunning && uiMode === "keypad" ? (
          <>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mt-2 pb-96">
              {splitTimes.map((splitTime) => {
                const hasFinished = splitTime.stage.every(
                  (stage) => stage.time,
                );
                const currentStageNum =
                  splitTime.stage.findIndex((stage) => !stage.time) + 1;
                const lastSplit = getLastRecordedSplit(splitTime.runner);
                return (
                  <button
                    key={splitTime.runner}
                    type="button"
                    onClick={() => undoLastSplit(splitTime.runner)}
                    disabled={!lastSplit}
                    className={`p-2 rounded-md text-center ${
                      hasFinished
                        ? "bg-green-100 border border-green-400"
                        : lastSplit
                          ? "bg-blue-50 border border-blue-200 active:bg-blue-100 cursor-pointer"
                          : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="font-bold text-lg">
                      {splitTime.runner}
                    </div>
                    <div className="text-xs text-gray-500">
                      {hasFinished
                        ? "🏁 Done"
                        : currentStageNum > 0
                          ? `S${currentStageNum}`
                          : "S1"}
                    </div>
                    {lastSplit ? (
                      <div className="text-xs font-mono mt-1">
                        {convertMsToTime(lastSplit.time)}
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
            {undoToast ? (
              <div className="fixed bottom-[340px] left-4 right-4 z-10 pointer-events-none flex justify-center">
                <div className="pointer-events-auto bg-gray-800 text-white rounded-lg px-4 py-2 shadow-lg flex items-center gap-3 text-sm">
                  <span>
                    Undid runner #{undoToast.runner} S{undoToast.stageId}
                  </span>
                  <button
                    type="button"
                    onClick={handleRedoFromToast}
                    className="font-bold text-blue-300 hover:text-blue-100 active:scale-95"
                  >
                    Redo
                  </button>
                  <button
                    type="button"
                    onClick={dismissUndoToast}
                    className="text-gray-400 hover:text-white ml-1"
                  >
                    &times;
                  </button>
                </div>
              </div>
            ) : null}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 pt-2 pb-4 shadow-lg">
              <div className="max-w-md mx-auto">
                <Keypad
                  onChange={handleKeypadChange}
                  numberInput={keypadInput}
                  disabledDel={keypadInput === null}
                  disabledEnter={
                    keypadInput === null ||
                    keypadInput < 1 ||
                    keypadInput > raceInfo.numberOfRunners ||
                    hasRunnerFinished(keypadInput)
                  }
                />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <main className="relative min-h-screen p-8 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">
        {isRouteErrorResponse(error)
          ? `${error.status} ${error.statusText}`
          : "Something went wrong"}
      </h1>
      <p className="text-gray-600 mb-6">
        {isRouteErrorResponse(error)
          ? error.data
          : "An unexpected error occurred. Please try refreshing the page."}
      </p>
      <a href="/" className="px-6 bg-slate-800 text-white p-2 rounded-md">
        Reload
      </a>
    </main>
  );
}
