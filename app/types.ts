export interface RunnerSplitTime {
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
  raceName?: string;
}
