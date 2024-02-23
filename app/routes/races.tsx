import { Link } from "@remix-run/react";
import localforage from "localforage";
import { useEffect, useState } from "react";

import { Button } from "~/components/Button";

export default function Races() {
  const [races, setRaces] = useState<string[]>([]);

  useEffect(() => {
    localforage.keys().then(setRaces);
  }, []);

  const handleDelete = async (id: string) => {
    await localforage.removeItem(id);
    const keys = await localforage.keys();
    setRaces(keys);
  };

  return (
    <div className="p-6 flex flex-col gap-8">
      <Link
        to="/"
        className="px-12 bg-slate-800 text-white p-2 rounded-md text-center"
      >
        Home
      </Link>
      Past Races:
      {races.map((race) => {
        const date = new Date(parseInt(race.split("-")[1], 10));
        return (
          <div key={race} className="flex justify-between">
            <Link to={`/race/${race}`} className="underline">
              Race - {date.toLocaleDateString()}
            </Link>
            <Button variant="warn" onClick={() => handleDelete(race)}>
              Delete
            </Button>
          </div>
        );
      })}
    </div>
  );
}
