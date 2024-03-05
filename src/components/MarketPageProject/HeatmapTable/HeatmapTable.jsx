import React, { useEffect, useState } from "react";
import Select from "react-select";
import Table from "../Table/Table";

const HeatmapTable = () => {
  const [data, setData] = useState(null);
  const [indice, setIndice] = useState(123);

  async function postNewNoteFunc() {
    const res = await fetch(
      `https://transcriptanalyser.com/market/indices_heatmap`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          indecies: indice,
        }),
      }
    );
    const data1 = await res.json();
    setData(data1);
  }

  useEffect(() => {
    postNewNoteFunc();
  }, [indice]);

  return (
    <div className="p-2 bg-white border-[#4577A8] border-[1px] rounded-md shadow-md">
      <div className="text-[25px] text-[#153c65] font-semibold">
        Index Returns
      </div>
      {/* Period Select */}
      <div className="pb-3 w-[200px] ">
        {data && (
          <Select
            className="font-semibold text-sm z-[50]"
            options={data?.indecis_filter}
            placeholder="Indices"
            onChange={(values) => {
              values && setIndice(values.value);
            }}
            defaultValue={data?.Selected}
          />
        )}
      </div>
      <div>
        {data != null && (
          <Table
            columns={data?.data?.data?.column}
            data={data?.data?.data?.value}
          />
        )}
      </div>
    </div>
  );
};

export default HeatmapTable;
