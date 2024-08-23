import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { db, auth } from "../firebase";

function AdminRegist() {
  let navi = useNavigate();

  const [rName, setRName] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [rpw, setRpw] = useState("");
  const [phone, setPhone] = useState("");
  const [pAlert, setPAlert] = useState(false);

  const joinAdmin = async e => {
    if (pw !== rpw) {
      return alert("비밀번호가 일치하지 않습니다. 다시 입력하세요");
    }
    let body = {
      rName: rName, // 이름(본명)
      name: name, // 이름(업무용)
      position: position, // 직책
      id: id, // 아이디
      password: pw, // 비밀번호
      admin: true, // 관리자등급
      created: serverTimestamp(), // 생성시간
    };
    let submit = window.confirm(
      `${body.rName}님의 관리자계정을 생성합니다. 진행할까요?`
    );
    if (submit) {
      await createUserWithEmailAndPassword(
        auth,
        body.id + "@korea.tm",
        body.password
      )
        .then(async userCredential => {
          // Signed in

          await updateProfile(auth.currentUser, {
            displayName: "admin",
          })
            .then(() => {
              // Profile updated!
              // ...
            })
            .catch(error => {
              // An error occurred
              // ...
            });
          const user = userCredential.user;
          const adminRef = collection(db, "admin");
          await setDoc(doc(adminRef, `${user.uid}`), body);
          alert(`생성 완료`);
          navi("/");
        })
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode + " : " + errorMessage);
          // ..
        });
    }
  };
  return (
    <div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
    p-3 bg-white rounded-lg min-w-1 min-h-1 drop-shadow-lg w-11/12 lg:w-1/6"
    >
      <h2 className="text-lg mb-3">계정 등록</h2>
      <form>
        <div className="mb-3">
          <label
            htmlFor="rName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            이름을 입력해주세요
          </label>
          <input
            type="text"
            id="rName"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
            value={rName}
            onChange={e => setRName(e.currentTarget.value)}
            onBlur={e => setRName(e.currentTarget.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            업무용 이름을 입력해주세요
          </label>
          <input
            type="text"
            id="name"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
            value={name}
            onChange={e => setName(e.currentTarget.value)}
            onBlur={e => setName(e.currentTarget.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="position"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            직책을 입력해주세요
          </label>
          <input
            type="text"
            id="position"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
            value={position}
            onChange={e => setPosition(e.currentTarget.value)}
            onBlur={e => setPosition(e.currentTarget.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="position"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            업무용 연락처를 입력해주세요
            {pAlert && (
              <span className="text-indigo-500 text-sm mb-5 lg:ml-1 font-normal">
                연락처는 숫자만 입력해 주세요
              </span>
            )}
          </label>
          <input
            type="text"
            id="phone"
            phone="phone"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
            placeholder="여기를 눌러서 연락처를 입력해 주세요"
            onKeyDown={event => {
              if (!/[0-9]/.test(event.key)) {
                if (
                  event.key === "Delete" ||
                  event.key === "Backspace" ||
                  event.key === "Tab"
                ) {
                  setPAlert(false);
                } else {
                  event.preventDefault();
                  setPAlert(true);
                }
              } else {
                setPAlert(false);
              }
            }}
            value={phone}
            onChange={e => setPhone(e.currentTarget.value)}
            onBlur={e => {
              setPhone(e.currentTarget.value);
              setPAlert(false);
            }}
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="id"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            아이디를 입력해주세요
          </label>
          <input
            type="text"
            id="id"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
            value={id}
            onChange={e => setId(e.currentTarget.value)}
            onBlur={e => setId(e.currentTarget.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            비밀번호를 입력하세요(6글자 이상)
          </label>
          <input
            type="password"
            id="password"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
            value={pw}
            onChange={e => setPw(e.currentTarget.value)}
            onBlur={e => setPw(e.currentTarget.value)}
            autoComplete="off"
            required
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="repeat-password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            비밀번호를 한번 더 입력하세요
          </label>
          <input
            type="password"
            id="repeat-password"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
            value={rpw}
            onChange={e => setRpw(e.currentTarget.value)}
            onBlur={e => setRpw(e.currentTarget.value)}
            autoComplete="off"
            required
          />
        </div>
        <button
          type="submit"
          className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
          onClick={e => {
            e.preventDefault();
            joinAdmin();
          }}
        >
          관리자회원가입
        </button>
      </form>
    </div>
  );
}

export default AdminRegist;
