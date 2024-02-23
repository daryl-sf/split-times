import { FC, useRef } from "react";

import { SplitTime as SplitTimeType } from "~/routes/_index";
import { convertMsToTime } from "~/utils";

import { Button } from "./Button";

export interface SplitTimeProps {
  splits: SplitTimeType[];
  close: () => void;
}

export const SplitTime: FC<SplitTimeProps> = ({ splits, close }) => {
  const tableRef = useRef<HTMLTableElement>(null);
  return (
    <div className="h-screen w-screen bg-white fixed overflow-scroll top-0 p-3 z-50">
      <div className="flex gap-8">
        <Button
          onClick={() => {
            if (tableRef.current) {
              const text = tableRef.current.innerText;
              navigator.clipboard.writeText(text);
              // const range = document.createRange();
              // range.selectNode(tableRef.current);
              // window.getSelection()?.removeAllRanges();
              // window.getSelection()?.addRange(range);
              // document.execCommand("copy");
              // window.getSelection()?.removeAllRanges();
            }
          }}
        >
          Copy Results
        </Button>
        <Button onClick={close} variant="warn">
          Close
        </Button>
      </div>
      <table ref={tableRef}>
        <thead>
          <tr>
            <th>#</th>
            {splits[0].stage.map((stage) => (
              <th key={stage.id}>Stage {stage.id}</th>
            ))}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {splits.map((split) => (
            <tr key={split.runner}>
              <td>{split.runner}</td>
              {split.stage.map((stage) => (
                <td className="px-1" key={stage.id}>
                  {convertMsToTime(stage.time)}
                </td>
              ))}
              <td className="px-1">
                {convertMsToTime(
                  split.stage.reduce((acc, stage) => acc + stage.time, 0),
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
