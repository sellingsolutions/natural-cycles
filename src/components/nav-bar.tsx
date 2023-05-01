/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import Image from "next/image";
import logo from "../assets/nc-logo.svg"
import router from "next/router";

export const NavBar = ({ children }: React.PropsWithChildren) => {
  const onLogout = () => {
    localStorage.removeItem("token");
    void router.push("/");
  }

  return (
    <>
      <div className="flex items-center justify-between bg-primary px-8 py-4">
        <Image priority src={logo} alt="" />
        <div className="flex items-center py-2 px-4 rounded-xl bg-white font-bold text-pink-800 cursor-pointer" onClick={(e) => {
          e.stopPropagation();
          onLogout()
        }}>Log out</div>
      </div>
      {children}
    </>
  );
};