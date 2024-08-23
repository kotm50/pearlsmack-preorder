import React, { useEffect, useState } from "react";

function Confirm(props) {
  const [meal, setMeal] = useState(0);
  const [drink, setDrink] = useState(0);

  useEffect(() => {
    splitMenu(props.selectedMenu);
  }, [props.selectedMenu]);

  const splitMenu = selectedMenu => {
    // meal과 drink 지정
    let meal = 0;
    let drink = 0;

    // selectedMenu 배열 순회하면서 menuType에 따라 분리
    selectedMenu.forEach(item => {
      if (item.menuType === "meal") {
        meal = meal + item.quantity;
      } else if (item.menuType === "drink") {
        drink = drink + item.quantity;
      }
    });
    setMeal(meal);
    setDrink(drink);
  };
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] border border-b-0 border-stone-300 p-4 bg-white text-center mx-auto grid grid-cols-1 gap-y-4">
      <div className="flex justify-center gap-x-4 text-sm lg:text-base">
        {!props.drinkOnly && (
          <div>
            간식 {meal}개 /{" "}
            <span className="font-neoextra">{Number(props.headCount)}명</span>
          </div>
        )}
        <div>
          음료 {drink}개 /{" "}
          <span className="font-neoextra">{Number(props.headCount)}명</span>
        </div>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white p-2 text-base lg:text-xl"
        onClick={() => {
          props.submit();
        }}
      >
        주문 완료하기
      </button>
    </div>
  );
}

export default Confirm;
