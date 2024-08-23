import { useEffect, useState } from "react";
import "./Test.css";

const Test = () => {
  const [count, setCount] = useState(0);
  const [audioFiles, setAudioFiles] = useState({
    hour: null,
    halfHour: null,
    tenMin: null,
  });
  useEffect(() => {
    const hourAudio = new Audio("/alert/1hour.mp3");
    const halfHourAudio = new Audio("/alert/30min.mp3");
    const tenMinAudio = new Audio("/alert/10min.mp3");

    const handleCanPlayThrough = () => {
      setAudioFiles({
        hour: hourAudio,
        halfHour: halfHourAudio,
        tenMin: tenMinAudio,
      });
    };

    hourAudio.addEventListener("canplaythrough", handleCanPlayThrough);
    halfHourAudio.addEventListener("canplaythrough", handleCanPlayThrough);
    tenMinAudio.addEventListener("canplaythrough", handleCanPlayThrough);

    return () => {
      hourAudio.removeEventListener("canplaythrough", handleCanPlayThrough);
      halfHourAudio.removeEventListener("canplaythrough", handleCanPlayThrough);
      tenMinAudio.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, []);

  const playSound = key => {
    console.log(key, "재생");
    if (audioFiles[key]) {
      audioFiles[key].currentTime = 0;
      audioFiles[key].play();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 10000); // 10초마다 실행

    return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 인터벌 정리
  }, []);

  useEffect(() => {
    if (count % 2 === 0) {
      playSound("hour");
    } else {
      playSound("halfHour");
    }
    //eslint-disable-next-line
  }, [count]);

  return <>{count}</>;
};

export default Test;
