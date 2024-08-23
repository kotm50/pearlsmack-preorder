import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, clearUser } from "./Reducer/userSlice";
import { db, auth } from "./firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import Main from "./Component/Main";
import AdminRegist from "./Component/AdminRegist";
import AdminLogin from "./Component/AdminLogin";
import Header from "./Component/Layout/Header";
import Koreatm from "./Component/Koreatm/Koreatm";
import TmMain from "./Component/Koreatm/TmMain";
import Pearlsmack from "./Component/Pearlsmack/Pearlsmack";
import Generator from "./Component/Koreatm/Generator";
import PearlMain from "./Component/Pearlsmack/PearlMain";
import Menu from "./Component/Pearlsmack/Menu";
import GenComplete from "./Component/Koreatm/GenComplete";
import OrderDetail from "./Component/OrderDetail";
import KotiOrderList from "./Component/Koreatm/OrderList";
import PearlOrderList from "./Component/Pearlsmack/OrderList";
import Test from "./Component/Test";
import OrderComplete from "./Component/Koreatm/OrderComplete";
import Alert from "./Component/Alert";

function App() {
  const thisLocation = useLocation();
  const [title, setTitle] = useState("코리아티엠 방문예약 주문서");
  const [start, setStart] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    // 소리 없는 오디오 생성
    const silentAudio = new Audio("/alert/silent.mp3");
    silentAudio.loop = true; // 무한 반복
    setAudio(silentAudio);
  }, []);

  const handleUserInteraction = () => {
    if (audio) {
      // 사용자가 클릭하면 소리 없는 오디오를 재생
      audio.play().catch(error => {
        console.error("Silent audio playback failed:", error);
      });
    }
    setStart(true);
  };
  const [loginChk, setLoginChk] = useState(false);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!loginChk) {
      onAuthStateChanged(auth, user => {
        if (user !== null) {
          getAdmin(user);
        } else {
          dispatch(clearUser());
        }
      });
      setLoginChk(true);
    }
    // eslint-disable-next-line
  }, [dispatch, loginChk]);

  useEffect(() => {
    let path = thisLocation.pathname;
    let pathsplit = path.split("/");
    if (path !== "/") {
      if (pathsplit[1] === "koti") {
        setTitle("코리아티엠 방문예약 주문서");
        if (pathsplit[2] === "ordergen") {
          setTitle("방문예약 주문서 생성하기");
        }
      }
    } else {
      setTitle("코리아티엠 방문예약 주문서");
    }
  }, [thisLocation]);

  const getAdmin = async user => {
    if (user.displayName !== "admin") {
      if (user.uid !== "") {
        let applyRef = collection(db, "apply");
        let result = await getDoc(doc(applyRef, `${user.uid}`));
        console.log("결과", result.data());
        if (!result.data()) {
          dispatch(
            loginUser({
              uid: user.uid,
              accessToken: user.accessToken,
              admin: false,
              name: "",
              point: 0,
              phone: "",
            })
          );
        } else {
          dispatch(
            loginUser({
              uid: user.uid,
              accessToken: user.accessToken,
              admin: false,
              name: result.data().name,
              point: result.data().point,
              phone: result.data().phone,
            })
          );
        }
      }
    } else {
      if (user.uid !== "") {
        let applyRef = collection(db, "admin");
        let result = await getDoc(doc(applyRef, `${user.uid}`));
        dispatch(
          loginUser({
            uid: user.uid,
            accessToken: user.accessToken,
            admin: true,
            name: result.data().name,
            point: 0,
            phone: 0,
          })
        );
      }
    }
  };
  return (
    <div className="w-[97%] max-w-[1000px] mx-auto text-base lg:text-lg font-neo">
      {user.name === "펄스맥" ? (
        <>
          {start ? (
            <Alert user={user} />
          ) : (
            <div className="fixed bottom-[50px] left-1/2 -translate-x-1/2 text-center">
              <button
                className="w-full max-w-[90%] mx-auto bg-gray-100 p-2"
                onClick={handleUserInteraction}
              >
                영업시작확인
              </button>
              <br />
              알림을 받으려면 영업시작확인 버튼을 눌러주세요
            </div>
          )}
        </>
      ) : null}

      <Header title={title} user={user} />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/regist" element={<AdminRegist />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/koti" element={<Koreatm />}>
          <Route path="" element={<TmMain />} />
          <Route path="ordergen" element={<Generator />} />
          <Route path="gencomplete/:orderid?" element={<GenComplete />} />
          <Route path="orderlist" element={<KotiOrderList />} />
          <Route path="complete" element={<OrderComplete />} />
        </Route>
        <Route path="/pearl" element={<Pearlsmack />}>
          <Route path="" element={<PearlMain />} />
          <Route path="menu" element={<Menu />} />
          <Route path="orderlist" element={<PearlOrderList />} />
        </Route>
        <Route path="/orderdetail/:orderid?" element={<OrderDetail />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </div>
  );
}

export default App;
