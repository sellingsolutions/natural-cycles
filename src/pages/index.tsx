"use client";

import React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import router from "next/router";
import { Login } from "../components/login";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const isSSR = typeof window === "undefined";
  const [token, setToken] = React.useState<string | null>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  React.useEffect(() => {
    const token = !isSSR ? localStorage.getItem("token") : null;
    setToken(token);
  }, [isSSR]);

  const getLatestOrderQuery = api.order.getLatestOrder.useMutation();

  if (token && !loading) {
    setLoading(true);
    getLatestOrderQuery.mutateAsync({ email: token })
      .then((latestOrder) => {
        if (latestOrder) void router.push(`/orders/${latestOrder.id}`);
        else void router.push("/payment");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  return (
    <>
      <Head>
        <title>
          Natural Cycles Birth Control | No Hormones or Side Effects
        </title>
        <meta
          name="title"
          content="Natural Cycles Birth Control | No Hormones or Side Effects"
        ></meta>
        <meta
          name="description"
          content="Discover the first FDA Cleared birth control app with zero side effects, plus no prescription needed. Go hormone-free with Natural Cycles birth control today."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{!token && <Login />}</main>
    </>
  );
};

export default Home;
