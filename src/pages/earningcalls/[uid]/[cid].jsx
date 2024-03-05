import EarningsWidgetsPage from "@/components/EarningsWidgetsPage/EarningsWidgetsPage";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Widgets = () => {
  const router = useRouter();
  const { uid, cid } = router.query;

  return (
    <div className="bg-[#153a64] flex h-full w-full">
      <EarningsWidgetsPage uid={uid} cid={cid} />
    </div>
  );
};

export default Widgets;

Widgets.requireAuth = true;