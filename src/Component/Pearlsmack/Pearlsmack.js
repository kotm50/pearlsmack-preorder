import { signOut } from "firebase/auth";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../firebase";
import { clearUser } from "../../Reducer/userSlice";
import { Outlet, useNavigate } from "react-router-dom";

function Pearlsmack() {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navi = useNavigate();
  useEffect(() => {
    if (user.uid === "") {
      navi("/");
    } else if (user.name === "코리아티엠") {
      let confirm = window.confirm(
        "이 페이지는 펄스맥 전용 페이지입니다.\n코리아티엠 페이지로 이동하시겠습니까?"
      );
      if (confirm) {
        navi("/koti");
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

export default Pearlsmack;
