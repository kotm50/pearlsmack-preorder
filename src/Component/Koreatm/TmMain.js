import React from "react";
import { useNavigate } from "react-router-dom";

function TmMain() {
  const navi = useNavigate();
  return (
    <>
      <div className="text-lg lg:text-2xl text-center my-8">
        주문서를 새로 작성하거나, 기존 주문서를 확인할 수 있습니다
      </div>
      <div className="grid grid-cols-2 gap-x-2">
        <div className="text-center">
          <button
            className="w-[80%] lg:w-[50%] min-h-[200px] border border-green-600 bg-white hover:bg-green-100 lg:text-3xl"
            onClick={() => {
              navi("/koti/ordergen");
            }}
          >
            주문서 생성하기
          </button>
        </div>
        <div className="text-center">
          <button
            className="w-[80%] lg:w-[50%] min-h-[200px] border border-green-600 bg-white hover:bg-green-100 lg:text-3xl"
            onClick={() => {
              navi("/koti/orderlist");
            }}
          >
            주문서 내역보기
          </button>
        </div>
      </div>
    </>
  );
}

export default TmMain;
