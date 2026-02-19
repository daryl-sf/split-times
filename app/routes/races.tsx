import { isRouteErrorResponse, Link, useRouteError } from "@remix-run/react";
import localforage from "localforage";
import { useEffect, useState } from "react";

import { Button } from "~/components/Button";
import { RaceInfo, RunnerSplitTime } from "~/types";

interface RaceEntry {
  key: string;
  name?: string;
  date: Date;
}

export default function Races() {
  const [races, setRaces] = useState<RaceEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRaces = async () => {
      const keys = await localforage.keys();
      const entries: RaceEntry[] = await Promise.all(
        keys.map(async (key) => {
          const data = await localforage.getItem<{
            splitTimes: RunnerSplitTime[];
            raceInfo: RaceInfo;
          }>(key);
          return {
            key,
            name: data?.raceInfo?.raceName,
            date: new Date(parseInt(key, 10)),
          };
        }),
      );
      setRaces(entries);
      setLoading(false);
    };
    loadRaces();
  }, []);

  const handleDelete = async (key: string) => {
    await localforage.removeItem(key);
    setRaces((prev) => prev.filter((r) => r.key !== key));
  };

  return (
    <div className="p-6 flex flex-col gap-8">
      <Link
        to="/"
        className="px-12 bg-slate-800 text-white p-2 rounded-md text-center"
      >
        Home
      </Link>
      <h2 className="font-bold text-lg">Past Races</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : races.length === 0 ? (
        <p className="text-gray-500">No past races found.</p>
      ) : (
        races
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .map((race) => (
            <div key={race.key} className="flex justify-between items-center">
              <Link to={`/race/${race.key}`} className="underline">
                <span>{race.name || race.date.toLocaleDateString()}</span>
                <span className="text-gray-500 text-sm ml-2">
                  {race.name
                    ? race.date.toLocaleDateString()
                    : race.date.toLocaleTimeString()}
                </span>
              </Link>
              <Button
                variant="warn"
                onClick={() => {
                  if (window.confirm("Delete this race? This cannot be undone.")) {
                    handleDelete(race.key);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          ))
      )}
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        {isRouteErrorResponse(error)
          ? `${error.status} ${error.statusText}`
          : "Something went wrong"}
      </h1>
      <p className="text-gray-600 mb-6">
        Could not load past races. Please try again.
      </p>
      <a href="/" className="px-6 bg-slate-800 text-white p-2 rounded-md">
        Go Home
      </a>
    </div>
  );
}
