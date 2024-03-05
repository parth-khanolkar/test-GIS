import Calendar from "@/components/CalendarComps/Calendar";
import { useInfoContext } from "@/context/info";
import { useRouter } from "next/router";
import React from "react";

const CalendarIndex = () => {
  const router = useRouter();
  const { uid } = router.query;
  const { whatsapp, setWhatsapp } = useInfoContext();
  return (
    <div className={`bg-white p-2 flex justify-center h-[calc(100vh-83px)]`}>
      <Calendar uid={uid} />
    </div>
  );
};

export default CalendarIndex;

CalendarIndex.requireAuth = true;