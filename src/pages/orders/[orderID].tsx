/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import React from "react";
import Image from "next/image";
import type { NextPageWithLayout } from "../_app";
import logo from "./../../assets/nc-logo.svg";
import { api } from "../../utils/api";
import { useRouter } from "next/router";
import { NavBar } from "../../components/nav-bar";

const Orders: NextPageWithLayout = () => {
  const router = useRouter();
  const getOrderQuery = api.order.getOrder.useQuery({
    id: Number(router.query.orderID || ''),
  });
  
  return (
    <div className="flex h-screen flex-col items-center gap-8 bg-gray-100">
      {getOrderQuery.data && (
        <div className="w-full sm:w-[400px]">
          <div className="flex flex-col gap-4 px-4 py-8">
            <div className="flex justify-between">
              <div>Order #{getOrderQuery.data.order?.id}</div>
              <div>{getOrderQuery.data.order?.order_date.toDateString()}</div>
            </div>
            <div className="border-b border-gray-400 pb-4">
              {getOrderQuery.data.rows &&
                getOrderQuery.data.rows.map((row, index) => (
                  <div key={index} className="flex justify-between">
                    <div>{row.name}</div>
                    <div>€{row.price}</div>
                  </div>
                ))}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <div>Shipping</div>
                <div>Free</div>
              </div>
              <div className="flex justify-between font-bold">
                <div>Total</div>
                <div>€{getOrderQuery.data.total.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
Orders.getLayout = function getLayout(page: React.ReactElement) {
  return <NavBar>{page}</NavBar>;
};
export default Orders;
