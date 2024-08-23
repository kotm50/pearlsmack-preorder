import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

function Order(props) {
  const [imminent, setImminent] = useState(false);
  useEffect(() => {
    chkTime();
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
      chkTime();

      // 이후 10분마다 실행되는 인터벌 설정
      const intervalId = setInterval(() => {
        chkTime();
      }, 10 * 60 * 1000); // 10분 = 600,000ms

      // 컴포넌트 언마운트 시 인터벌 정리를 위해 클로저 사용
      return () => clearInterval(intervalId);
    }, initialDelay);

    // 컴포넌트 언마운트 시 타임아웃 정리
    return () => clearTimeout(timeoutId);

    //eslint-disable-next-line
  }, []);

  const chkTime = () => {
    console.log(Number(props.order.orderStat));
    const now = new Date();
    const today = dayjs(now).format("YYYY-MM-DD");
    const thisTime = dayjs(now).format("HHmm");
    if (
      4 > props.order.orderStat > 0 &&
      props.order.reserve === today &&
      Number(props.order.reserveTime) - Number(thisTime) < 101
    ) {
      setImminent(true);
    } else {
      setImminent(false);
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
      <div className="flex flex-col justify-center gap-y-2 w-[50%]">
        <div className="font-neoextra text-sm lg:text-xl">
          {props.order.name ? `${props.order.name} / ` : ""} {props.order.title}
        </div>
        <div className="font-neobold text-xs lg:text-base">
          {props.order.isOrg ? "단체" : "1인"} |{" "}
          {props.order.isOuter ? "외부인" : "내부인"} |{" "}
          {props.order.drinkOnly ? "음료만" : "식사/음료"} |{" "}
          {props.order.takeOut ? "포장수령" : "매장식사"}
        </div>
      </div>
      <div className="flex flex-col justify-center gap-y-2">
        <div className="flex justify-end gap-x-2">
          <div
            className={`text-center text-sm lg:text-xl p-2 ${statColor(
              props.order.orderStat
            )}`}
          >
            {props.order.orderStat === 0
              ? "주문 전"
              : props.order.orderStat === 1
              ? "주문 완료"
              : props.order.orderStat === 2
              ? "주문 확정"
              : props.order.orderStat === 3
              ? "조리 중"
              : props.order.orderStat === 4
              ? "조리 완료"
              : props.order.orderStat === 9
              ? "주문 취소"
              : null}{" "}
            {4 > Number(props.order.orderStat) > 0 && imminent ? (
              <>
                <br />
                <span className="text-rose-500 text-xs lg:text-base font-neoextra">
                  예약시간임박
                </span>
              </>
            ) : null}
          </div>
          <div className="text-right text-sm lg:text-xl">
            <button
              className="py-2 px-2 lg:px-4 rounded bg-white hover:bg-gray-100 border border-stone-600"
              onClick={() => {
                props.navi(`/orderdetail/${props.order.id}`);
              }}
            >
              내역보기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Order;
