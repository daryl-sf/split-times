import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { FC } from "react";

import { convertMsToTime } from "~/utils";

import { Button } from "./Button";

interface RaceHeaderProps {
  raceName?: string;
  elapsedTime: number;
  isRunning: boolean;
  onBack: () => void;
  onStart: () => void;
  onFinish: () => void;
}

export const RaceHeader: FC<RaceHeaderProps> = ({
  raceName,
  elapsedTime,
  isRunning,
  onBack,
  onStart,
  onFinish,
}) => {
  return (
    <div className="flex flex-row justify-between gap-2">
      <div
        id="time"
        className="text-4xl font-bold bg-gray-300 p-2 rounded-md text-center"
      >
        {raceName ? (
          <div className="text-sm font-normal text-gray-600">{raceName}</div>
        ) : null}
        {convertMsToTime(elapsedTime)}
      </div>
      {!isRunning ? (
        <div className="flex gap-2">
          <Button className="px-3" onClick={onBack} variant="neutral" aria-label="Back">
            <ChevronLeftIcon className="h-6 w-6" />
          </Button>
          <Button
            id="startStopButton"
            className="px-12"
            onClick={onStart}
            variant="success"
          >
            Start
          </Button>
        </div>
      ) : (
        <Button
          id="startStopButton"
          className="px-12"
          onClick={() => {
            if (window.confirm("Are you sure you want to finish the race?")) {
              onFinish();
            }
          }}
          variant="warn"
        >
          Finish
        </Button>
      )}
    </div>
  );
};
