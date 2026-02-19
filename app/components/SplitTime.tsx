import { Link } from "@remix-run/react";
import { FC, useMemo, useRef, useState } from "react";

import { RunnerSplitTime } from "~/types";
import { convertMsToTime } from "~/utils";

import { Button } from "./Button";

export interface SplitTimeProps {
  splits: RunnerSplitTime[];
}

type SortMode = "runner" | "position";

export const SplitTime: FC<SplitTimeProps> = ({ splits }) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const [sortMode, setSortMode] = useState<SortMode>("runner");

  const sortedSplits = useMemo(() => {
    if (sortMode === "position") {
      return [...splits].sort((a, b) => {
        const totalA = a.stage.reduce((acc, s) => acc + s.time, 0);
        const totalB = b.stage.reduce((acc, s) => acc + s.time, 0);
        if (totalA === 0 && totalB === 0) return a.runner - b.runner;
        if (totalA === 0) return 1;
        if (totalB === 0) return -1;
        return totalA - totalB;
      });
    }
    return splits;
  }, [splits, sortMode]);

  if (!splits.length) return <p className="text-gray-500">No split data.</p>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Sort by:</span>
        <div className="flex rounded-md overflow-hidden border border-gray-300 text-sm">
          <button
            type="button"
            onClick={() => setSortMode("runner")}
            className={`px-3 py-1 transition-colors ${
              sortMode === "runner"
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Bib #
          </button>
          <button
            type="button"
            onClick={() => setSortMode("position")}
            className={`px-3 py-1 transition-colors ${
              sortMode === "position"
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Position
          </button>
        </div>
      </div>

      <div className="overflow-x-scroll">
        <table ref={tableRef}>
          <thead>
            <tr>
                {sortMode === "position" ? (
                  <th className="text-left px-1">Pos</th>
                ) : null}
                <th className="text-left">Bib #</th>
              {splits[0].stage.map((stage) => (
                <th key={stage.id} className="text-left">
                  Stage {stage.id}
                </th>
              ))}
              <th className="text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {sortedSplits.map((split, index) => (
              <tr key={split.runner} className="odd:bg-slate-200">
                {sortMode === "position" ? (
                  <td className="px-1 font-bold">{index + 1}</td>
                ) : null}
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
