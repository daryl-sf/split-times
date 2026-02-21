import { Link } from "@remix-run/react";
import { ChangeEvent, FC } from "react";

import { UiMode } from "~/types";

import { Button } from "./Button";

interface RaceSetupFormProps {
  raceName: string;
  numberOfRunners: number;
  numberOfStages: number;
  uiMode: UiMode;
  isFinished: boolean;
  startTime: number;
  onRaceNameChange: (value: string) => void;
  onNumberOfRunnersChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onNumberOfStagesChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onUiModeChange: (mode: UiMode) => void;
  onStartRace: () => void;
}

export const RaceSetupForm: FC<RaceSetupFormProps> = ({
  raceName,
  numberOfRunners,
  numberOfStages,
  uiMode,
  isFinished,
  startTime,
  onRaceNameChange,
  onNumberOfRunnersChange,
  onNumberOfStagesChange,
  onUiModeChange,
  onStartRace,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="raceName" className="flex flex-col">
        <span>Race Name (optional)</span>
        <input
          type="text"
          name="raceName"
          id="raceName"
          onChange={(e) => onRaceNameChange(e.target.value)}
          value={raceName}
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
          onChange={onNumberOfRunnersChange}
          defaultValue={numberOfRunners}
          className="p-2 rounded-md border border-gray-300"
        />
      </label>

      <label htmlFor="numberOfStages" className="flex flex-col">
        <span>Number of Stages (inc transitions if needed)</span>
        <input
          type="number"
          name="numberOfStages"
          id="numberOfStages"
          onChange={onNumberOfStagesChange}
          defaultValue={numberOfStages}
          className="p-2 rounded-md border border-gray-300"
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
              onChange={() => onUiModeChange("buttons")}
              className="sr-only"
            />
            <span className="font-medium">Buttons</span>
            <span
              className={`text-xs mt-1 ${
                uiMode === "buttons" ? "text-blue-100" : "text-gray-500"
              }`}
            >
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
              onChange={() => onUiModeChange("keypad")}
              className="sr-only"
            />
            <span className="font-medium">Keypad</span>
            <span
              className={`text-xs mt-1 ${
                uiMode === "keypad" ? "text-blue-100" : "text-gray-500"
              }`}
            >
              Best for races with lots of runners. Type a runner number and
              press enter. Tap a runner to undo.
            </span>
          </label>
        </div>
      </fieldset>

      <Button
        id="startStopButton"
        className="px-12"
        onClick={onStartRace}
        variant="success"
        disabled={!numberOfRunners || !numberOfStages}
      >
        Start Race
      </Button>
      <div className="flex gap-4 w-full">
        {isFinished ? (
          <Link
            to={`/race/${startTime}`}
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
    </div>
  );
};
