import React, { useState, useEffect } from "react";
import Link from "next/link";
import RootLayout from "../components/layout";

import styles from "../styles/index.module.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/dist/client/router";

//react redux
import { useSelector, useDispatch } from "react-redux";

export default function profile() {
  return (
    <RootLayout>
      <div
        style={{
          marginTop: "80px",
          marginLeft: "250px",
          fontFamily: "sans-serif",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "40px",
            fontWeight: "bold",
          }}
        >
          Profile
        </h1>
      </div>
    </RootLayout>
  );
}
