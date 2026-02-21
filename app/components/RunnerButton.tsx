import { memo } from "react";

import { Stage } from "~/types";
import { convertMsToTime } from "~/utils";

interface RunnerButtonProps {
  runner: number;
  stages: Stage[];
  numberOfStages: number;
  isTimerRunning: boolean;
  onSplit: (runner: number) => void;
  onUndo: (runner: number) => void;
}

export const RunnerButton = memo<RunnerButtonProps>(function RunnerButton({
  runner,
  stages,
  numberOfStages,
  isTimerRunning,
  onSplit,
  onUndo,
}) {
  const hasFinished = stages.every((stage) => stage.time);
  const lastSplit = [...stages].reverse().find((s) => s.time > 0) || null;
  const completedStages = stages.filter((s) => s.time > 0).length;
  const totalTime = stages.reduce((acc, s) => acc + s.time, 0);

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => onSplit(runner)}
        disabled={hasFinished || !isTimerRunning}
        className={`w-full rounded-lg rounded-b-none p-3 text-left transition-transform active:scale-95 disabled:scale-100 ${
          hasFinished
            ? "bg-green-600 text-white"
            : "bg-blue-500 text-white active:bg-blue-600 cursor-pointer"
        }`}
      >
        <div className="flex items-start justify-between">
          <span className="text-3xl font-bold leading-none">{runner}</span>
          <span className="text-xs font-medium bg-white/20 rounded px-1.5 py-0.5">
            {hasFinished ? "Done" : `${completedStages}/${numberOfStages}`}
          </span>
        </div>
        <div className="mt-1.5 min-h-[2.5rem] flex flex-col gap-0.5 justify-center">
          {lastSplit ? (
            <>
              <div className="font-mono text-sm tabular-nums">
                {convertMsToTime(totalTime)}
              </div>
              <div className="font-mono text-xs tabular-nums opacity-70">
                {convertMsToTime(lastSplit.time)}
              </div>
            </>
          ) : (
            <div className="font-mono text-xs opacity-50 italic">
              No splits yet
            </div>
          )}
        </div>
      </button>
      <button
        type="button"
        onClick={() => onUndo(runner)}
        disabled={!lastSplit}
        className="w-full rounded-b-lg bg-red-500 text-white text-xs font-medium py-1.5 active:bg-red-600 active:scale-95 transition-transform cursor-pointer disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:scale-100"
        aria-label={`Undo runner ${runner}`}
      >
        ↩ Undo
      </button>
    </div>
  );
});
