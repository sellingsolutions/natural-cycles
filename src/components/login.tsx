"use client";

import React from "react";
import { api } from "../utils/api";
import { useRouter } from "next/navigation";

export const Login = () => {
  const router = useRouter();
  const [ email, setEmail] = React.useState("");

  const getLatestOrderQuery = api.order.getLatestOrder.useMutation();
  const handleLogin = (email: string) => {
    getLatestOrderQuery.mutateAsync({ email })
      .then((latestOrder) => {
        if (latestOrder) router.push(`/orders/${latestOrder.id}`);
        else router.push("/payment");
      })
      .catch((err) => console.log(err));

    localStorage.setItem("token", email);    
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-secondary">
            Log in with your email
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Type in your email below
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="e.g. obama@whitehouse.gov"
                    required
                    value={email}
                    onKeyDown={(e) => { if (e.key === "Enter") handleLogin(email) }}
                    onInput={(e) => setEmail(e.currentTarget.value)}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <button
                  onClick={() => handleLogin(email)}
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                >
                  Logga in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
