import { signOut } from "firebase/auth";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { clearUser } from "../../Reducer/userSlice";

function Koreatm() {
  const navi = useNavigate();
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user.uid === "") {
      navi("/");
    } else if (user.name === "펄스맥") {
      let confirm = window.confirm(
        "이 페이지는 코리아티엠 전용 페이지입니다.\n펄스맥 페이지로 이동하시겠습니까?"
      );
      if (confirm) {
        navi("/pearl");
      } else {
        signOut(auth);
        dispatch(clearUser());
        alert("다시 로그인 해 주세요");
        navi("/");
      }
    }
    //eslint-disable-next-line
  }, [user]);
  return (
    <>
      <Outlet />
    </>
  );
}

export default Koreatm;
