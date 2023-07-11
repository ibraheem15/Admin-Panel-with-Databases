import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/navbar.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useRouter } from "next/dist/client/router";
import { useSelector } from "react-redux";

export function SignoutButton() {
  const router = useRouter();

  const handleSIgnOut = () => {
    //remove token/cookie
    Cookies.remove("user");
    toast.success("Successfully logged out");
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  };

  if (router.pathname === "/login") return null;
  if (router.pathname === "/register") return null;

  return (
    <button onClick={handleSIgnOut} className={styles.button}>
      Sign out
    </button>
  );
}

export default function Nav() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    mobile: "",
  });
  const router = useRouter();

  const handleToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  const userRedux = useSelector((state) => state.auth);


  // const getUser = async () => {
  //   const user = await Cookies.get("user");
  //   if (user) {
  //     setUser(JSON.parse(user));
  //   }
  // };

  useEffect(() => {
    // getUser();
    // console.log(userRedux);
    userRedux && setUser(userRedux);
    //if redux is empty, get from cookie
    if (userRedux.id === null) {
      console.log("redux is empty");
      const user = Cookies.get("user");
      if (user) {
        setUser(JSON.parse(user));
      }
    }

    console.log(userRedux);
  }, []);

  return (
    <nav className={styles.navbar_container}>
      <div>
        <Link href="/">
          <img
            width="50"
            height="50"
            src="https://img.icons8.com/external-flat-berkahicon/64/external-E-commerce-e-commerce-flat-berkahicon.png"
            alt="external-E-commerce-e-commerce-flat-berkahicon"
            style={{
              marginLeft: "30px",
              cursor: "pointer",
            }}
          />
        </Link>
      </div>
      <ToastContainer />

      <div className={styles.bars} onClick={handleToggle}>
        <div
          className={`${styles.bar} ${isNavOpen ? styles.bar1_active : ""}`}
        ></div>
        <div
          className={`${styles.bar} ${isNavOpen ? styles.bar2_active : ""}`}
        ></div>
        <div
          className={`${styles.bar} ${isNavOpen ? styles.bar3_active : ""}`}
        ></div>
      </div>

      <ul
        className={`${styles.nav_items} ${
          isNavOpen ? styles.nav_items_active : ""
        }`}
      >
        <div className={styles.login_register}>
          {/* <Link href="/login">
            <a
              className={styles.button}
              onClick={toast.success("Sign Out Successfully")}
            >
              Sign Out
            </a>
          </Link> */}
          <span className={styles.button1}>Welcome, {user.username}</span>
          <SignoutButton />

        </div>
      </ul>
    </nav>
  );
}
