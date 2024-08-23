import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import { db } from "../../firebase";
import {
  collection,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

function Menu() {
  const [meal, setMeal] = useState([]);
  const [drink, setDrink] = useState([]);
  const [addMenu, setAddMenu] = useState(false);
  const [menuName, setMenuName] = useState("");
  const [description, setDescription] = useState("");
  const [menuType, setMenuType] = useState("meal");
  const [price, setPrice] = useState(0);
  const [disCount, setDisCount] = useState(0);
  const [menuId, setMenuId] = useState("");

  useEffect(() => {
    getMenu();
    //eslint-disable-next-line
  }, []);

  const modifyMenu = async id => {
    try {
      const menuDoc = await getDoc(doc(db, "menu", id));
      if (menuDoc.exists()) {
        const menuData = menuDoc.data();
        setMenuName(menuData.menuName || "");
        setDescription(menuData.description || "");
        setMenuType(menuData.menuType || "meal");
        setPrice(menuData.price || 0);
        setDisCount(menuData.disCount !== undefined ? menuData.disCount : 0);
        setMenuId(id); // 현재 수정 중인 메뉴의 ID를 설정
        setAddMenu(true); // 메뉴 추가/수정 창을 열기
      } else {
        console.log("No such document!");
      }
    } catch (e) {
      console.error("Error fetching document: ", e);
    }
  };

  const inputMenu = async () => {
    let dc;
    if (disCount === "" || isNaN(disCount)) {
      dc = 0;
    } else {
      dc = Number(disCount);
    }

    let date;
    if (menuId === "") {
      date = `menu_${dayjs(new Date()).format("YYYYMMDDhhmmss")}`;
    } else {
      date = menuId;
    }

    const data = {
      menuName: menuName,
      description: description,
      menuType: menuType,
      price: Number(price),
      disCount: dc,
      ordered: 0,
      createdAt: serverTimestamp(),
    };
    try {
      await setDoc(doc(db, "menu", date), data);
      setMenuId("");
      setMenuName("");
      setDescription("");
      setPrice(0);
      setDisCount(0);
      alert(`${menuId === "" ? "추가완료" : "수정완료"}`);
      getMenu();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const getMenu = async () => {
    setMeal([]);
    try {
      const querySnapshot = await getDocs(collection(db, "menu"));
      const meal = [];
      const drink = [];
      querySnapshot.forEach(doc => {
        if (doc.data().menuType === "meal") {
          meal.push({ id: doc.id, ...doc.data() });
        } else {
          drink.push({ id: doc.id, ...doc.data() });
        }
      });
      setMeal(meal);
      setDrink(drink);
    } catch (e) {
      console.error("Error getting documents: ", e);
    }
  };
  const deleteMenu = async id => {
    const confirm = window.confirm(
      "삭제하면 복구할 수 없습니다. 삭제하시겠습니까?"
    );
    if (!confirm) {
      return false;
    }
    try {
      await deleteDoc(doc(db, "menu", id));
      alert("삭제완료");
      // 삭제 후 메뉴 리스트를 다시 가져와서 업데이트
      getMenu();
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const getDisCount = (price, dc) => {
    // 할인율 계산 후 소수점 아래는 버림
    const discountedPrice = Math.floor(price * (1 - dc / 100));
    // 결과를 소수점 없이 문자열로 반환
    return discountedPrice.toLocaleString();
  };
  return (
    <>
      <div className="text-2xl text-center my-8">펄스맥 Menu</div>
      <div className="sticky top-0 left-0 w-full max-w-[1000px] rounded-lg shadow-sm p-2 border border-gray-200 bg-white">
        {addMenu ? (
          <div className="p-2 flex flex-col justify-start gap-y-2">
            <button
              className="p-2 bg-gray-500 text-white hover:bg-gray-700 w-full"
              onClick={() => {
                setAddMenu(false);
              }}
            >
              창 닫기
            </button>
            <div className="py-4 grid grid-cols-1 lg:grid-cols-2 gap-2 text-base">
              <div className="flex gap-x-2">
                <p className="p-2 min-w-[100px]">메뉴분류</p>
                <select
                  className="rounded border p-2 min-w-[200px]"
                  value={menuType}
                  onChange={e => setMenuType(e.target.value)}
                >
                  <option value="meal">간식</option>
                  <option value="drink">음료</option>
                </select>
              </div>
              <div className="flex gap-x-2">
                <p className="p-2 min-w-[100px]">메뉴이름</p>
                <input
                  type="text"
                  className="rounded border p-2"
                  value={menuName}
                  onChange={e => setMenuName(e.currentTarget.value)}
                  onBlur={e => setMenuName(e.currentTarget.value)}
                />
              </div>
              <div className="gap-x-2 lg:col-span-2 hidden">
                <p className="p-2 min-w-[100px]">메뉴설명</p>
                <input
                  type="text"
                  className="rounded border p-2 w-full"
                  value={description}
                  onChange={e => setDescription(e.currentTarget.value)}
                  onBlur={e => setDescription(e.currentTarget.value)}
                />
              </div>
              <div className="flex gap-x-2">
                <p className="p-2 min-w-[100px]">메뉴가격</p>
                <input
                  type="number"
                  className="rounded border p-2"
                  value={price}
                  onChange={e => setPrice(e.currentTarget.value)}
                  onBlur={e => setPrice(e.currentTarget.value)}
                />
              </div>
              <div className="flex gap-x-2">
                <p className="p-2 min-w-[100px]">직원할인율</p>
                <input
                  type="number"
                  className="rounded border p-2"
                  value={disCount}
                  onChange={e => setDisCount(e.currentTarget.value)}
                  onBlur={e => setDisCount(e.currentTarget.value)}
                />
              </div>
            </div>

            <button
              className="p-2 bg-blue-500 text-white hover:bg-blue-700 w-full"
              onClick={() => {
                inputMenu();
              }}
            >
              추가하기
            </button>
          </div>
        ) : (
          <div className="p-2">
            <button
              className="p-2 bg-blue-500 text-white hover:bg-blue-700 w-full"
              onClick={() => {
                setAddMenu(true);
              }}
            >
              메뉴 추가
            </button>
          </div>
        )}
      </div>
      <div className="my-4 text-center p-4 text-base bg-gray-200 w-fit mx-auto rounded-lg">
        메뉴명을 검색하려면 ctrl + f 키를 눌러서 검색하세요
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10">
        <div className="flex flex-col justify-start gap-y-4">
          <div className="flex justify-between">
            <div className="p-2 border-b-2 font-neoextra">
              <span className="text-2xl font-neoextra">간식</span>
              <span className="font-neo"> Meal</span>
            </div>
          </div>
          {meal.length > 0 ? (
            <>
              {meal.map((menu, idx) => (
                <div
                  key={idx}
                  className={`flex flex-row justify-between ${
                    idx < meal.length ? "p-2 border-b" : ""
                  }`}
                >
                  <div className="flex flex-col justify-center gap-y-2">
                    <div className="font-neoextra text-lg">{menu.menuName}</div>
                    {menu.description && (
                      <div className="font-neo text-sm text-ellipsis break-keep whitespace-nowrap">
                        {menu.description}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center gap-y-2">
                    {menu.disCount === 0 || !menu.disCount ? (
                      <div className="text-right text-xl">
                        ￦ {Number(menu.price).toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-right text-xl">
                        <span className="test-xs lg:text-sm text-gray-300">
                          {" "}
                          ￦ {Number(menu.price).toLocaleString()}
                        </span>
                        <br />￦{" "}
                        {getDisCount(Number(menu.price), Number(menu.disCount))}
                      </div>
                    )}
                    <button
                      className="p-1 bg-blue-500 hover:bg-blue-600 text-white font-neoextra rounded-lg text-sm min-w-[100px]"
                      onClick={() => {
                        modifyMenu(menu.id);
                      }}
                    >
                      수정
                    </button>
                    <button
                      className="p-1 bg-rose-500 hover:bg-rose-600 text-white font-neoextra rounded-lg text-sm min-w-[100px]"
                      onClick={() => {
                        deleteMenu(menu.id);
                      }}
                    >
                      메뉴 삭제
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : null}
        </div>
        <div className="flex flex-col justify-start gap-y-4">
          <div className="flex justify-between">
            <div className="p-2 border-b-2 font-neoextra">
              <span className="text-2xl font-neoextra">음료</span>
              <span className="font-neo"> Drink</span>
            </div>
          </div>
          {drink.length > 0 ? (
            <>
              {drink.map((menu, idx) => (
                <div
                  key={idx}
                  className={`flex flex-row justify-between ${
                    idx < drink.length ? "p-2 border-b" : ""
                  }`}
                >
                  <div className="flex flex-col justify-center gap-y-2">
                    <div className="font-neoextra text-lg">{menu.menuName}</div>
                    {menu.description && (
                      <div className="font-neo text-sm  text-ellipsis break-keep whitespace-nowrap">
                        {menu.description}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center gap-y-2">
                    {menu.disCount === 0 || !menu.disCount ? (
                      <div className="text-right text-xl">
                        ￦ {Number(menu.price).toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-right text-xl">
                        <span className="test-xs lg:text-sm text-gray-300">
                          {" "}
                          ￦ {Number(menu.price).toLocaleString()}
                        </span>
                        <br />￦{" "}
                        {getDisCount(Number(menu.price), Number(menu.disCount))}
                      </div>
                    )}
                    <button
                      className="p-1 bg-blue-500 hover:bg-blue-600 text-white font-neoextra rounded-lg text-sm min-w-[100px]"
                      onClick={() => {
                        modifyMenu(menu.id);
                      }}
                    >
                      수정
                    </button>
                    <button
                      className="p-1 bg-rose-500 hover:bg-rose-600 text-white font-neoextra rounded-lg text-sm min-w-[100px]"
                      onClick={() => {
                        deleteMenu(menu.id);
                      }}
                    >
                      메뉴 삭제
                    </button>
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

export default Menu;
