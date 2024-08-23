import React, { useEffect, useState } from "react";
//import dayjs from "dayjs";

import { db } from "../../firebase";
import {
  collection,
  getCountFromServer,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Order from "./Order";

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
      chkOrder(false);

      // 이후 10분마다 실행되는 인터벌 설정
      const intervalId = setInterval(() => {
        chkOrder(false);
      }, 10 * 60 * 1000); // 10분 = 600,000ms

      // 컴포넌트 언마운트 시 인터벌 정리를 위해 클로저 사용
      return () => clearInterval(intervalId);
    }, initialDelay);

    // 컴포넌트 언마운트 시 타임아웃 정리
    return () => clearTimeout(timeoutId);
    //eslint-disable-next-line
  }, []);

  const chkOrder = async click => {
    try {
      const q = query(collection(db, "order"), where("orderStat", ">", 0));

      // Firestore에서 조건에 맞는 문서 갯수 가져오기
      const snapshot = await getCountFromServer(q);
      const serverOrderCount = snapshot.data().count;

      // Firestore의 문서 갯수와 현재 orderList.length를 비교
      if (serverOrderCount !== orderList.length) {
        await getOrder(); // 갯수가 다를 경우 리스트 갱신
      } else {
        if (click) {
          alert("갱신할 내용이 없습니다\n잠시 후 다시 시도해 주세요");
        }
        return true;
      }
    } catch (e) {
      console.error("Error checking orders: ", e);
    }
  };

  const getOrder = async () => {
    setOrderList([]);
    try {
      // orderStat 필드가 0보다 큰 문서만 가져오는 쿼리
      const q = query(collection(db, "order"), where("orderStat", ">", 0));

      const querySnapshot = await getDocs(q);
      const order = [];
      querySnapshot.forEach(doc => {
        order.push({ id: doc.id, ...doc.data() });
      });

      // orderStat 정렬 우선순위 설정
      const orderStatPriority = {
        1: 1,
        3: 2,
        4: 3,
        2: 4,
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

  return (
    <>
      <div className="text-2xl text-center my-8">펄스맥 주문목록</div>
      <div className="flex justify-center gap-x-8 mb-8 bg-gray-100 p-2 test-sm lg:text-base">
        <span className="p-2">주문서는 10분마다 자동으로 갱신됩니다</span>
        <button
          className="p-2 bg-blue-500 hover:bg-blue-500 text-white"
          onClick={() => {
            chkOrder(true);
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
                  <Order order={order} navi={navi} />
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
