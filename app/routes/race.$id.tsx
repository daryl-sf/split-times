import { useLoaderData } from "@remix-run/react";
import localforage from "localforage";
import { useEffect, useState } from "react";

import { SplitTime } from "~/components/SplitTime";

import { SplitTime as STType } from "./_index";

export const loader = async ({ params }: { params: { id: string } }) => {
  return { id: params.id };
};

export default function Race() {
  const { id } = useLoaderData<{ id: string }>();
  const [splitTimes, setSplitTimes] = useState<STType[] | undefined>();
  useEffect(() => {
    const getSplits = async () => {
      const data = await localforage.getItem<STType[]>(id);
      console.log(data, id, localforage);
      if (data) {
        setSplitTimes(data);
      }
    };
    getSplits();
  }, [id]);
  return (
    <div>
      <h1>
        Race - {new Date(parseInt(id.split("-")[1], 10)).toLocaleDateString()}
      </h1>
      {splitTimes ? <SplitTime splits={splitTimes} /> : null}
    </div>
  );
}
