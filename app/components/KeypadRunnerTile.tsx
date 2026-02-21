import { memo } from "react";

import { Stage } from "~/types";
import { convertMsToTime } from "~/utils";

interface KeypadRunnerTileProps {
  runner: number;
  stages: Stage[];
  onUndo: (runner: number) => void;
}

export const KeypadRunnerTile = memo<KeypadRunnerTileProps>(function KeypadRunnerTile({
  runner,
  stages,
  onUndo,
}) {
  const hasFinished = stages.every((stage) => stage.time);
  const currentStageNum = stages.findIndex((stage) => !stage.time) + 1;
  const lastSplit = [...stages].reverse().find((s) => s.time > 0) || null;

  return (
    <button
      type="button"
      onClick={() => onUndo(runner)}
      disabled={!lastSplit}
      className={`p-2 rounded-md text-center ${
        hasFinished
          ? "bg-green-100 border border-green-400"
          : lastSplit
            ? "bg-blue-50 border border-blue-200 active:bg-blue-100 cursor-pointer"
            : "bg-gray-50 border border-gray-200"
      }`}
    >
      <div className="font-bold text-lg">{runner}</div>
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
});
