import React, { useState } from "react";
import { db } from "../../firebase";
import { updateDoc, arrayUnion, doc } from "firebase/firestore";

import Menu from "./Menu";
import Confirm from "./Confirm";
import Custommer from "../Custommer";

function OrderIt(props) {
  const [selectedMenu, setSelectedMenu] = useState([]);

  const submit = async () => {
    const confirm = window.confirm("주문을 완료하시겠습니까?");
    if (!confirm) {
      return alert("주문 내용을 확인후 다시 눌러주세요");
    }
    // meal과 drink 배열 초기화
    const meal = [];
    const drink = [];
    let mealq = 0;
    let drinkq = 0;

    // selectedMenu 배열 순회하면서 menuType에 따라 분리
    selectedMenu.forEach(item => {
      if (item.menuType === "meal") {
        meal.push(item);
        mealq = mealq + item.quantity;
      } else if (item.menuType === "drink") {
        drink.push(item);
        drinkq = drinkq + item.quantity;
      }
    });
    if (selectedMenu.length < 1) {
      return alert("메뉴를 추가해 주세요");
    }
    if (!props.orderInfo.drinkOnly && mealq < props.orderInfo.headCount) {
      return alert("간식 메뉴는 인원에 맞게 추가해 주세요");
    }
    if (drinkq < props.orderInfo.headCount) {
      const confirm = window.confirm(
        "선택한 음료가 인원보다 적습니다. 주문을 진행할까요?"
      );
      if (!confirm) {
        return alert("음료를 추가해 주세요");
      }
    }
    const orderDocRef = doc(db, "order", props.orderInfo.docId); // 기존 문서의 레퍼런스 사용

    try {
      await updateDoc(orderDocRef, {
        orderStat: 1,
        selectedMeal: arrayUnion(...meal),
        selectedDrink: arrayUnion(...drink),
      });
      alert("주문이 완료되었습니다");
      props.navi("/koti/complete");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <>
      <div className="text-lg lg:text-2xl text-center mt-8">
        {props.orderInfo.isOuter ? (
          <p className="p-4">
            코리아티엠을 방문해 주셔서 감사합니다. <br className="xl:hidden" />
            방문하시는 분께 <br className="hidden xl:block" />
            {props.orderInfo.drinkOnly ? "음료를" : "음료와 간식을"} 제공하고
            있사오니 <br className="xl:hidden" />
            원하는 메뉴를 선택 해 주세요
          </p>
        ) : (
          <p className="p-4">
            항상 코리아티엠을 위해 힘내주셔서 감사합니다! <br />
            원하는 메뉴를 선택해 주세요
          </p>
        )}
        <Custommer user={props.user} orderInfo={props.orderInfo} />
        <hr />
        <Menu
          headCount={props.orderInfo.headCount}
          drinkOnly={props.orderInfo.drinkOnly}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
        <Confirm
          submit={submit}
          selectedMenu={selectedMenu}
          headCount={props.orderInfo.headCount}
          drinkOnly={props.orderInfo.drinkOnly}
        />
      </div>
    </>
  );
}

export default OrderIt;
