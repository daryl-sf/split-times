import { LoaderFunctionArgs } from "@remix-run/node";
import { isRouteErrorResponse, useLoaderData, useRouteError } from "@remix-run/react";
import localforage from "localforage";
import { useEffect, useState } from "react";

import { SplitTime } from "~/components/SplitTime";
import { RaceInfo, RunnerSplitTime, TimeTrialRunner } from "~/types";

interface RaceData {
  splitTimes?: RunnerSplitTime[];
  timeTrialRunners?: TimeTrialRunner[];
  raceInfo: RaceInfo;
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id;
  if (!id) {
    throw new Response("Not Found", { status: 404 });
  }
  return { id: decodeURIComponent(id) };
};

export default function Race() {
  const { id } = useLoaderData<{ id: string }>();
  const [splitTimes, setSplitTimes] = useState<RunnerSplitTime[] | undefined>();
  const [timeTrialRunners, setTimeTrialRunners] = useState<TimeTrialRunner[] | undefined>();
  const [raceInfo, setRaceInfo] = useState<RaceInfo | undefined>();
  useEffect(() => {
    const getSplits = async () => {
      const data = await localforage.getItem<RaceData>(id);

      if (data?.splitTimes) {
        setSplitTimes(data.splitTimes);
      }
      if (data?.timeTrialRunners) {
        setTimeTrialRunners(data.timeTrialRunners);
      }
      if (data?.raceInfo) {
        setRaceInfo(data.raceInfo);
      }
    };
    getSplits();
  }, [id]);

  if (!raceInfo) {
    return (
      <main className="relative min-h-screen p-8 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading race data...</p>
      </main>
    );
  }

  const isTimeTrial = raceInfo.raceType === "timeTrial";

  return (
    <main className="relative min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-8 capitalize">
        {raceInfo.raceName || raceInfo.raceDate}
      </h1>
      {raceInfo.raceName ? (
        <p className="text-center text-gray-500 -mt-6 mb-8">{raceInfo.raceDate}</p>
      ) : null}
      <div className="flex gap-8 mb-8">
        <p>
          <span className="font-bold">Runners:</span> {raceInfo.numberOfRunners}
        </p>
        {!isTimeTrial ? (
          <p>
            <span className="font-bold">Stages:</span> {raceInfo.numberOfStages}
          </p>
        ) : (
          <p>
            <span className="font-bold">Type:</span> Time Trial
          </p>
        )}
      </div>
      {isTimeTrial && timeTrialRunners ? (
        <SplitTime timeTrialRunners={timeTrialRunners} />
      ) : splitTimes ? (
        <SplitTime splits={splitTimes} />
      ) : null}
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <main className="relative min-h-screen p-8 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">
        {isRouteErrorResponse(error)
          ? `${error.status} ${error.statusText}`
          : "Something went wrong"}
      </h1>
      <p className="text-gray-600 mb-6">
        {isRouteErrorResponse(error)
          ? "This race could not be found."
          : "An unexpected error occurred. Please try refreshing the page."}
      </p>
      <a href="/" className="px-6 bg-slate-800 text-white p-2 rounded-md">
        Go Home
      </a>
    </main>
  );
}
