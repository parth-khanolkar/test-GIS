import React, { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useEarningsContext } from "@/context/Context";

const Slider = ({ min, max, onChange }) => {
  const { setMinValContext, setMaxValContext, minValContext, maxValContext } =
    useEarningsContext();
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(minVal);
  const maxValRef = useRef(maxVal);
  const range = useRef(null);

  useEffect(() => {
    // if (minValContext == min) {
    setMinVal(minValContext);
    // }
    // if (maxValContext == max) {
    setMaxVal(maxValContext);
  }, [minValContext, maxValContext]);

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
    <div className="">
      <input
        type="range"
        min={min}
        max={max}
        onMouseUp={() => setMinValContext(minVal)}
        onTouchEnd={() => setMinValContext(minVal)}
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
        onMouseUp={() => setMaxValContext(maxVal)}
        onTouchEnd={() => setMaxValContext(maxVal)}
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
        <div className="flex justify-between pt-4">
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
              style={{ zIndex: minValContext > max - 100 && "5" }}
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
        </div>
      </div>
    </div>
  );
};

Slider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Slider;
