// pages/tradingview.js
import React, { useEffect } from 'react';

const TradingViewPage = () => {
    
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js';
    script.async = true;
    script.innerHTML = `
      {
        "width": "100%",
        "height": "100%",
        "symbolsGroups": [
            {
                "name": "Indices",
                "originalName": "Indices",
                "symbols": [
                    {
                        "name": "FOREXCOM:SPXUSD",
                        "displayName": "S&P 500"
                    },
                    {
                        "name": "FOREXCOM:NSXUSD",
                        "displayName": "Nasdaq 100"
                    },
                    {
                        "name": "FOREXCOM:DJI",
                        "displayName": "Dow 30"
                    },
                    {
                        "name": "INDEX:NKY",
                        "displayName": "Nikkei 225"
                    },
                    {
                        "name": "INDEX:DEU30",
                        "displayName": "DAX Index"
                    },
                    {
                        "name": "FOREXCOM:UKXGBP",
                        "displayName": "FTSE 100"
                    }
                ]
            },
            {
                "name": "Commodities",
                "originalName": "Commodities",
                "symbols": [
                    {
                        "name": "CME_MINI:ES1!",
                        "displayName": "E-Mini S&P"
                    },
                    {
                        "name": "CME:6E1!",
                        "displayName": "Euro"
                    },
                    {
                        "name": "COMEX:GC1!",
                        "displayName": "Gold"
                    },
                    {
                        "name": "NYMEX:CL1!",
                        "displayName": "Crude Oil"
                    },
                    {
                        "name": "NYMEX:NG1!",
                        "displayName": "Natural Gas"
                    },
                    {
                        "name": "CBOT:ZC1!",
                        "displayName": "Corn"
                    }
                ]
            },
            {
                "name": "Bonds",
                "originalName": "Bonds",
                "symbols": [
                    {
                        "name": "CME:GE1!",
                        "displayName": "Eurodollar"
                    },
                    {
                        "name": "CBOT:ZB1!",
                        "displayName": "T-Bond"
                    },
                    {
                        "name": "CBOT:UB1!",
                        "displayName": "Ultra T-Bond"
                    },
                    {
                        "name": "EUREX:FGBL1!",
                        "displayName": "Euro Bund"
                    },
                    {
                        "name": "EUREX:FBTP1!",
                        "displayName": "Euro BTP"
                    },
                    {
                        "name": "EUREX:FGBM1!",
                        "displayName": "Euro BOBL"
                    }
                ]
            },
            {
                "name": "Forex",
                "originalName": "Forex",
                "symbols": [
                    {
                        "name": "FX:EURUSD"
                    },
                    {
                        "name": "FX:GBPUSD"
                    },
                    {
                        "name": "FX:USDJPY"
                    },
                    {
                        "name": "FX:USDCHF"
                    },
                    {
                        "name": "FX:AUDUSD"
                    },
                    {
                        "name": "FX:USDCAD"
                    }
                ]
            }
        ],

        "colorTheme": "light",
        "isTransparent": false,
        "locale": "in"
      }
    `;
    document.querySelector('.tradingview-widget-container__widget').appendChild(script);

    // return () => {
    //   // Clean up the script by removing the entire container
    //   const container = document.querySelector('.tradingview-widget-container');
    //   container.parentNode.removeChild(container);
    // };
  }, []);

  const containerStyle = {
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    height: 'calc(100vh - 80px)',
  };

  const widgetStyle = {
    height: '100%',
    width: '100%',
  };

  return (
    //<div className="container mx-auto mt-8">
    <div className="tradingview-widget-container" style={containerStyle}>
    <div className="tradingview-widget-container__widget" style={widgetStyle}></div>
  </div>
    //</div>
  );
};

export default TradingViewPage;
