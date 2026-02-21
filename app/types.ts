export type UiMode = "buttons" | "keypad";

export interface Stage {
  id: number;
  time: number;
}

export interface RunnerSplitTime {
  runner: number;
  stage: Stage[];
}

export interface RaceInfo {
  startTime: number;
  currentTime: number;
  isRunning: boolean;
  isFinished: boolean;
  numberOfRunners: number;
  numberOfStages: number;
  raceDate: string;
  raceName?: string;
}
