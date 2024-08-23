import React, { useEffect } from "react";

function Info(props) {
  useEffect(() => {
    if (!props.isOrg) {
      props.setHeadCount(1);
    } else {
      props.setHeadCount("");
    }
    //eslint-disable-next-line
  }, [props.isOrg]);

  const handleFocus = () => {
    // '-'를 제거하고 숫자만 남겨서 입력
    const sanitizedNumber = props.phone.replace(/-/g, "");
    props.setPhone(sanitizedNumber);
  };

  const handleBlur = () => {
    const sanitizedNumber = props.phone.replace(/-/g, "");

    // 올바른 형식인지 확인
    const isValidPhone = /^010\d{8}$/.test(sanitizedNumber);

    if (isValidPhone) {
      // 형식에 맞다면 '010-0000-0000'으로 변경
      const formattedNumber = `${sanitizedNumber.slice(
        0,
        3
      )}-${sanitizedNumber.slice(3, 7)}-${sanitizedNumber.slice(7)}`;

      props.setPhone(formattedNumber);
      props.setPhoneErr(false);
    } else {
      // 형식이 틀리면 phoneErr를 true로 설정
      props.setPhoneErr(true);
    }
  };

  const handleCount = e => {
    const value = e.target.value;

    // 숫자만 포함되었는지 확인
    if (/^\d*$/.test(value)) {
      props.setHeadCount(value); // 숫자만 포함된 경우 상태 업데이트
    }
  };
  return (
    <div className="lg:w-full w-[95%] mx-auto p-2 rounded bg-white my-10 shadow-sm">
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="flex flex-col justify-center gap-y-2">
          <label htmlFor="name" className="text-base text-left">
            {props.isOrg ? "지점명" : "이름"}
          </label>
          <input
            id="name"
            type="text"
            value={props.name}
            className="text-base p-1 border bg-[#fafbfc]"
            onChange={e => {
              props.setName(e.currentTarget.value);
            }}
          />
        </div>
        <div className="flex flex-col justify-center gap-y-2 col-span-2">
          <label
            htmlFor="phone"
            className={`text-base text-left ${
              props.phoneErr ? "text-rose-500" : ""
            }`}
          >
            연락처
          </label>
          <input
            id="phone"
            type="text"
            value={props.phone}
            className={`text-base p-1 border bg-[#fafbfc] ${
              props.phoneErr ? "text-rose-500 border-rose-500" : ""
            }`}
            onChange={e => props.setPhone(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="하이픈(-) 없이 숫자만"
          />

          {props.phoneErr && (
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
            value={props.headCount}
            className="text-base p-1 border bg-[#fafbfc]"
            onChange={handleCount}
            disabled={!props.isOrg}
          />
        </div>
        <div className="flex flex-col justify-center gap-y-2 col-span-2">
          <label htmlFor="reserve" className="text-base text-left">
            방문일시
          </label>
          <div className="grid grid-cols-3 gap-x-1">
            <input
              id="reserve"
              type="date"
              value={props.reserve}
              className="text-base p-1 border bg-[#fafbfc] col-span-2"
              onClick={e => e.currentTarget.showPicker()} // 포커스될 때 달력 팝업
              onChange={e => {
                props.setReserve(e.currentTarget.value);
              }}
            />
            <select
              className="rounded border p-1 w-full bg-[#fafbfc]"
              value={props.reserveTime}
              onChange={e => props.setReserveTime(e.target.value)}
            >
              <option value="0900">09:00</option>
              <option value="0930">09:30</option>
              <option value="1000">10:00</option>
              <option value="1030">10:30</option>
              <option value="1100">11:00</option>
              <option value="1130">11:30</option>
              <option value="1200">12:00</option>
              <option value="1230">12:30</option>
              <option value="1300">13:00</option>
              <option value="1330">13:30</option>
              <option value="1400">14:00</option>
              <option value="1430">14:30</option>
              <option value="1500">15:00</option>
              <option value="1530">15:30</option>
              <option value="1600">16:00</option>
              <option value="1630">16:30</option>
              <option value="1700">17:00</option>
              <option value="1730">17:30</option>
              <option value="1800">18:00</option>
              <option value="1830">18:30</option>
              <option value="1900">19:00</option>
              <option value="1930">19:30</option>
              <option value="2000">20:00</option>
              <option value="2030">20:30</option>
              <option value="2100">21:00</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Info;
