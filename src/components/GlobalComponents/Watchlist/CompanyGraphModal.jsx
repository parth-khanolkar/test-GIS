"use client"

import React, { useEffect,useState } from 'react'
import ReactModal from 'react-modal';
import {
    CartesianGrid,
    ComposedChart,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Line,
    Legend,
    Tooltip,
  } from "recharts";
  import moment from "moment";
import { useWatchlistContext } from '@/context/WatchlistContext';
import axios from 'axios';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import Link from 'next/link';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Customize the tooltip content here based on your needs
      return (
        <div className="bg-white bg-opacity-90 text-xs  p-3 rounded-md flex-col">
          <p className="font-bold">{`${moment(label).format('MMM D, YYYY')}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`}>
              <span style={{ color: entry.color }}>{entry.name}</span>
              {`: ${Number(entry.value).toLocaleString("en-IN")}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

const CompanyGraphModal = ({ isOpen,closeModal,fincode,companyName }) => {
    const { companyGraphModalRef } = useWatchlistContext();

    const [isMobile, setIsMobile] = useState(false); // Track mobile state
    const [graph, setGraph] = useState([]); 
    const [compData,setCompData] = useState(null);

    const [topOption,setTopOption] = useState("Chart");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth <= 768);
        }
    }, []);

    const fetchData1 = async () => {
      try {
        const response = await axios.post('https://transcriptanalyser.com/goindiastock/new_basicinfo',
          {
            fincode: fincode.toString(),
            mode: '',
            exchange: '',
          },
        );
    
        setCompData(response.data?.data);
        setGraph(response.data?.graph);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

      useEffect(()=>{
        if(fincode !==0 ){
            fetchData1()
        }
      },[fincode])


    const getModalStyle = () => {
        return {
            content: {
                height: isMobile ? '60%' : '60%',
                maxHeight: isMobile ? '80%' : '60%',
                width: isMobile ? '80%' : '50%',
                maxWidth: isMobile ? '90%' : '50%',
                margin: 'auto',
            },
            overlay: {
              position: 'fixed',
              top: 0,
              left: isMobile ? 0:-400,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              zIndex: 9999,
            },
        };
    };

    
  return (
    <>
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Company Graph"
            style={getModalStyle()}
            ref={companyGraphModalRef}
        >
          <>
            <div className='w-full flex justify-end pb-3 md:py-1'>
              <button className=''
                onClick={()=>{closeModal()}}
              >
                <AiOutlineCloseCircle />
              </button>
            </div>
            <div className='w-full grid grid-cols-2 gap-2'>
              <button className={`p-1 md:p-1.5 flex items-center justify-center font-semibold rounded-md border border-black text-xs md:text-lg
                ${
                  topOption === "Chart" ? ("bg-cyan-900 text-white"):("")
                }
              `}
                onClick={()=>{setTopOption("Chart")}}
              >
                CHART
              </button>
              <button className={`p-1 md:p-1.5 flex items-center justify-center font-semibold rounded-md border border-black text-xs md:text-lg
                ${
                  topOption === "AdvancedChart" ? ("bg-cyan-900 text-white"):("")
                }
              `}
                onClick={()=>{setTopOption("AdvancedChart")}}
              >
                ADVANCED CHART
              </button>
            </div>
            {
              topOption === "Chart" ? (<>
              <Link href={`/companyinfo/${fincode}`} className='w-full flex flex-row items-center justify-center text-lg mt-2 text-cyan-900 hover:text-cyan-950 underline underline-offset-2'>
                {companyName}
              </Link>
                <div className="overflow-x-auto mt-3 md:mt-8 flex items-center justify-center">
                  <ResponsiveContainer
                  width="99%"
                  height={207}
                  >
                    <LineChart
                      data={graph?.map((d) => ({ ...d, price: +d.price }))}
                      margin={{ top: 0, bottom: 20, left: -25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey={"Date"}
                        tickFormatter={(Date) => moment(Date).format("MMM YY")}
                        angle={-45}
                        textAnchor="end"
                        tick={{ fontWeight: "bold", fontSize: isMobile ? 9 : 12  }}
                      />
                      <YAxis
                        yAxisId="left-axis"
                        tick={{ fontWeight: "bold", fontSize: isMobile ? 9 : 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      {/* <Legend /> */}
                      <Line
                        type="monotone"
                        dataKey="price"
                        yAxisId="left-axis"
                        stroke="#6bac84"
                        dot={false}
                        name="Price"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>):(<>
                <iframe className='w-full h-5/6' src={`https://s.tradingview.com/widgetembed/?symbol=BSE%3A${compData.NSECode.value}&interval=W&allow_symbol_change=1&save_image=1&studies=[]&theme=light&style=1&timezone=Etc%2FUTC&utm_source=goindiastocks.com&utm_medium=widget&utm_campaign=chart&utm_term=BSE%3A${compData.NSECode.value}&page-uri=goindiastocks.com%2FGIA%2FstockDashboard%3FFincode%3D${fincode}`} frameborder="0"></iframe>
              </>)
            }
          
          </>
        </ReactModal>
    </>
  )
}

export default CompanyGraphModal
