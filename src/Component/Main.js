import React, { useState } from "react";
import { useSelector } from "react-redux";

import AdminLogin from "./AdminLogin";
import { useNavigate } from "react-router-dom";

function Main() {
  const [modal, setModal] = useState(false);
  const [redirect, setRedirect] = useState("");

  const navi = useNavigate();
  const user = useSelector(state => state.user);
  const loginChk = redirect => {
    if (user.uid !== "") {
      navi(`/${redirect}`);
    } else {
      setModal(true);
      setRedirect(redirect);
    }
  };
  return (
    <>
      <div className="text-2xl text-center my-8">
        로그인 할 계정을 선택해 주세요
      </div>
      <div className="grid grid-cols-2 gap-x-2">
        <div className="text-center">
          <button
            className="w-[80%] lg:w-[50%]  min-h-[200px] border border-green-600 bg-white hover:bg-green-100 lg:text-3xl"
            onClick={() => {
              loginChk("koti");
            }}
          >
            코리아티엠
          </button>
        </div>
        <div className="text-center">
          <button
            className="w-[80%] lg:w-[50%]  min-h-[200px] border border-green-600 bg-white hover:bg-green-100 lg:text-3xl"
            onClick={() => {
              loginChk("pearl");
            }}
          >
            펄스맥
          </button>
        </div>
      </div>
      {modal ? (
        <AdminLogin
          redirect={redirect}
          setRedirect={setRedirect}
          setModal={setModal}
        />
      ) : null}
    </>
  );
}

export default Main;
