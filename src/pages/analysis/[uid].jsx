import Analysis from "@/components/Analysis/Analysis";
import { useInfoContext } from "@/context/info";
import { useRouter } from "next/router";
import React from "react";

const CalendarIndex = () => {
  const router = useRouter();
  const { uid } = router.query;
  return (
    <div className={`bg-white p-2 flex justify-center h-[calc(100vh-55px)]`}>
      <Analysis uid={uid} />
    </div>
  );
};

export default CalendarIndex;

CalendarIndex.requireAuth = true;
