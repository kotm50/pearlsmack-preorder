import React, { useEffect, useState } from "react";

function MenuDetail(props) {
  const [quantity, setQuantity] = useState(0);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (props.selectedMenu && props.selectedMenu.length > 0) {
      chkSelected(props.menu.id, props.selectedMenu);
    }
    //eslint-disable-next-line
  }, [props.selectedMenu]);

  const chkSelected = id => {
    const isSelected = props.selectedMenu.some(menu => menu.id === id);
    setIsSelected(isSelected);
  };

  return (
    <>
      <div
        className={`col-span-5 flex flex-col justify-center gap-y-2 overflow-x-hidden ${
          isSelected ? "bg-green-100" : ""
        }`}
      >
        <div className="font-neoextra text-lg p-1">
          {props.menu.menuName}{" "}
          {isSelected ? (
            <span className="text-xs lg:text-sm">(추가됨)</span>
          ) : null}
        </div>

        <div
          className="font-neo text-sm p-1 w-full text-ellipsis break-keep whitespace-nowrap"
          title={props.menu.description}
        >
          {props.menu.description ? props.menu.description : "　"}
        </div>
      </div>
      <div className="flex justify-start gap-0 col-span-2">
        <button
          className="border p-1 w-[48px] bg-white"
          disabled={Number(quantity) < 1}
          onClick={() => {
            setQuantity(Number(quantity) - 1);
          }}
        >
          -
        </button>
        <input
          type="number"
          className="p-1 border-y w-[48px] text-center bg-white"
          value={quantity}
          onChange={e => {
            setQuantity(e.currentTarget.value);
          }}
        />
        <button
          className="border p-1 w-[48px] bg-white"
          onClick={() => {
            setQuantity(Number(quantity) + 1);
          }}
        >
          +
        </button>
      </div>
      <div className="col-span-3 grid grid-cols-3 gap-x-1">
        <button
          className="p-2 border border-green-500 hover:border-green-600 bg-green-500 hover:bg-green-600 text-white font-neoextra rounded text-sm col-span-2"
          onClick={() => {
            props.addMenu(
              props.menu.id,
              props.menu.menuType,
              props.menu.menuName,
              quantity,
              props.menu.price,
              isSelected
            );
          }}
        >
          {isSelected ? "수량 변경" : "메뉴 추가"}
        </button>
        <button
          className="p-2 bg-white hover:bg-gray-100 border border-rose-500 hover:border-rose-600 text-rose-500 hover:text-rose-600 font-neoextra rounded text-sm"
          onClick={() => {
            props.deleteMenu(props.menu.id);
            setQuantity(0);
            setIsSelected(false);
          }}
        >
          삭제
        </button>
      </div>
    </>
  );
}

export default MenuDetail;
