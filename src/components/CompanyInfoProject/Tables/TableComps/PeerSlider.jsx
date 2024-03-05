import React, { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useInfoContext } from "@/context/info";

const PeerSlider = ({ min, max, onChange }) => {
  const { minPeerVal, setMinPeerVal, maxPeerVal, setMaxPeerVal } =
    useInfoContext();
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(minVal);
  const maxValRef = useRef(maxVal);
  const range = useRef(null);

  useEffect(() => {
    if (minPeerVal == min) {
      setMinVal(min);
    }
    if (maxPeerVal == max) {
      setMaxVal(max);
    }
  }, [minPeerVal, maxPeerVal]);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <div className="flex gap-2 items-center text-black text-sm font-bold">
      {/* Min Value */}
      <input
        type="number"
        value={minPeerVal}
        onChange={(e) => {
          e.target.value <= max && e.target.value >= min
            ? setMinPeerVal(e.target.value)
            : (e.target.value > max || e.target.value < min) &&
              setMaxPeerVal(max);
          const value = Math.min(Number(minPeerVal), maxVal - 1);
          setMinVal(value);
          minValRef.current = value;
        }}
        className="w-[100px] rounded-md outline-none px-1"
        placeholder="Min"
        min={min}
        max={max}
      />
      {/* <div>{minVal}</div> */}

      {/* Slider */}
      <div className="">
        <input
          type="range"
          min={min}
          max={max}
          onMouseUp={() => setMinPeerVal(minVal)}
          onTouchEnd={() => setMinPeerVal(minVal)}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - 1);
            setMinVal(value);
            minValRef.current = value;
          }}
          className="thumb thumb--left"
          style={{ zIndex: minVal > max - 100 && "5" }}
        />
        <input
          type="range"
          min={min}
          max={max}
          onMouseUp={() => setMaxPeerVal(maxVal)}
          onTouchEnd={() => setMaxPeerVal(maxVal)}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 1);
            setMaxVal(value);
            maxValRef.current = value;
          }}
          className="thumb thumb--right"
        />

        <div className="slider">
          <div className="slider__track" />
          <div ref={range} className="slider__range" />
          {/* <div className="flex w-full justify-between pt-4">
          <div>
            <input
              type="text"
              defaultValue={min}
              value={minVal}
              className="text-black rounded-sm text-sm font-semibold w-10 outline-none disabled:bg-white"
              onChange={(event) => {
                const value = Math.min(Number(event.target.value), maxVal - 1);
                setMinVal(value);
                minValRef.current = value;
              }}
              style={{ zIndex: minPeerVal > max - 100 && "5" }}
              disabled
            />
            <span className="text-white pl-1">%</span>
          </div>
          <div>
            <input
              type="text"
              defaultValue={max}
              value={maxVal}
              min={min}
              max={max}
              className="text-black rounded-sm text-sm font-semibold w-10 outline-none disabled:bg-white"
              onEmptied={() => setMaxVal(max)}
              onChange={(event) => {
                const value = Math.max(Number(event.target.value), minVal + 1);
                setMaxVal(value);
                maxValRef.current = value;
              }}
              disabled
            />
            <span className="text-white pl-1">%</span>
          </div>
        </div> */}
        </div>
      </div>

      {/* Max Value */}
      <input
        type="number"
        value={maxPeerVal}
        onChange={(e) => {
          e.target.value <= max && e.target.value >= min
            ? setMaxPeerVal(e.target.value)
            : (e.target.value > max || e.target.value < min) &&
              setMaxPeerVal(max);

          const value = Math.max(Number(maxPeerVal), minVal + 1);
          setMaxVal(value);
          maxValRef.current = value;
        }}
        className="w-[100px] rounded-md outline-none px-1"
        placeholder="Max"
        min={min}
        max={max}
      />
      {/* <div>{maxVal}</div> */}
    </div>
  );
};

PeerSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PeerSlider;
