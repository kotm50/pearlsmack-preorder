import React, { useEffect, useRef, useState } from "react";
//import dayjs from "dayjs";

import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import MenuDetail from "./MenuDetail";

function Menu(props) {
  const [meal, setMeal] = useState([]);
  const [drink, setDrink] = useState([]);
  const [drinkOnly, setDrinkOnly] = useState(false);

  const [pixel, setPixel] = useState(180);

  const [searchTerm, setSearchTerm] = useState("");
  const [foundIndexes, setFoundIndexes] = useState([]); // 여러 인덱스를 저장
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0); // 현재 선택된 인덱스

  const divRefs = useRef([]);

  const handleSearchChange = event => {
    const value = event.target.value;
    setSearchTerm(value);
    setFoundIndexes([]); // 검색어가 변경되면 인덱스 초기화
    setCurrentSearchIndex(0);
  };

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const indexes = [];
      divRefs.current.forEach((div, index) => {
        if (div) {
          if (div.innerText.includes(searchTerm)) {
            div.style.backgroundColor = "yellow"; // 검색된 요소 강조
            indexes.push(index);
          } else {
            div.style.backgroundColor = "white"; // 검색되지 않은 요소는 원래 상태로
          }
        }
      });
      setFoundIndexes(indexes);
    } else {
      // 검색어가 2글자 미만이면, 기존 강조된 배경을 원래 상태로 되돌림
      divRefs.current.forEach(div => {
        if (div) {
          div.style.backgroundColor = "white";
        }
      });
      setFoundIndexes([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (foundIndexes.length > 0) {
      const index = foundIndexes[currentSearchIndex % foundIndexes.length];
      window.scrollTo({
        top: divRefs.current[index]?.offsetTop - pixel, // 스크롤 보정 120px
        behavior: "smooth",
      });
    }
    //eslint-disable-next-line
  }, [currentSearchIndex, foundIndexes]);

  const handleKeyPress = event => {
    if (event.key === "Enter" && foundIndexes.length > 0) {
      setCurrentSearchIndex(prevIndex => (prevIndex + 1) % foundIndexes.length);
    }
  };

  const handleSearchButtonClick = () => {
    if (foundIndexes.length > 0) {
      setCurrentSearchIndex(prevIndex => (prevIndex + 1) % foundIndexes.length);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
    //eslint-disable-next-line
  }, [foundIndexes]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        // 모바일 해상도 기준, 예: 768px 이하를 모바일로 간주
        setPixel(160);
      } else {
        setPixel(180);
      }
    };

    // 컴포넌트가 마운트될 때 한 번 실행
    handleResize();

    // 윈도우 리사이즈 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [scroll, setScroll] = useState(0);

  const headRef = useRef();
  const mealRef = useRef();
  const drinkRef = useRef();

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const mealRefPosition = mealRef.current
      ? mealRef.current.offsetTop - pixel
      : null;
    const drinkRefPosition = drinkRef.current
      ? drinkRef.current.offsetTop - pixel
      : null;

    if (scrollY >= drinkRefPosition) {
      setScroll(2);
    } else if (scrollY >= mealRefPosition) {
      setScroll(1);
    } else if (scrollY < mealRefPosition) {
      setScroll(0);
    }
  };

  const scrollToRef = ref => {
    window.scrollTo({
      top: ref.current.offsetTop - pixel,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setDrinkOnly(props.drinkOnly);
    getMenu();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log(props.selectedMenu);
  }, [props.selectedMenu]);

  const addMenu = (id, menuType, name, quantity, price, add) => {
    if (!props.headCount) {
      return alert("인원수를 설정 후 메뉴를 골라주세요");
    }
    // meal과 drink 배열 초기화
    let meal = 0;
    let drink = 0;

    // selectedMenu 배열 순회하면서 menuType에 따라 분리
    props.selectedMenu.forEach(item => {
      if (item.menuType === "meal") {
        meal = meal + Number(item.quantity);
      } else if (item.menuType === "drink") {
        drink = drink + Number(item.quantity);
      }
    });

    if (
      menuType === "meal" &&
      meal + Number(quantity) > Number(props.headCount)
    ) {
      return alert("간식 수량은 인원수를 넘길 수 없습니다.");
    }
    if (
      menuType === "drink" &&
      drink + Number(quantity) > Number(props.headCount)
    ) {
      return alert("음료 수량은 인원수를 넘길 수 없습니다.");
    }
    if (Number(quantity) < 1) {
      return alert("수량을 1개 이상 입력 해 주세요");
    }
    const newMenu = {
      id: id,
      name: name,
      menuType: menuType,
      quantity: Number(quantity),
      price: Number(price),
    };
    if (!add) {
      props.setSelectedMenu([...props.selectedMenu, newMenu]); // 기존 배열에 새로운 객체를 추가
    } else {
      const editMenu = props.selectedMenu.map(menu =>
        menu.id === id && menu.quantity !== quantity
          ? { ...menu, quantity: Number(quantity) }
          : menu
      );
      props.setSelectedMenu(editMenu);
    }
  };

  const deleteMenu = id => {
    const itemExists = props.selectedMenu.some(menu => menu.id === id);

    if (itemExists) {
      const updatedItems = props.selectedMenu.filter(menu => menu.id !== id);
      props.setSelectedMenu(updatedItems);
      alert("메뉴 삭제 완료");
    } else {
      alert("메뉴를 추가하지 않았습니다");
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
  return (
    <div className="pb-[120px] lg:pb-4">
      <div className="text-2xl text-center my-8" ref={headRef}>
        펄스맥 Menu
      </div>
      <div className="sticky top-0 left-0 h-auto w-full p-2 grid grid-cols-2 gap-4 my-8 bg-white drop-shadow">
        <div className="col-span-2 grid grid-cols-4 gap-2 lg:pt-4">
          <label htmlFor="search" className="py-2">
            검색
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="text-base px-1 py-2 border bg-[#fafbfc] col-span-2 lg:col-span-2"
            placeholder="검색어를 2글자 이상 입력하세요"
          />
          <button
            className="p-2 bg-blue-500 text-white"
            onClick={handleSearchButtonClick}
          >
            다음
          </button>
          <div className="col-span-4 text-center text-sm">
            {searchTerm.length > 1 ? (
              <span>
                {foundIndexes.length < 1
                  ? "검색결과가 없습니다"
                  : "엔터키 또는 '다음' 버튼을 누르면 다음 결과로 이동합니다"}
              </span>
            ) : null}
          </div>
        </div>
        <button
          className={`bg-transparent p-2 border-b border-black ${
            scroll === 1 ? "font-neoextra border-b-2" : ""
          } ${props.drinkOnly ? "hidden" : ""}`}
          onClick={() => scrollToRef(mealRef)}
        >
          간식류
        </button>
        <button
          className={`bg-transparent p-2 border-b border-black ${
            scroll === 2 ? "font-neoextra border-b-2" : ""
          }`}
          onClick={() => scrollToRef(drinkRef)}
        >
          음료류
        </button>
      </div>
      <div
        className={`grid grid-cols-1 gap-y-5 ${
          drinkOnly ? "" : "lg:grid-cols-2 lg:gap-x-10"
        }`}
      >
        {!drinkOnly ? (
          <div
            className="flex flex-col justify-start gap-y-4 p-4 bg-white border shadow-sm"
            id="mealMenu"
            ref={mealRef}
          >
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
                    key={menu.id}
                    className={`grid grid-cols-5 gap-2 text-left ${
                      idx < meal.length ? "p-2 border-b" : ""
                    }`}
                    ref={el => (divRefs.current[idx] = el)}
                  >
                    <MenuDetail
                      selectedMenu={props.selectedMenu}
                      menu={menu}
                      addMenu={addMenu}
                      deleteMenu={deleteMenu}
                    />
                  </div>
                ))}
              </>
            ) : null}
          </div>
        ) : null}
        <div
          className="flex flex-col justify-start gap-y-4 p-4 bg-white border shadow-sm"
          id="drinkMenu"
          ref={drinkRef}
        >
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
                  key={menu.id}
                  className={`grid grid-cols-5 gap-2 text-left ${
                    idx < drink.length ? "p-2 border-b" : ""
                  }`}
                  ref={el => (divRefs.current[meal.length + idx] = el)}
                >
                  <MenuDetail
                    selectedMenu={props.selectedMenu}
                    menu={menu}
                    addMenu={addMenu}
                    deleteMenu={deleteMenu}
                  />
                </div>
              ))}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Menu;
