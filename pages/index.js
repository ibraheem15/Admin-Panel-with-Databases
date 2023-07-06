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
        {/* <div className={styles.container}>
          <div class={styles.card}>
            <div class={styles.count}>
              <h3 class={styles.cardtitle}>Total Categories</h3>
              <div class={styles.counter}>{categories.length}</div>
            </div>
            <div class={styles.count1}>
              <h3 class={styles.cardtitle}>Recently Created Categories</h3>
              <div class={styles.counter1}>
                {
                  categories.filter((category) => {
                    const date = new Date(category.created_at);
                    const today = new Date();
                    const diffTime = Math.abs(today - date);
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );
                    if (diffDays <= 7) {
                      return category;
                    }
                  }).length
                }
              </div>
            </div>
          </div>
          <div class={styles.card}>
            <div class={styles.count}>
              <h3 class={styles.cardtitle}>Total Products</h3>
              <div class={styles.counter}>{products.length}</div>
            </div>

            <div class={styles.count1}>
              <h3 class={styles.cardtitle}>Recently Created Products</h3>
              <div class={styles.counter1}>
                {
                  products.filter((product) => {
                    const date = new Date(product.created_at);
                    const today = new Date();
                    const diffTime = Math.abs(today - date);
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );
                    if (diffDays <= 7) {
                      return product;
                    }
                  }).length
                }
              </div>
            </div>
          </div>
        </div> */}
        <div className={styles.card_container}>
          <div className={styles.card}>
            <div className={styles.img_section}></div>
            <div className={styles.card_desc}>
              <div className={styles.card_header}>
                <div className={styles.card_title}>Total Categories</div>
              </div>
              <div className={styles.card_time}>{categories.length}</div>
              <p className={styles.recent}>
                Last Week -<span> </span>
                {
                  categories.filter((category) => {
                    const date = new Date(category.created_at);
                    const today = new Date();
                    const diffTime = Math.abs(today - date);
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );
                    if (diffDays <= 7) {
                      return category;
                    }
                  }).length
                }
              </p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.img_section}></div>
            <div className={styles.card_desc}>
              <div className={styles.card_header}>
                <div className={styles.card_title}>Total Products</div>
              </div>
              <div className={styles.card_time}>{products.length}</div>
              <p className={styles.recent}>
                Last Week -<span> </span>
                {
                  products.filter((category) => {
                    const date = new Date(category.created_at);
                    const today = new Date();
                    const diffTime = Math.abs(today - date);
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );
                    if (diffDays <= 7) {
                      return category;
                    }
                  }).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}

export default index;
