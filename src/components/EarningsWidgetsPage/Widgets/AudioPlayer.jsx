import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { BiVolumeFull, BiVolumeMute } from "react-icons/bi";
import {
  MdReplay10,
  MdOutlinePlayCircleFilled,
  MdForward10,
  MdOutlinePauseCircleFilled,
} from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import styles from "../../../styles/AudioPlayer.module.css";
import { useEarningsContext } from "@/context/Context";
const AudioPlayer = ({ audio }) => {
  const { selectedCompanyName, calendarIdContext } = useEarningsContext();
  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [mute, setMute] = useState(false);
  const [audioLink, setAudioLink] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setAudioLink(audio);
  }, [audio]);

  // references
  const audioPlayer = useRef(); // reference our audio component
  const progressBar = useRef(); // reference our progress bar
  const animationRef = useRef(); // reference the animation

  useEffect(() => {
    const seconds = Math.floor(audioPlayer?.current?.duration); //as all earning calls dont have audio link thats why "?" is used.
    setDuration(Math.floor(audioPlayer?.current?.duration));
    progressBar.current.max = seconds;
    // console.log("seconds" + seconds);
  }, [
    audioPlayer?.current?.loadedmetadata,
    audioPlayer?.current?.readyState,
    loaded,
  ]);

  useEffect(() => {
    audioPlayer.current.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    audioPlayer.current.muted = mute;
  }, [mute]);
  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  // Play and Pause
  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Decrease Playback Rate
  const decreaseRate = () => {
    if (speed <= 0.1) {
      setSpeed(0.1);
    } else {
      const newSpeed = speed - 0.1;
      setSpeed(Number(newSpeed.toFixed(1)));
    }
  };
  // Increase Playback Rate
  const increaseRate = () => {
    if (speed >= 2) {
      setSpeed(2);
    } else {
      const newSpeed = speed + 0.1;
      setSpeed(Number(newSpeed.toFixed(1)));
    }
  };

  const whilePlaying = () => {
    progressBar.current.value = audioPlayer?.current?.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar?.current?.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  };

  // Ten seconds backward
  const backTen = () => {
    progressBar.current.value = Number(progressBar.current.value) - 10;
    changeRange();
  };
  // Ten second forward
  const forwardTen = () => {
    progressBar.current.value = Number(progressBar.current.value) + 10;
    changeRange();
  };
  return (
    <div className="w-screen relative text-white">
      {/* Audio Player */}
      <audio
        key={audioLink}
        className="absolute top-0"
        ref={audioPlayer}
        preload="metadata"
        onLoadedMetadata={() => setLoaded(true)}
      >
        <source src={audioLink} />
      </audio>
      {/* Progress Bar */}
      <div className="relative w-screen">
        <input
          type="range"
          className={styles.progressBar}
          defaultValue="0"
          ref={progressBar}
          onChange={changeRange}
        />
      </div>
      {/* Controls */}
      <div className="bg-[#091e37] h-full pb-2">
        {/*Duration Time Stamps */}
        <div className="flex justify-between font-semibold">
          <p>{calculateTime(currentTime)}</p>
          <p>{duration && !isNaN(duration) && calculateTime(duration)}</p>
        </div>
        {/* Buttons */}
        <div className="px-5 flex items-center">
          {/* Name */}
          <div className="text-xs sm:text-xl font-semibold flex-1">
            <p>{selectedCompanyName}</p>
          </div>
          {/* Play, Pause and 5min forward backward*/}
          <div className="flex gap-2 sm:gap-5 text-3xl sm:text-4xl justify-center flex-1">
            {/* back 10 seconds */}
            {isNaN(duration) ? (
              <MdReplay10 className="text-gray-500" />
            ) : (
              <MdReplay10 onClick={backTen} className="cursor-pointer" />
            )}
            {/* Play and Pause */}
            {!loaded && audioLink == null ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : isNaN(duration) ? (
              <div>
                <MdOutlinePlayCircleFilled className="text-gray-500" />
              </div>
            ) : isPlaying ? (
              <button onClick={togglePlayPause}>
                <MdOutlinePauseCircleFilled />
              </button>
            ) : (
              <button onClick={togglePlayPause}>
                <MdOutlinePlayCircleFilled />
              </button>
            )}
            {/* Forward 10 seconds */}
            {isNaN(duration) ? (
              <MdForward10 className="text-gray-500" />
            ) : (
              <MdForward10 onClick={forwardTen} className="cursor-pointer" />
            )}
          </div>
          {/* Volume and Playback rate */}
          <div
            className={`${
              isNaN(duration) ? "text-gray-500" : "text-white"
            } flex gap-2 sm:gap-5 text-xl sm:text-2xl justify-end flex-1 items-center`}
          >
            {isNaN(duration) ? (
              <BiVolumeFull className="text-gray-500" />
            ) : !mute ? (
              <BiVolumeFull
                className="cursor-pointer"
                onClick={() => setMute(!mute)}
              />
            ) : (
              <BiVolumeMute
                className="cursor-pointer"
                onClick={() => setMute(!mute)}
              />
            )}
            <div className="flex justify-center items-center gap-1">
              {isNaN(duration) ? (
                <button className="text-xl text-gray-500 font-bold">-</button>
              ) : (
                <button className="text-xl font-bold" onClick={decreaseRate}>
                  -
                </button>
              )}
              <button
                className={`flex justify-center px-3 ${
                  isNaN(duration) ? "bg-gray-500" : "bg-white"
                } text-black text-xs sm:text-lg font-bold rounded-lg w-[50px]`}
              >
                {speed}x
              </button>
              {isNaN(duration) ? (
                <button className="text-xl font-bold text-gray-500">+</button>
              ) : (
                <button className="text-xl font-bold" onClick={increaseRate}>
                  +
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
