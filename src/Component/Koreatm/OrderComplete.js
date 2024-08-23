import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function OrderComplete() {
  const navi = useNavigate();
  const user = useSelector(state => state.user);
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white flex flex-col justify-center gap-4">
      <div className="text-center p-2 text-xl">주문이 완료되었습니다</div>
      {user.uid !== "" ? (
        <button
          className="bg-green-500 hover:bg-green-600 text-white p-2"
          onClick={() => {
            navi("/koti/orderlist");
          }}
        >
          주문서 리스트로 이동
        </button>
      ) : null}
    </div>
  );
}

export default OrderComplete;
