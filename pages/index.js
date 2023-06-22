import React, { useState, useEffect } from "react";
import Link from "next/link";
import Login from "./login";

function index() {
  const [token, setToken] = useState();

  // if(!token) {
  //   return <Login setToken={setToken} />
  // }
  return (
    <div>
      <h1>Dashboard</h1>
        <Link href="/login">
            <a>Login</a>
        </Link>
    </div>
  );
}

export default index;
