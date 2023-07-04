import React, { useState, useEffect } from "react";
import Link from "next/link";
import RootLayout from "../components/layout";
// import Sidebar from "../components/sidebar";
import styles from "../styles/index.module.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/dist/client/router";

function index() {
  const [token, setToken] = useState();
  const [categories, setcategories] = useState([]);
  const [products, setproducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("user");
    if (!token) {
      router.push("/login");
    }

    getcategories();
    getproducts();
  }, []);

  const getcategories = async () => {
    axios.get("http://localhost/api/category/index.php").then((res) => {
      // console.log(res.data);
      setcategories(res.data);
    });
  };

  const getproducts = async () => {
    axios.get("http://localhost/api/product/index.php").then((res) => {
      console.log(res.data);
      setproducts(res.data);
    });
  };

  // if(!token) {
  //   return <Login setToken={setToken} />
  // }
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
          Dashboard
        </h1>
        <div className={styles.container}>
          {/* counter for categories */}
          <div class={styles.card}>
            <h3 class={styles.cardtitle}>Categories</h3>
            <div class={styles.counter}>{categories.length}</div>
          </div>
          <div class={styles.card}>
            <h3 class={styles.cardtitle}>Products</h3>
            <div class={styles.counter}>
              {/* counter for products */}
              {products.length}
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}

export default index;
