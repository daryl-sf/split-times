import { useLoaderData } from "@remix-run/react";
import localforage from "localforage";
import { useEffect, useState } from "react";

import { SplitTime } from "~/components/SplitTime";

import { RaceInfo, SplitTime as STType } from "./_index";

export const loader = async ({ params }: { params: { id: string } }) => {
  return { id: decodeURIComponent(params.id) };
};

export default function Race() {
  const { id } = useLoaderData<{ id: string }>();
  const [splitTimes, setSplitTimes] = useState<STType[] | undefined>();
  const [raceInfo, setRaceInfo] = useState<RaceInfo | undefined>();
  useEffect(() => {
    const getSplits = async () => {
      const data = await localforage.getItem<{
        splitTimes: STType[];
        raceInfo: RaceInfo;
      }>(id);

      if (data?.splitTimes) {
        setSplitTimes(data.splitTimes);
      }
      if (data?.raceInfo) {
        setRaceInfo(data.raceInfo);
      }
    };
    getSplits();
  }, [id]);

  if (!raceInfo) {
    return null;
  }

  return (
    <main className="relative min-h-screenm-6 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 capitalize">
        {raceInfo?.raceName}
      </h1>
      <div className="flex gap-8 mb-8">
        <p>
          <span className="font-bold">Runners:</span> {raceInfo.numberOfRunners}
        </p>
        <p>
          <span className="font-bold">Stages:</span> {raceInfo.numberOfStages}
        </p>
        <p>
          <span className="font-bold">Date:</span> {raceInfo.raceDate}
        </p>
      </div>
      {splitTimes ? <SplitTime splits={splitTimes} /> : null}
    </main>
  );
}
