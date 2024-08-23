import React, { useEffect, useState } from "react";
//import dayjs from "dayjs";

import { db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function OrderList() {
  const navi = useNavigate();
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    getOrder();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const calculateDelay = () => {
      const now = new Date();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();

      // 다음 10분 단위까지 남은 분 계산
      const remainingMinutes = 10 - (minutes % 10);
      // 다음 10분 단위까지 남은 전체 밀리초 계산
      const delay =
        remainingMinutes * 60 * 1000 - seconds * 1000 - milliseconds;

      return delay;
    };

    // 첫 번째 실행을 위한 딜레이 계산
    const initialDelay = calculateDelay();

    // 첫 번째 타임아웃 설정
    const timeoutId = setTimeout(() => {
      getOrder();

      // 이후 10분마다 실행되는 인터벌 설정
      const intervalId = setInterval(() => {
        getOrder();
      }, 10 * 60 * 1000); // 10분 = 600,000ms

      // 컴포넌트 언마운트 시 인터벌 정리를 위해 클로저 사용
      return () => clearInterval(intervalId);
    }, initialDelay);

    // 컴포넌트 언마운트 시 타임아웃 정리
    return () => clearTimeout(timeoutId);
    //eslint-disable-next-line
  }, []);

  const getOrder = async () => {
    setOrderList([]);
    try {
      // 현재 시간 기준으로 5일 전의 Timestamp를 계산
      const fiveDaysAgo = Timestamp.fromDate(
        dayjs().subtract(5, "day").toDate()
      );

      // Firestore에서 createdAt이 5일 이내인 문서만 쿼리
      const q = query(
        collection(db, "order"),
        where("createdAt", ">=", fiveDaysAgo)
      );

      const querySnapshot = await getDocs(q);
      const order = [];
      querySnapshot.forEach(doc => {
        order.push({ id: doc.id, ...doc.data() });
      });

      // orderStat 정렬 우선순위 설정
      const orderStatPriority = {
        4: 1,
        3: 2,
        2: 3,
        1: 4,
        0: 5,
        9: 6,
      };
      // 정렬 로직
      order.sort((a, b) => {
        // orderStat 우선순위에 따라 정렬
        const statA = orderStatPriority[a.orderStat];
        const statB = orderStatPriority[b.orderStat];

        if (statA !== statB) {
          return statA - statB;
        }

        // orderStat이 동일한 경우, id 뒤의 숫자 기준으로 정렬
        const idA = parseInt(a.id.split("_")[1], 10);
        const idB = parseInt(b.id.split("_")[1], 10);

        return idA - idB;
      });

      setOrderList(order);
    } catch (e) {
      console.error("Error getting documents: ", e);
    }
  };

  const statColor = stat => {
    if (stat === 0) {
      return "text-black";
    } else if (stat === 1) {
      return "text-blue-500";
    } else if (stat === 2) {
      return "text-blue-500";
    } else if (stat === 3) {
      return "text-green-500";
    } else if (stat === 4) {
      return "text-rose-500";
    } else if (stat === 9) {
      return "text-gray-500";
    }
  };
  return (
    <>
      <div className="text-2xl text-center my-8">펄스맥 주문목록</div>
      <div className="flex justify-center gap-x-8 mb-8 bg-gray-100 p-2 test-sm lg:text-base">
        <span className="p-2">주문서는 5분마다 자동으로 갱신됩니다</span>
        <button
          className="p-2 bg-blue-500 hover:bg-blue-500 text-white"
          onClick={() => {
            getOrder();
          }}
        >
          주문서 갱신하기
        </button>
      </div>
      <div className="grid grid-cols-1 lg:gap-x-10">
        <div className="flex flex-col justify-start gap-y-4">
          {orderList.length > 0 ? (
            <>
              {orderList.map((order, idx) => (
                <div
                  key={idx}
                  className={`flex flex-row justify-between ${
                    idx < orderList.length - 1 ? "p-2 border-b" : "px-2"
                  }`}
                >
                  <div className="flex flex-col justify-center gap-y-2 w-[50%]">
                    <div className="font-neoextra text-sm lg:text-xl">
                      {order.name ? `${order.name} / ` : ""} {order.title}
                    </div>
                    <div className="font-neobold text-xs lg:text-base">
                      {order.isOrg ? "단체" : "1인"} |{" "}
                      {order.isOuter ? "외부인" : "내부인"} |{" "}
                      {order.drinkOnly ? "음료만" : "식사/음료"} |{" "}
                      {order.takeOut ? "포장수령" : "매장식사"}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center gap-y-2">
                    <div className="flex justify-end gap-x-2">
                      <div
                        className={`text-right text-sm lg:text-xl p-2 ${statColor(
                          order.orderStat
                        )}`}
                      >
                        {order.orderStat === 0
                          ? "주문 전"
                          : order.orderStat === 1
                          ? "주문 완료"
                          : order.orderStat === 2
                          ? "주문 확정"
                          : order.orderStat === 3
                          ? "조리 중"
                          : order.orderStat === 4
                          ? "조리 완료"
                          : order.orderStat === 9
                          ? "주문 취소"
                          : null}
                      </div>
                      <div className="text-right text-sm lg:text-xl">
                        <button
                          className="py-2 px-4 rounded bg-white hover:bg-gray-100 border border-stone-600"
                          onClick={() => {
                            navi(`/orderdetail/${order.id}`);
                          }}
                        >
                          내역보기
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default OrderList;
