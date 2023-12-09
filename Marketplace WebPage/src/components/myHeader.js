import React, { Component } from "react";
import logo from "../assets/logo.png";
import Image from "next/image";
import Link from "next/link";

export default function MyHeader() {
  return (
    <Link href="/" style={{ textDecoration: "none", color: "white" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          height: "10vh",
          width: "99vw",
          borderWidth: "0px 0px 1px 0px",
          borderStyle: "solid",
          borderColor: "gray",
        }}
      >
        <Image
          src={logo}
          alt="logo"
          style={{
            height: "100%",
            width: "auto",
          }}
          priority
        />
        <h3>{"Open Driving Monitor"}</h3>
      </div>
    </Link>
  );
}