import React, { useState, useEffect } from "react";
import Link from "next/link";
import Login from "./login";
import RootLayout from "../components/layout";

function index() {
  const [token, setToken] = useState();

  // if(!token) {
  //   return <Login setToken={setToken} />
  // }
  return (
    <RootLayout>
      <div style={{ marginTop: "70px" }}>
        <h1 style={{ marginTop: "100px", marginBottom:"50px",textAlign:"center" }}>Dashboard</h1>
        <h3 style={{ marginTop: "50px", marginBottom:"150px",textAlign:"center" }}>
          What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing
          and typesetting industry. Lorem Ipsum has been the industry's standard
          dummy text ever since the 1500s, when an unknown printer took a galley
          of type and scrambled it to make a type specimen book. It has survived
          not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in
          the 1960s with the release of Letraset sheets containing Lorem Ipsum
          passages, and more recently with desktop publishing software like
          Aldus PageMaker including versions of Lorem Ipsum.
        </h3>
        <h3 style={{ marginTop: "50px", marginBottom:"150px",textAlign:"center" }}>
          What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing
          and typesetting industry. Lorem Ipsum has been the industry's standard
          dummy text ever since the 1500s, when an unknown printer took a galley
          of type and scrambled it to make a type specimen book. It has survived
          not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in
          the 1960s with the release of Letraset sheets containing Lorem Ipsum
          passages, and more recently with desktop publishing software like
          Aldus PageMaker including versions of Lorem Ipsum.
        </h3>
      </div>
    </RootLayout>
  );
}

export default index;
