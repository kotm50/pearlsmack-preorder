import React from "react";

function Custommer(props) {
  const formatted = text => {
    const formatted = `${text.slice(0, 2)}:${text.slice(2, 4)}`;
    return formatted;
  };
  return (
    <div className="lg:w-full w-[95%] mx-auto p-2 rounded bg-white my-10 shadow-sm">
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="flex flex-col justify-center gap-y-2">
          <label htmlFor="name" className="text-base text-left">
            {props.orderInfo.isOrg ? "지점명" : "이름"}
          </label>
          <input
            id="name"
            type="text"
            value={props.orderInfo.name}
            className="text-base p-1 border bg-[#fafbfc]"
            disabled
          />
        </div>
        <div className="flex flex-col justify-center gap-y-2 lg:col-span-2">
          <label
            htmlFor="phone"
            className={`text-base text-left ${
              props.orderInfo.phoneErr ? "text-rose-500" : ""
            }`}
          >
            연락처
          </label>
          <input
            id="phone"
            type="text"
            value={props.orderInfo.phone}
            className={`text-base p-1 border bg-[#fafbfc] ${
              props.orderInfo.phoneErr ? "text-rose-500 border-rose-500" : ""
            }`}
            disabled
            placeholder="하이픈(-) 없이 숫자만"
          />

          {props.orderInfo.phoneErr && (
            <div className="text-sm text-rose-500 text-left">
              국내 휴대폰 번호(010)만 가능
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center gap-y-2">
          <label htmlFor="headCount" className="text-base text-left">
            인원
          </label>
          <input
            id="headCount"
            type="text"
            value={props.orderInfo.headCount}
            className="text-base p-1 border bg-[#fafbfc]"
            disabled
          />
        </div>
        <div className="flex flex-col justify-center gap-y-2 lg:col-span-2">
          <label htmlFor="reserve" className="text-base text-left">
            방문일시
          </label>
          <div className="grid grid-cols-3 gap-x-1">
            <input
              id="reserve"
              type="date"
              value={props.orderInfo.reserve}
              className=" text-sm lg:text-base p-1 border bg-[#fafbfc] col-span-2"
              disabled
            />
            <div className="rounded border p-1 w-full bg-[#fafbfc] text-sm lg:text-base">
              {formatted(props.orderInfo.reserveTime)}
            </div>
          </div>
        </div>
      </div>
      {props.user.uid === "" ? (
        <div className="text-center text-base mt-4">
          위 정보가 본인과 다를 경우 <br className="lg:hidden" />
          주문서 링크를 전달한 직원에게 문의 부탁드립니다
        </div>
      ) : null}
    </div>
  );
}

export default Custommer;
