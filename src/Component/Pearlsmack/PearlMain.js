import React from "react";
import { useNavigate } from "react-router-dom";

function PearlMain() {
  const navi = useNavigate();
  return (
    <>
      <div className="text-lg lg:text-2xl text-center my-8">
        주문 내역 확인, 메뉴 관리가 가능합니다
      </div>
      <div className="grid grid-cols-2 gap-x-2">
        <div className="text-center">
          <button
            className="w-[80%] lg:w-[50%] min-h-[200px] border border-green-600 bg-white hover:bg-green-100 lg:text-3xl"
            onClick={() => {
              navi("/pearl/orderlist");
            }}
          >
            주문목록 보기
          </button>
        </div>
        <div className="text-center">
          <button
            className="w-[80%] lg:w-[50%] min-h-[200px] border border-green-600 bg-white hover:bg-green-100 lg:text-3xl"
            onClick={() => {
              navi("/pearl/menu");
            }}
          >
            메뉴 관리
          </button>
        </div>
      </div>
    </>
  );
}

export default PearlMain;
