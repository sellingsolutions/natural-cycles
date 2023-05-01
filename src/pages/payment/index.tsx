/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import React from "react";
import DropinWrapper from "../../components/bt-drop-in";
import type { NextPageWithLayout }  from "../_app"
import clsx from "clsx";
import { api } from "./../../utils/api";
import { type CardPayment } from "../../types";
import { useRouter } from "next/router";
import { NavBar } from "../../components/nav-bar";
import { LoaderOverlay } from "../../components/loader-overlay";

const Payment: NextPageWithLayout = () => {
  const router = useRouter();
  const email = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
  const [paymentState, setPaymentState] = React.useState({
    plan: "Annual",
    subscriptionPrice: 79.9,
    thermometerName: "NC° Thermometer Gen2",
    thermometer: true,
    thermometerPrice: 14.9,
    loading: false,
  });
  const total = paymentState.subscriptionPrice + (paymentState.thermometer ? paymentState.thermometerPrice : 0);

  const transaction = api.payment.transaction.useMutation();
  const onPaymentRequest = React.useCallback((payload: CardPayment) => {
    setPaymentState({ ...paymentState, loading: true });
    transaction
      .mutateAsync({
        ...paymentState,
        email: email,
        cardPayment: payload
      })
      .then((orderID) => {
        setPaymentState({ ...paymentState, loading: false });
        void router.push(`/orders/${orderID}`);
      }).catch((err) => { 
        setPaymentState ({ ...paymentState, loading: false }); 
        console.log(err) 
    });
  }, [transaction, paymentState, email, router]);

  return (
    <div className="flex h-screen flex-col items-center gap-8 bg-gray-100">
      {paymentState.loading && <LoaderOverlay />}
      <div className="py-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div
            className={clsx(
              "flex min-w-[300px] flex-col gap-2 rounded-lg bg-white px-4 py-8",
              {
                "ring-2 ring-pink-500 ring-offset-2":
                  paymentState.plan === "Annual",
              }
            )}
            onClick={() =>
              setPaymentState({
                ...paymentState,
                plan: "Annual",
                subscriptionPrice: 79.9,
              })
            }
          >
            <div className="text-xl font-medium text-black">Annual</div>
            <div className="font-bold">
              <span className="text-2xl">€6</span>
              <span className="text-base">/mo</span>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col">
                <div>Subscription</div>
                <div className="text-xs">Billed yearly</div>
              </div>
              <div className="font-bold">€79.90</div>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col">
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={paymentState.thermometer}
                    onChange={() =>
                      setPaymentState({
                        ...paymentState,
                        thermometer: !paymentState.thermometer,
                      })
                    }
                  />
                  <div>NC° Thermometer Gen2</div>
                </div>
                <div className="text-xs">Included</div>
              </div>
              <div className="font-bold">Free</div>
            </div>
          </div>
          <div
            className={clsx(
              "flex min-w-[300px] flex-col gap-2 rounded-lg bg-white px-4 py-8",
              {
                "ring-2 ring-pink-500 ring-offset-2":
                  paymentState.plan === "Monthly",
              }
            )}
            onClick={() =>
              setPaymentState({
                ...paymentState,
                plan: "Monthly",
                subscriptionPrice: 9.9,
              })
            }
          >
            <div className="text-xl font-medium text-black">Monthly</div>
            <div className="font-bold">
              <span className="text-2xl">€9</span>
              <span className="text-base">/mo</span>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col">
                <div>Subscription</div>
                <div className="text-xs">Billed monthly</div>
              </div>
              <div className="font-bold">€9</div>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col">
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={paymentState.thermometer}
                    onChange={() =>
                      setPaymentState({
                        ...paymentState,
                        thermometer: !paymentState.thermometer,
                      })
                    }
                  />
                  <div>NC° Thermometer Gen2</div>
                </div>
                <div className="text-xs">One time payment</div>
              </div>
              <div className="font-bold">€14.90</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 px-4 py-8">
          <div className="border-b border-gray-400 pb-4">
            <div className="flex justify-between">
              <div>{paymentState.plan} Subscription</div>
              <div>€{paymentState.subscriptionPrice}</div>
            </div>
            {paymentState.thermometer && (
              <div className="flex justify-between">
                <div>NC° Thermometer Gen2</div>
                {paymentState.thermometerPrice > 0 && (
                  <div>€{paymentState.thermometerPrice}</div>
                )}
                {!paymentState.thermometerPrice && <div>Free</div>}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <div>Shipping</div>
              <div>Free</div>
            </div>
            <div className="flex justify-between font-bold">
              <div>Total</div>
              <div>
                €{total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DropinWrapper
        paymentRequested={(payload) => onPaymentRequest(payload)}
      />
    </div>
  );
}
Payment.getLayout = function getLayout(page: React.ReactElement) {
  return <NavBar>{page}</NavBar>;
};
export default Payment;

