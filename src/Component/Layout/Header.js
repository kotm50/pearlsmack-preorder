import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../../firebase";
import { useDispatch } from "react-redux";
import { clearUser } from "../../Reducer/userSlice";
import { useNavigate } from "react-router-dom";

function Header(props) {
  const navi = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="my-4">
      <header className="container mx-auto">
        {props.user.name !== "" ? (
          <div className="text-right mb-4">
            {props.user.name} 님 로그인 완료 |{" "}
            <button
              className="hover:text-rose-500"
              onClick={() => {
                signOut(auth);
                dispatch(clearUser());
              }}
            >
              로그아웃
            </button>
          </div>
        ) : null}
        <h1
          className="text-2xl lg:text-6xl text-center font-neoextra"
          onClick={() => {
            if (props.user.name !== "") {
              navi("/");
            }
          }}
        >
          {props.title}
        </h1>
      </header>
    </div>
  );
}

export default Header;
