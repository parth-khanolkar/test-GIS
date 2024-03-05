import { useInfoContext } from "@/context/info";
import React from "react";

const TechnicalAnalysisCharts = () => {
  const { fincode, setFincode, initData, setInitData } = useInfoContext();

  return (
    <>
      {initData ? (
        <>
          <div className="w-full grid grid-cols-1 md:grid-cols-10 gap-2 lg:gap-5 h-[80vh] md:h-[50vh] lg:h-[60vh] p-1.5">
            <div className="col-span-1 md:col-span-4 lg:col-span-3 flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src={`https://www.tradingview-widget.com/embed-widget/technical-analysis/?interval=1W&width=100%25&isTransparent=false&height=100%25&symbol=BSE%3A${initData.Bse_scrip_id.value}&showIntervalTabs=true&colorTheme=light&utm_source=www.goindiastocks.com&utm_medium=widget&utm_campaign=technical-analysis&page-uri=www.goindiastocks.com%2FGIA%2FstockDashboard%3FFincode%3D${fincode}`}
                frameborder="0"
              ></iframe>
            </div>
            <div className="col-span-1 md:col-span-6 lg:col-span-7 flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src={`https://s.tradingview.com/widgetembed/?symbol=BSE%3A${initData.Bse_scrip_id.value}&interval=W&allow_symbol_change=1&save_image=1&studies=[]&theme=light&style=1&timezone=Etc%2FUTC&utm_source=goindiastocks.com&utm_medium=widget&utm_campaign=chart&utm_term=BSE%3A${initData.Bse_scrip_id.value}&page-uri=goindiastocks.com%2FGIA%2FstockDashboard%3FFincode%3D${fincode}`}
                frameborder="0"
              ></iframe>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default TechnicalAnalysisCharts;
