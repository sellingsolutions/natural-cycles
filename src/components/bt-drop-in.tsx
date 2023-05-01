/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

"use client";

import React, { useEffect, useRef } from "react";
import { create as createDropin, Dropin } from "braintree-web-drop-in";
import { Portal } from "./portal";
import { CardPayment } from "../types";

const DropinWrapper = (props: {
  paymentRequested: (payload: CardPayment) => void;
}) => {
  const [state, setState] = React.useState<{
    dropin: Dropin | null;
    show: boolean;
  }>({
    dropin: null,
    show: false,
  });
  const dropinContainerRef = useRef<HTMLDivElement>(null);

  const requestPayment = React.useCallback(() => {
    const callback = (
      requestPaymentMethodErr: any, payload: any
    ) => {
      console.log("requestPaymentMethodErr", requestPaymentMethodErr);
      console.log("payload", payload);

      if (requestPaymentMethodErr) {
        console.error(requestPaymentMethodErr);
      }
      // Submit payload.nonce to your server
      props.paymentRequested(payload);
      state.dropin?.teardown((error) => {
        console.log("teardown error", error);
        setState({ ...state, dropin: null, show: false });
      });
    };
    if (state.dropin) {
      state.dropin.requestPaymentMethod(callback);
    }
  }, [props, state.dropin]);

  useEffect(() => {
    if (dropinContainerRef.current && !state.dropin) {
      createDropin({
        // Insert your tokenization key here
        authorization: "sandbox_x6jqgjjw_rstzj8wcvc7z8cbf",
        container: dropinContainerRef.current,
      })
        .then((instance) => {
          setState({ ...state, dropin: instance });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [state]);

  return (
    <div>
      {state.show && (
        <Portal container={document.body}>
          <div
            className="h-screen w-screen"
            onClick={() => setState({ ...state, show: false })}
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="fixed inset-0 flex flex-col items-center justify-center">
              <div ref={dropinContainerRef} />
              <button
                className="w-24 rounded-lg bg-primary py-2 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  requestPayment();
                }}
              >
                Pay
              </button>
            </div>
          </div>
        </Portal>
      )}

      <button
        className="w-24 rounded-lg bg-primary py-2 text-white"
        onClick={() => setState({ ...state, show: true })}
      >
        Pay
      </button>
    </div>
  );
};

export default DropinWrapper;
