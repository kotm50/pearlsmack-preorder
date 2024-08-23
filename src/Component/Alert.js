import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";

function Alert(props) {
  const thisLocation = useLocation();
  const navi = useNavigate();
  const [orderList, setOrderList] = useState([]);
  const [msg, setMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [audioFiles, setAudioFiles] = useState({
    hour: null,
    halfHour: null,
    tenMin: null,
  });

  useEffect(() => {
    if (props.user.name !== "펄스맥") return;

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
  }, [props.user.name]);

  const playSound = key => {
    console.log(key, "재생");
    if (props.user.name !== "펄스맥") return;
    if (audioFiles[key]) {
      audioFiles[key].currentTime = 0;
      audioFiles[key].play();
    }
  };

  useEffect(() => {
    if (props.user.name !== "펄스맥") return;
    getOrder();
    chkTime();
    //eslint-disable-next-line
  }, [props.user.name]);

  useEffect(() => {
    if (props.user.name !== "펄스맥") return;

    let timer;
    if (alert) {
      timer = setTimeout(() => {
        setAlert(false);
      }, 60000);
    }

    return () => clearTimeout(timer);
  }, [alert, props.user.name]);

  const getOrder = async () => {
    if (props.user.name !== "펄스맥") return;
    setOrderList([]);
    const today = dayjs(new Date()).format("YYYY-MM-DD");
    try {
      const q = query(collection(db, "order"), where("reserve", "==", today));

      const querySnapshot = await getDocs(q);
      const order = [];
      querySnapshot.forEach(doc => {
        order.push({ id: doc.id, ...doc.data() });
      });

      setOrderList(order);
    } catch (e) {
      console.error("Error getting documents: ", e);
    }
  };

  //10분
  useEffect(() => {
    if (props.user.name !== "펄스맥") return;

    const calculateDelay = () => {
      const now = new Date();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();

      const remainingMinutes = 10 - (minutes % 10);
      const delayMinutes = remainingMinutes === 10 ? 0 : remainingMinutes;
      const delay = delayMinutes * 60 * 1000 - seconds * 1000 - milliseconds;

      return delay;
    };

    const initialDelay = calculateDelay();

    const timeoutId = setTimeout(() => {
      chkTime();

      const intervalId = setInterval(() => {
        chkTime();
      }, 10 * 60 * 1000); // 10분 간격

      return () => clearInterval(intervalId);
    }, initialDelay);

    return () => clearTimeout(timeoutId);

    // eslint-disable-next-line
  }, [props.user.name]);

  /*
  //10초
  useEffect(() => {
    if (props.user.name !== "펄스맥") return;
    const calculateDelay = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();

      // 다음 10초 단위까지 남은 전체 밀리초 계산
      const remainingSeconds = 10 - (seconds % 10);
      const delay = remainingSeconds * 1000 - milliseconds;

      return delay;
    };

    // 첫 번째 실행을 위한 딜레이 계산
    const initialDelay = calculateDelay();

    // 첫 번째 타임아웃 설정
    const timeoutId = setTimeout(() => {
      chkTime();

      // 이후 10초마다 실행되는 인터벌 설정
      const intervalId = setInterval(() => {
        chkTime();
      }, 10 * 1000); // 10초 = 10,000ms

      // 컴포넌트 언마운트 시 인터벌 정리를 위해 클로저 사용
      return () => clearInterval(intervalId);
    }, initialDelay);

    // 컴포넌트 언마운트 시 타임아웃 정리
    return () => clearTimeout(timeoutId);

    //eslint-disable-next-line
  }, []);
  */
  const chkTime = () => {
    if (props.user.name !== "펄스맥") return;
    console.log("chk");
    const now = dayjs(new Date()).format("HHmm");
    const hour = [];
    const m30 = [];
    const m10 = [];
    orderList.forEach(order => {
      const diff = Number(order.reserveTime) - Number(now);
      if (Number(order.orderStat) === 1) {
        if (diff === 100) {
          hour.push(order);
        } else if (diff === 30) {
          m30.push(order);
        } else if (diff === 10) {
          m10.push(order);
        }
      }
    });
    console.log("1시간", hour.length);
    console.log("30분", m30.length);
    console.log("10분", m10.length);

    if (m10.length > 0) {
      playSound("tenMin");
      setAlert(true);
      setMsg("예약시간 10분 남았습니다");
      console.log("10분");
      return true;
    } else if (m30.length > 0) {
      playSound("halfHour");
      setAlert(true);
      setMsg("예약시간 30분 남았습니다");
      console.log("30분");
      return true;
    } else if (hour.length > 0) {
      playSound("hour");
      setAlert(true);
      setMsg("예약시간 1시간 남았습니다");
      console.log("1시간");
      return true;
    } else {
      setAlert(false);
      return false;
    }
  };

  const moveList = () => {
    if (props.user.name !== "펄스맥") return;
    if (thisLocation.pathname === "/pearl/orderlist") {
      setAlert(false);
    } else {
      navi("/pearl/orderlist");
    }
  };

  return (
    <>
      {props.user.name === "펄스맥" && alert ? (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white p-2 min-w-[200px] rounded-full"
            onClick={() => moveList()}
          >
            {msg}
          </button>
        </div>
      ) : null}
    </>
  );
}

export default Alert;
