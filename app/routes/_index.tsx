import { type MetaFunction } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import localforage from "localforage";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import { Keypad } from "~/components/Keypad";
import { KeypadRunnerTile } from "~/components/KeypadRunnerTile";
import { RaceHeader } from "~/components/RaceHeader";
import { RaceSetupForm } from "~/components/RaceSetupForm";
import { RunnerButton } from "~/components/RunnerButton";
import { UndoToast } from "~/components/UndoToast";
import { RaceInfo, RunnerSplitTime, Stage, UiMode } from "~/types";
import { useWakeLock } from "~/useWakeLock";

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

interface UndoToastState {
  runner: number;
  stageId: number;
  time: number;
  runnerStagesSnapshot: Stage[];
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
  const [uiMode, setUiMode] = useState<UiMode>("keypad");
  const [keypadInput, setKeypadInput] = useState<number | null>(null);
  const [undoToast, setUndoToast] = useState<UndoToastState | null>(null);
  const undoToastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [showRaceView, setShowRaceView] = useState(false);
  const raceInfoRef = useRef(raceInfo);
  raceInfoRef.current = raceInfo;
  const splitTimesRef = useRef(splitTimes);
  splitTimesRef.current = splitTimes;

  useEffect(() => {
    if (!raceInfo.isRunning && intervalId) {
      clearInterval(intervalId);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId, raceInfo.isRunning]);

  const finishRace = useCallback((currentSplitTimes: RunnerSplitTime[]) => {
    const info = raceInfoRef.current;
    const finishedRaceInfo = { ...info, isRunning: false, isFinished: true };
    setRaceInfo(finishedRaceInfo);
    setShowRaceView(false);
    release();
    localforage.setItem(`${info.startTime}`, {
      splitTimes: currentSplitTimes,
      raceInfo: finishedRaceInfo,
    });
  }, [release]);

  useEffect(() => {
    if (!raceInfo.isRunning) return;
    const haveAllFinished = splitTimes.every((splitTime) =>
      splitTime.stage.every((stage) => stage.time),
    );
    if (haveAllFinished) {
      finishRace(splitTimes);
    }
  }, [raceInfo.isRunning, splitTimes, finishRace]);

  useEffect(() => {
    if (!raceInfo.isRunning) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [raceInfo.isRunning]);

  const saveRaceProgress = useCallback((currentSplitTimes: RunnerSplitTime[]) => {
    const info = raceInfoRef.current;
    if (info.startTime) {
      localforage.setItem(`${info.startTime}`, {
        splitTimes: currentSplitTimes,
        raceInfo: info,
      });
    }
  }, []);

  const hasRunnerFinished = (runner: number) => {
    return (
      splitTimes
        .find((splitTime) => splitTime.runner === runner)
        ?.stage.every((stage) => stage.time) || false
    );
  };

  const onFinish = () => finishRace(splitTimes);

  const onEnterRaceView = () => {
    setSplitTimes(createSplitTimes(raceInfo.numberOfRunners, raceInfo.numberOfStages));
    setKeypadInput(null);
    dismissUndoToast();
    setShowRaceView(true);
  };

  const onStartTimer = () => {
    request();
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
      }, 100),
    );
  };

  const handleStageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newNum = parseInt(e.target.value, 10) || 0;
    if (intervalId) clearInterval(intervalId);
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
    if (intervalId) clearInterval(intervalId);
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

  const handleSplitTime = useCallback((runner: number) => {
    const prevSplitTimes = splitTimesRef.current;
    const splitTime = prevSplitTimes.find((st) => st.runner === runner);
    if (!splitTime) return;
    const hasFinished = splitTime.stage.every((stage) => stage.time);
    if (hasFinished) return;

    const stages = [...splitTime.stage];
    const index = stages.findIndex((stage) => !stage.time);
    if (index === -1) return;

    const info = raceInfoRef.current;
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
          time: info.currentTime - info.startTime - timeTilNow,
        },
        ...stages.slice(index + 1),
      ],
    };
    const updatedSplitTimes = prevSplitTimes.map((st) =>
      st.runner === runner ? newSplitTime : st,
    );

    setSplitTimes(updatedSplitTimes);
    saveRaceProgress(updatedSplitTimes);
  }, [saveRaceProgress]);

  const dismissUndoToast = useCallback(() => {
    setUndoToast(null);
    if (undoToastTimerRef.current) {
      clearTimeout(undoToastTimerRef.current);
      undoToastTimerRef.current = null;
    }
  }, []);

  const showUndoToastNotification = useCallback(
    (runner: number, stageId: number, time: number, stagesSnapshot: Stage[]) => {
      if (undoToastTimerRef.current) clearTimeout(undoToastTimerRef.current);
      setUndoToast({ runner, stageId, time, runnerStagesSnapshot: stagesSnapshot });
      undoToastTimerRef.current = setTimeout(() => {
        setUndoToast(null);
        undoToastTimerRef.current = null;
      }, 5000);
    },
    [],
  );

  const handleRedoFromToast = () => {
    if (!undoToast) return;
    const currentSplitTimes = splitTimesRef.current;
    const updatedSplitTimes = currentSplitTimes.map((st) =>
      st.runner === undoToast.runner
        ? { ...st, stage: undoToast.runnerStagesSnapshot }
        : st,
    );
    setSplitTimes(updatedSplitTimes);
    saveRaceProgress(updatedSplitTimes);
    dismissUndoToast();
  };

  const undoLastSplit = useCallback((runner: number) => {
    const prevSplitTimes = splitTimesRef.current;
    const splitTime = prevSplitTimes.find((st) => st.runner === runner);
    if (!splitTime) return;

    const stages = [...splitTime.stage].reverse();
    const index = stages.findIndex((stage) => stage.time);
    if (index === -1) return;

    const undoneStage = stages[index];
    const newStages = [
      ...stages.slice(0, index),
      { ...stages[index], time: 0 },
      ...stages.slice(index + 1),
    ].reverse();
    const newSplitTime = {
      ...splitTime,
      stage: newStages,
    };
    const updatedSplitTimes = prevSplitTimes.map((st) =>
      st.runner === runner ? newSplitTime : st,
    );

    setSplitTimes(updatedSplitTimes);
    saveRaceProgress(updatedSplitTimes);

    if (uiMode === "keypad") {
      showUndoToastNotification(runner, undoneStage.id, undoneStage.time, splitTime.stage);
    }
  }, [uiMode, saveRaceProgress, showUndoToastNotification]);

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
        {!showRaceView ? (
          <RaceSetupForm
            raceName={raceInfo.raceName || ""}
            numberOfRunners={raceInfo.numberOfRunners}
            numberOfStages={raceInfo.numberOfStages}
            uiMode={uiMode}
            isFinished={raceInfo.isFinished}
            startTime={raceInfo.startTime}
            onRaceNameChange={(value) =>
              setRaceInfo((prev) => ({ ...prev, raceName: value }))
            }
            onNumberOfRunnersChange={handleNumberOfRunnersChange}
            onNumberOfStagesChange={handleStageChange}
            onUiModeChange={setUiMode}
            onStartRace={onEnterRaceView}
          />
        ) : (
          <RaceHeader
            raceName={raceInfo.raceName}
            elapsedTime={raceInfo.currentTime - raceInfo.startTime}
            isRunning={raceInfo.isRunning}
            onBack={() => setShowRaceView(false)}
            onStart={onStartTimer}
            onFinish={onFinish}
          />
        )}

        {showRaceView && uiMode === "buttons" ? (
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-2">
            {splitTimes.map((splitTime) => (
              <RunnerButton
                key={splitTime.runner}
                runner={splitTime.runner}
                stages={splitTime.stage}
                numberOfStages={raceInfo.numberOfStages}
                isTimerRunning={raceInfo.isRunning}
                onSplit={handleSplitTime}
                onUndo={undoLastSplit}
              />
            ))}
          </div>
        ) : null}

        {showRaceView && uiMode === "keypad" ? (
          <>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mt-2 pb-96">
              {splitTimes.map((splitTime) => (
                <KeypadRunnerTile
                  key={splitTime.runner}
                  runner={splitTime.runner}
                  stages={splitTime.stage}
                  onUndo={undoLastSplit}
                />
              ))}
            </div>
            {undoToast ? (
              <UndoToast
                runner={undoToast.runner}
                stageId={undoToast.stageId}
                onRedo={handleRedoFromToast}
                onDismiss={dismissUndoToast}
              />
            ) : null}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 pt-2 pb-4 shadow-lg">
              <div className="max-w-md mx-auto">
                <Keypad
                  onChange={handleKeypadChange}
                  numberInput={keypadInput}
                  disabledDel={keypadInput === null}
                  disabledEnter={
                    !raceInfo.isRunning ||
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
