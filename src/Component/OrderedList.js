import React, { useEffect, useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import Custommer from "./Custommer";
import { useNavigate } from "react-router-dom";

function OrderedList(props) {
  const navi = useNavigate();
  const [meal, setMeal] = useState([]);
  const [drink, setDrink] = useState([]);
  const [mealPrice, setMealPrice] = useState(0);
  const [drinkPrice, setDrinkPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [modal, setModal] = useState(false);

  const [reserve, setReserve] = useState("");
  const [reserveTime, setReserveTime] = useState("");

  useEffect(() => {
    setMeal(props.orderInfo.selectedMeal);
    setDrink(props.orderInfo.selectedDrink);
    setReserve(props.orderInfo.reserve);
    setReserveTime(props.orderInfo.reserveTime);
    getTotalPrice();
    //eslint-disable-next-line
  }, []);

  const getTotalPrice = () => {
    const meal = props.orderInfo.selectedMeal;
    const drink = props.orderInfo.selectedDrink;
    let mealP = 0;
    let drinkP = 0;
    let totalP = 0;
    meal.forEach(item => {
      mealP = mealP + Number(item.price) * Number(item.quantity);
    });

    drink.forEach(item => {
      drinkP = drinkP + Number(item.price) * Number(item.quantity);
    });
    totalP = mealP + drinkP;

    setMealPrice(mealP);
    setDrinkPrice(drinkP);
    setTotalPrice(totalP);
  };

  const getPrice = price => {
    return `￦ ${price.toLocaleString()}`;
  };

  const timeChk = (r, t) => {
    // 시와 분을 분리
    const hours = t.slice(0, 2);
    const minutes = t.slice(2, 4);
    const time = `${hours}:${minutes}`;

    // 입력된 날짜와 시간으로 Date 객체 생성
    const date = new Date(`${r} ${time}`);

    // 현재 시간 가져오기
    const now = new Date();

    // 현재 날짜와 예약 날짜가 동일한지 확인
    const isSameDate = now.toDateString() === date.toDateString();

    // 2시간 이전의 시간을 계산
    const twoHoursBefore = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    // 동일한 날짜일 때만 2시간 이전인지 확인하고 결과 반환
    if (isSameDate) {
      return date <= twoHoursBefore;
    }

    // 날짜가 다르면 true 반환
    return true;
  };

  const cancelOrder = async (id, r, t) => {
    const timeCheck = await timeChk(r, t);
    if (!timeCheck) {
      alert(
        "주문취소는 방문예약 2시간 이전까지만 가능합니다\n펄스맥에 문의하세요"
      );
      return false;
    }
    const confirm = window.confirm(
      "주문을 취소하시면 다시 주문서를 생성하셔야 합니다. 진행할까요?"
    );
    if (!confirm) {
      return false;
    }
    const orderDocRef = doc(db, "order", id); // 'order' 컬렉션의 특정 문서 참조

    try {
      await updateDoc(orderDocRef, {
        orderStat: 9, // orderStat 필드를 9로 업데이트
      });
      alert("주문이 취소되었습니다");
      navi("/koti/orderlist");
    } catch (error) {
      console.error("문서 업데이트 중 오류 발생: ", error);
      alert("주문 취소에 실패했습니다. 관리자에게 문의하세요");
    }
  };

  const updateReserve = async () => {
    const orderInfo = props.orderInfo;
    const timeCheck = await timeChk(orderInfo.reserve, orderInfo.reserveTime);
    if (!timeCheck) {
      alert(
        "시간변경은 방문예약 2시간 이전까지만 가능합니다\n펄스맥에 문의하세요"
      );
      return false;
    }
    if (
      orderInfo.reserve === reserve &&
      orderInfo.reserveTime === reserveTime
    ) {
      return alert(
        "방문일시를 수정해주세요.\n취소하시려면 '창닫기'를 눌러주세요"
      );
    }
    const data = {
      reserve: reserve,
      reserveTime: reserveTime,
    };

    try {
      // 문서 참조 생성
      const orderDocRef = doc(db, "order", props.orderInfo.docId);

      // 문서 업데이트
      await updateDoc(orderDocRef, data);
      alert("방문일시를 수정하였습니다..");
      setModal(false);
      props.getOrder();
    } catch (e) {
      console.error("문서 업데이트 중 오류 발생: ", e);
    }
  };

  const cooking = async num => {
    if (num === 4) {
      const confirm = window.confirm(
        "조리를 완료하셨나요?\n완료처리 후 인원이 방문할 예정입니다"
      );
      if (!confirm) {
        return alert("조리 완료 후 다시 눌러주세요");
      }
    }
    const data = {
      orderStat: num,
    };

    try {
      // 문서 참조 생성
      const orderDocRef = doc(db, "order", props.orderInfo.docId);

      // 문서 업데이트
      await updateDoc(orderDocRef, data);

      if (num === 3) {
        alert("조리를 시작합니다");
      } else {
        alert("조리를 완료하였습니다");
      }
      props.getOrder();
    } catch (e) {
      console.error("문서 업데이트 중 오류 발생: ", e);
    }
  };
  return (
    <>
      <Custommer user={props.user} orderInfo={props.orderInfo} />
      <hr />
      <div className="p-4 w-full bg-white border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-2">
          {meal.length > 0 ? (
            <div className="bg-green-100">
              <div className="text-center  font-neoextra py-4">간 식</div>
              <div className="flex flex-col justify-start gap-4">
                <div className="flex justify-start gap-x-1 px-4">
                  <div className="text-center w-[60%]">메뉴</div>
                  <div className="text-center w-[20%]">
                    {props.user.uid !== "" ? "가격" : null}
                  </div>
                  <div className="text-center w-[20%]">수량</div>
                </div>
                {meal.map((menu, idx) => (
                  <div key={idx} className="flex justify-start gap-x-1 px-4">
                    <div className="w-[60%]">{menu.name}</div>
                    <div className="w-[20%] text-right">
                      {props.user.uid !== "" ? getPrice(menu.price) : null}
                    </div>
                    <div className="w-[20%] text-center">{menu.quantity}개</div>
                  </div>
                ))}
                {props.user.uid !== "" ? (
                  <>
                    <div className="bg-stone-500 h-[1px] w-[90%] mx-auto" />
                    <div className="flex justify-between px-4 pb-4 text-base lg:text-lg">
                      <div className="font-neoextra">합계</div>
                      <div className="font-neoextra">{getPrice(mealPrice)}</div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
          <hr className="my-4 lg:hidden" />
          {drink.length > 0 ? (
            <div className="bg-blue-100 py-8">
              <div className="text-center font-neoextra py-4">음 료</div>
              <div className="flex flex-col justify-start gap-4">
                <div className="flex justify-start gap-x-1 px-4">
                  <div className="text-center w-[60%]">메뉴</div>
                  <div className="text-center w-[20%]">
                    {props.user.uid !== "" ? "가격" : null}
                  </div>
                  <div className="text-center w-[20%]">수량</div>
                </div>
                {drink.map((menu, idx) => (
                  <div key={idx} className="flex justify-start gap-x-1 px-4">
                    <div className="w-[60%]">{menu.name}</div>
                    <div className="w-[20%] text-right">
                      {props.user.uid !== "" ? getPrice(menu.price) : null}
                    </div>
                    <div className="w-[20%] text-center">{menu.quantity}개</div>
                  </div>
                ))}
                {props.user.uid !== "" ? (
                  <>
                    <div className="bg-stone-500 h-[1px] w-[90%] mx-auto" />
                    <div className="flex justify-between px-4 pb-4 text-base lg:text-lg">
                      <div className="font-neoextra">합계</div>
                      <div className="font-neoextra">
                        {getPrice(drinkPrice)}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
        <hr className="my-4" />
        {props.orderInfo.orderStat !== 9 ? (
          <>
            {props.user.uid !== "" ? (
              <>
                <div className="flex justify-between px-4 pb-4 text-lg lg:text-xl">
                  <div className="font-neoextra">합계</div>
                  <div className="font-neoextra">{getPrice(totalPrice)}</div>
                </div>
                <div className="my-4 mx-auto">
                  <button
                    className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 w-full"
                    onClick={() => {
                      navi(
                        `/${
                          props.user.name === "펄스맥" ? "pearl" : "koti"
                        }/orderlist`
                      );
                    }}
                  >
                    주문서 리스트로
                  </button>
                </div>
                {props.user.name === "코리아티엠" ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      {props.orderInfo.orderStat === 1 ? (
                        <>
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white p-2"
                            onClick={() => setModal(true)}
                          >
                            방문시간 변경
                          </button>
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2"
                            onClick={() => {
                              cancelOrder(
                                props.orderInfo.docId,
                                props.orderInfo.reserve,
                                props.orderInfo.reserveTime
                              );
                            }}
                          >
                            주문 취소하기
                          </button>
                        </>
                      ) : props.orderInfo.orderStat === 3 ? (
                        <div className="bg-rose-500 text-white p-2 col-span-2 text-center">
                          조리가 진행중이므로 방문일정, 예약시간 변경이 불가능
                          합니다
                        </div>
                      ) : (
                        <div className="bg-blue-500 text-white p-2 col-span-2 text-center">
                          조리가 완료되었습니다. 펄스맥으로 방문해 주세요
                        </div>
                      )}

                      <div className="col-span-2 text-center p-2 bg-gray-100 text-xs lg:text-base">
                        방문시간을 변경하시려면{" "}
                        <span className="font-neoextra text-xs lg:text-base">
                          '방문시간 변경'
                        </span>{" "}
                        버튼을 눌러주세요 <br />
                        주문 메뉴를 변경하려면{" "}
                        <span className="font-neoextra text-xs lg:text-base">
                          주문 취소 후
                        </span>{" "}
                        주문서를 다시 생성해서 전달하세요 <br />
                        취소는{" "}
                        <span className="font-neoextra text-xs lg:text-base">
                          예정시간 2시간 전
                        </span>
                        까지만 가능합니다. 그 이후에 취소하시려면 펄스맥에 직접
                        연락하세요
                      </div>
                    </div>
                  </>
                ) : props.user.name === "펄스맥" ? (
                  <>
                    <div className="grid grid-cols-1 gap-y-4">
                      {props.orderInfo.orderStat === 1 && (
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white p-2"
                          onClick={() => cooking(3)}
                        >
                          조리 시작하기
                        </button>
                      )}
                      {props.orderInfo.orderStat === 3 && (
                        <button
                          className="bg-rose-500 hover:bg-rose-600 text-white p-2"
                          onClick={() => cooking(4)}
                        >
                          조리 완료하기
                        </button>
                      )}
                      {props.orderInfo.orderStat === 4 && (
                        <div className="bg-blue-500 text-white p-2 col-span-2 text-center">
                          조리가 완료된 주문서입니다.
                        </div>
                      )}
                      <div className="col-span-2 text-center p-2 bg-gray-100 text-xs lg:text-base">
                        상단의 방문일시를 확인하시고 시간에 맞춰
                        <span className="font-neoextra">"조리시작하기"</span>를
                        눌러주세요
                        <br />
                        조리를 완료한 후{" "}
                        <span className="font-neoextra">
                          "조리완료하기"
                        </span>{" "}
                        버튼을 눌러주세요
                        <br />
                        조리 완료 확인 후, 또는 방문 예정시간에 인원이 내려올
                        예정입니다
                      </div>
                    </div>
                  </>
                ) : null}
              </>
            ) : (
              <div className="text-center text-lg lg:text-xl">
                주문내용을 확인하시고, 잘못 된 부분이 있으면 링크를 전달해준
                담당자에게 문의해 주세요.
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-lg lg:text-xl">
            취소된 주문서 입니다.
          </div>
        )}
      </div>
      {modal ? (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded border bg-white z-10 w-auto min-w-[300px]">
          <div className="flex flex-col justify-center gap-y-2 col-span-2">
            <label htmlFor="reserve" className="text-base text-left">
              방문일시
            </label>
            <div className="grid grid-cols-3 gap-x-1">
              <input
                id="reserve"
                type="date"
                value={reserve}
                className="text-base p-1 border bg-[#fafbfc] col-span-2"
                onClick={e => e.currentTarget.showPicker()} // 포커스될 때 달력 팝업
                onChange={e => {
                  setReserve(e.currentTarget.value);
                }}
              />
              <select
                className="rounded border p-1 w-full bg-[#fafbfc]"
                value={reserveTime}
                onChange={e => setReserveTime(e.target.value)}
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
          <hr className="my-2" />
          <div className="grid grid-cols-3 gap-x-2">
            <button
              className="bg-green-500 hover:bg-green-600 border border-green-500 hover:border-green-600 text-white p-2 col-span-2"
              onClick={() => {
                updateReserve();
              }}
            >
              수정하기
            </button>
            <button
              className="bg-white hover:bg-gray-100 border border-rose-500 hover:border-rose-600 text-rose-500 hover:text-rose-600 p-2"
              onClick={() => {
                setReserve(props.orderInfo.reserve);
                setReserveTime(props.orderInfo.reserveTime);
                setModal(false);
              }}
            >
              창닫기
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default OrderedList;
