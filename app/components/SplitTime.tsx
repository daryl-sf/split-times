import { Link } from "@remix-run/react";
import { FC, useRef } from "react";

import { SplitTime as SplitTimeType } from "~/routes/_index";
import { convertMsToTime } from "~/utils";

import { Button } from "./Button";

export interface SplitTimeProps {
  splits: SplitTimeType[];
}

export const SplitTime: FC<SplitTimeProps> = ({ splits }) => {
  const tableRef = useRef<HTMLTableElement>(null);
  return (
    <div className="flex flex-col gap-8">
      <div className="overflow-x-scroll">
        <table ref={tableRef}>
          <thead>
            <tr>
              <th className="text-left">#</th>
              {splits[0].stage.map((stage) => (
                <th key={stage.id} className="text-left">
                  Stage {stage.id}
                </th>
              ))}
              <th className="text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {splits.map((split) => (
              <tr key={split.runner} className="odd:bg-slate-200">
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

      <div className="flex gap-8 mb-6">
        <Button
          onClick={() => {
            if (tableRef.current) {
              const text = tableRef.current.innerText;
              navigator.clipboard.writeText(text);
            }
          }}
        >
          Copy Results
        </Button>
        <Link
          to="/"
          className="px-12 bg-slate-800 text-white p-2 rounded-md text-center"
        >
          Home
        </Link>
      </div>
    </div>
  );
};
