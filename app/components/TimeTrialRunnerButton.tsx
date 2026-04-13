import { memo } from "react";

import { TimeTrialRunner } from "~/types";
import { convertMsToTime } from "~/utils";

interface TimeTrialRunnerButtonProps {
  runner: TimeTrialRunner;
  currentTime: number;
  onTap: (runner: number) => void;
  onUndo: (runner: number) => void;
}

export const TimeTrialRunnerButton = memo<TimeTrialRunnerButtonProps>(
  function TimeTrialRunnerButton({ runner, currentTime, onTap, onUndo }) {
    const isWaiting = runner.startTime === 0;
    const isRunning = runner.startTime > 0 && runner.finishTime === 0;
    const isFinished = runner.finishTime > 0;

    const elapsed = isFinished
      ? runner.finishTime - runner.startTime
      : isRunning
        ? currentTime - runner.startTime
        : 0;

    return (
      <div className="flex flex-col">
        <button
          type="button"
          onClick={() => onTap(runner.runner)}
          disabled={isFinished}
          className={`w-full rounded-lg rounded-b-none p-3 text-left transition-transform active:scale-95 disabled:scale-100 ${
            isFinished
              ? "bg-green-600 text-white"
              : isRunning
                ? "bg-amber-500 text-white active:bg-amber-600 cursor-pointer animate-pulse"
                : "bg-blue-500 text-white active:bg-blue-600 cursor-pointer"
          }`}
        >
          <div className="flex items-start justify-between">
            <span className="text-3xl font-bold leading-none">
              {runner.runner}
            </span>
            <span className="text-xs font-medium bg-white/20 rounded px-1.5 py-0.5">
              {isFinished ? "Done" : isRunning ? "Running" : "Waiting"}
            </span>
          </div>
          <div className="mt-1.5 min-h-[2.5rem] flex flex-col gap-0.5 justify-center">
            {isRunning || isFinished ? (
              <div className="font-mono text-sm tabular-nums">
                {convertMsToTime(elapsed)}
              </div>
            ) : (
              <div className="font-mono text-xs opacity-50 italic">
                Tap to start
              </div>
            )}
          </div>
        </button>
        <button
          type="button"
          onClick={() => onUndo(runner.runner)}
          disabled={isWaiting}
          className="w-full rounded-b-lg bg-red-500 text-white text-xs font-medium py-1.5 active:bg-red-600 active:scale-95 transition-transform cursor-pointer disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:scale-100"
          aria-label={`Undo runner ${runner.runner}`}
        >
          ↩ Undo
        </button>
      </div>
    );
  },
);
