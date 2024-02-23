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
    <div className="h-screen w-screen bg-white fixed overflow-scroll top-0 p-3 z-50">
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
