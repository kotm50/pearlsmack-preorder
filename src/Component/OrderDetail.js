import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import OrderIt from "./Koreatm/OrderIt";
import OrderedList from "./OrderedList";

function OrderDetail() {
  const user = useSelector(state => state.user);
  const navi = useNavigate();
  const [orderInfo, setOrderInfo] = useState(null);
  let { orderid } = useParams();
  useEffect(() => {
    getOrder();
    //eslint-disable-next-line
  }, [orderid]);
  const getOrder = async () => {
    try {
      const docRef = doc(db, "order", orderid);
      const docSnap = await getDoc(docRef);
      let data = docSnap.data();
      data.docId = orderid;
      if (docSnap.exists()) {
        setOrderInfo(data);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      navi("/");
      console.error("Error getting document:", error);
    }
  };
  return (
    <>
      {orderInfo ? (
        <>
          {orderInfo.orderStat === 0 ? (
            <OrderIt navi={navi} user={user} orderInfo={orderInfo} />
          ) : (
            <OrderedList
              user={user}
              orderInfo={orderInfo}
              getOrder={getOrder}
            />
          )}
        </>
      ) : null}
    </>
  );
}

export default OrderDetail;
