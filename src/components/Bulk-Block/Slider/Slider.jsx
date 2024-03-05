import React, { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useBulkBlockContext } from "@/context/BulkBlockContext";

const Slider = ({ min, max, onChange }) => {
  const { minMCapVal, setMinMCapVal,maxMCapVal, setMaxMCapVal } = useBulkBlockContext();

  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(minVal);
  const maxValRef = useRef(maxVal);
  const range = useRef(null);

  useEffect(() => {
    if (minMCapVal == min) {
      setMinVal(min);
    }
    if (maxMCapVal == max) {
      setMaxVal(max);
    }
  }, [minMCapVal, maxMCapVal]);

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
    <div className="flex gap-2 items-center text-white text-xs md:text-base px-1">
      {/* Min Value */}
      <div>{minVal}</div>

      {/* Slider */}
      <div className="">
        <input
          type="range"
          min={min}
          max={max}
          onMouseUp={() => setMinMCapVal(minVal)}
          onTouchEnd={() => setMinMCapVal(minVal)}
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
          onMouseUp={() => setMaxMCapVal(maxVal)}
          onTouchEnd={() => setMaxMCapVal(maxVal)}
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
          
        </div>
      </div>

      {/* Max Value */}
      <div>{maxVal}</div>
    </div>
  );
};

Slider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Slider;
