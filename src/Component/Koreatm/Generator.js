import React, { useState } from "react";
import dayjs from "dayjs";

import { db } from "../../firebase";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Info from "./Info";

function Generator() {
  const navi = useNavigate();

  //입력창
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneErr, setPhoneErr] = useState(false);
  const [headCount, setHeadCount] = useState(1);
  const [reserve, setReserve] = useState("");
  const [reserveTime, setReserveTime] = useState("1200");

  const [isOuter, setIsOuter] = useState(false);
  const [isOrg, setIsOrg] = useState(false);
  const [drinkOnly, setDrinkOnly] = useState(false);
  const [takeOut, setTakeOut] = useState(false);

  const submit = async () => {
    if (!name) {
      return alert("이름을 입력해 주세요");
    }
    if (!phone) {
      return alert("연락처를 입력해 주세요");
    }
    if (phoneErr) {
      return alert("연락처 양식이 잘못 되었습니다");
    }
    if (headCount < 1) {
      return alert("인원을 정확히 입력해 주세요");
    }
    if (!reserve || new Date().getDate() > new Date(reserve).getDate()) {
      return alert("방문일시를 정확히 입력해 주세요");
    }
    const formatted = `${reserveTime.slice(0, 2)}:${reserveTime.slice(
      2,
      4
    )}:00`;
    const reserved = reserve + " " + formatted;
    const date = `order_${dayjs(new Date()).format("YYYYMMDDHHmmss")}`;
    const title = `${dayjs(reserved).format("YYYY년 MM월 DD일 HH:mm:ss")} 예약`;
    const data = {
      name: name,
      phone: phone,
      headCount: headCount,
      reserve: reserve,
      reserveTime: reserveTime,
      title: title,
      isOuter: isOuter,
      isOrg: isOrg,
      drinkOnly: drinkOnly,
      takeOut: takeOut,
      orderStat: 0,
      createdAt: serverTimestamp(),
    };
    try {
      await setDoc(doc(db, "order", date), data);
      navi(`/koti/gencomplete/${date}`);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <>
      <div className="text-2xl text-center my-8">
        주문서를 새로 생성합니다. 주문서 양식을 선택하시고{" "}
        <strong>주문서 생성하기</strong>버튼을 눌러주세요
      </div>
      <Info
        isOrg={isOrg}
        name={name}
        setName={setName}
        phone={phone}
        setPhone={setPhone}
        phoneErr={phoneErr}
        setPhoneErr={setPhoneErr}
        headCount={headCount}
        setHeadCount={setHeadCount}
        reserve={reserve}
        setReserve={setReserve}
        reserveTime={reserveTime}
        setReserveTime={setReserveTime}
      />
      <div className="flex flex-col gap-y-2 divide-y-2 divide-black mb-12">
        <div className="text-xl text-left">
          <span className="font-neoextra">대상 설정</span>(내부 : 야근, 회식 /
          외부 : 고객사, 면접자)
        </div>
        <div className="grid grid-cols-2 p-2 gap-x-2">
          <button
            className={`p-2 border border-green-600 hover:border-green-700 ${
              !isOuter
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "text-green-600 hover:text-green-700 hover:bg-gray-100"
            }`}
            onClick={() => {
              setIsOuter(false);
            }}
          >
            내부 인원
          </button>
          <button
            className={`p-2 border border-green-600 hover:border-green-700 ${
              isOuter
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "text-green-600 hover:text-green-700 hover:bg-gray-100"
            }`}
            onClick={() => {
              setIsOuter(true);
            }}
          >
            외부 인원
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 divide-y-2 divide-black mb-12">
        <div className="text-xl text-left">
          <span className="font-neoextra">인원 설정</span>
        </div>
        <div className="grid grid-cols-2 p-2 gap-x-2">
          <button
            className={`p-2 border border-green-600 hover:border-green-700 ${
              !isOrg
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "text-green-600 hover:text-green-700 hover:bg-gray-100"
            }`}
            onClick={() => {
              setIsOrg(false);
            }}
          >
            1인 주문
          </button>
          <button
            className={`p-2 border border-green-600 hover:border-green-700 ${
              isOrg
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "text-green-600 hover:text-green-700 hover:bg-gray-100"
            }`}
            onClick={() => {
              setIsOrg(true);
            }}
          >
            단체 주문
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 divide-y-2 divide-black mb-12">
        <div className="text-xl text-left">
          <span className="font-neoextra">메뉴 설정</span>(면접자는 음료만
          선택하는 걸 추천드립니다)
        </div>
        <div className="grid grid-cols-2 p-2 gap-x-2">
          <button
            className={`p-2 border border-green-600 hover:border-green-700 ${
              !drinkOnly
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "text-green-600 hover:text-green-700 hover:bg-gray-100"
            }`}
            onClick={() => {
              setDrinkOnly(false);
            }}
          >
            식사/음료
          </button>
          <button
            className={`p-2 border border-green-600 hover:border-green-700 ${
              drinkOnly
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "text-green-600 hover:text-green-700 hover:bg-gray-100"
            }`}
            onClick={() => {
              setDrinkOnly(true);
            }}
          >
            음료만 주문
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 divide-y-2 divide-black mb-12">
        <div className="text-xl text-left">
          <span className="font-neoextra">포장 여부</span>
        </div>
        <div className="grid grid-cols-2 p-2 gap-x-2">
          <button
            className={`p-2 border border-green-600 hover:border-green-700 ${
              !takeOut
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "text-green-600 hover:text-green-700 hover:bg-gray-100"
            }`}
            onClick={() => {
              setTakeOut(false);
            }}
          >
            매장 식사
          </button>
          <button
            className={`p-2 border border-green-600 hover:border-green-700 ${
              takeOut
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "text-green-600 hover:text-green-700 hover:bg-gray-100"
            }`}
            onClick={() => {
              setTakeOut(true);
            }}
          >
            포장 수령
          </button>
        </div>
      </div>
      <div className="p-2">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white p-2 text-2xl w-full font-neoextra"
          onClick={() => {
            submit();
          }}
        >
          주문서 생성하기
        </button>
      </div>
    </>
  );
}

export default Generator;
