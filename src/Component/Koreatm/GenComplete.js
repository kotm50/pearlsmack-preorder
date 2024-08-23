import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function GenComplete() {
  const navi = useNavigate();
  let { orderid } = useParams();
  const [orderUrl, setOrderUrl] = useState("");
  const getDomain = () => {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}/`;
  };
  useEffect(() => {
    const domain = getDomain();
    setOrderUrl(`${domain}orderdetail/${orderid}`);
    //eslint-disable-next-line
  }, []);

  const copyUrl = () => {
    navigator.clipboard.writeText(orderUrl);
    alert(
      "주문서 링크가 복사되었습니다\n메신저 등에 붙여넣기 하여 공유해 주세요"
    );
  };
  return (
    <>
      <div className="text-2xl text-center my-8">
        주문서 생성이 완료되었습니다. 주문서 링크를 복사해서 공유해 주세요.
        <br />
        직접 주문하려면 <span className="font-neoextra">
          '주문서로 이동'
        </span>{" "}
        버튼을 클릭해 주세요
      </div>
      <p className="text-center">
        주문서 링크 : <span className="font-neoextra">{orderUrl}</span>
      </p>
      <div className="grid grid-cols-2 gap-4 p-2 my-8">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white text-center text-2xl p-2"
          onClick={() => copyUrl()}
        >
          주문서 공유
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white text-center text-2xl p-2"
          onClick={() => navi(`/orderdetail/${orderid}`)}
        >
          주문서로 이동
        </button>
        <button
          className="bg-yellow-600 hover:bg-yellow-700 text-white text-center text-2xl p-2"
          onClick={() => navi(`/koti/orderlist`)}
        >
          주문서 리스트
        </button>
      </div>
    </>
  );
}

export default GenComplete;
