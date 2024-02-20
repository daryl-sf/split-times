import { FC } from "react";

import { SplitTime as SplitTimeType } from "~/routes/_index";
import { convertMsToTime } from "~/utils";

export interface SplitTimeProps {
  splits: SplitTimeType[];
}

export const SplitTime: FC<SplitTimeProps> = ({ splits }) => {
  return (
    <div className="grid grid-cols-4 md:grid-cols-5 gap-4 justify-items-center">
      {splits.map((splitTime, i) => (
        <div key={i}>
          <div>Runner {splitTime.runner}</div>
          <div>
            {!splitTime.stage.length ? <>&nbsp;</> : null}
            {splitTime.stage.map((stage, j) => (
              <div key={j}>
                {stage.id}: {convertMsToTime(stage.time)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
