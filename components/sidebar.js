import React, { useState, useEffect } from "react";
import styles from "../styles/sidebar.module.css";
// framer
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
//notification imports
import * as io from "socket.io-client";
import axios from "axios";
import { useRouter } from "next/dist/client/router";
//joyride
import Joyride, { CallBackProps } from "react-joyride";
// import { steps } from "./Toursteps";
import { Tsteps } from "./Toursteps";
//Cookie
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";
//redux
import { useSelector, useDispatch } from "react-redux";
import { setTour } from "../redux/features/Tour";
import { useAppContext } from "./Tourcontext";
import { useMount } from "react-use";

export default function sidebar() {
  const [showProduct, setShowProduct] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [Notifications, setNotifications] = useState([]);
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleProduct = () => {
    setShowProduct(!showProduct);
  };

  const toggleCategory = () => {
    setShowCategory(!showCategory);
  };

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  const getNotifications = () => {
    axios.get("http://localhost/api/notifications/index.php").then((res) => {
      setNotifications(res.data);
    });
  };

  useEffect(() => {
    getNotifications();
    const cookieValue = Cookies.get("user");
    if (cookieValue) {
      setLoggedIn(true);
    }
  }, []);

  const {
    setState,
    state: { run, stepIndex, steps, tourActive },
  } = useAppContext();

  const startTour = () => {
    setState({ run: true, tourActive: true, stepIndex: 0 });
  };

  useMount(() => {
    setState({
      steps: [
        {
          target: "#dashboard",
          content: (
            <>
              <h1
                style={{
                  textAlign: "center",
                  fontSize: "30px",
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                }}
              >
                Dashboard
              </h1>
              <p>
                Welcome to the Dashboard! This is the main page of your
                application where you can monitor and view the amount of data.
              </p>
            </>
          ),
        },
        {
          target: "#categories",
          content: (
            <>
              <h1
                style={{
                  textAlign: "center",
                  fontSize: "30px",
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                }}
              >
                Categories
              </h1>
              <p>
                This section displays the categories in your application. You
                can add, edit, or delete categories from here.
              </p>
            </>
          ),
        },
        {
          target: "#products",
          content: (
            <>
              <h1
                style={{
                  textAlign: "center",
                  fontSize: "30px",
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                }}
              >
                Products
              </h1>
              <p>
                This section displays the products in your application. You can
                add, edit, or delete products from here.
              </p>
            </>
          ),
        },
        {
          target: "#notification",
          content: (
            <>
              <h1
                style={{
                  textAlign: "center",
                  fontSize: "30px",
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                }}
              >
                Notification
              </h1>
              <p>
                This section shows{" "}
                <span style={{ fontWeight: "bold" }}>notifications</span>{" "}
                related to your application with total number of notifications
                displayed in front of it
              </p>
            </>
          ),
        },
        {
          target: "#profile",
          content: (
            <>
              <h1
                style={{
                  textAlign: "center",
                  fontSize: "30px",
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                }}
              >
                Profile
              </h1>
              <p>
                This section allows you to view and update your{" "}
                <span style={{ fontWeight: "bold" }}>profile</span> information.
              </p>
            </>
          ),
        },
        {
          target: "#signout",
          content: (
            <>
              <h1
                style={{
                  textAlign: "center",
                  fontSize: "30px",
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                }}
              >
                Sign Out
              </h1>
              <p>
                Clicking on this button will{" "}
                <span style={{ fontWeight: "bold" }}>sign you out</span> from
                the application.
              </p>
            </>
          ),
        },
        {
          target: "#nothing",
        },
      ],
    });
  });

  const handleCallback = (data) => {
    const { status, action, index, lifecycle, type } = data;
    const finishedStatuses = ["finished", "skipped"];
    if (finishedStatuses.includes(status)) {
      setState({ run: false, tourActive: false });
      router.push("/category/read?tour=true");
    }
  };

  return (
    <div className={`${isOpen ? styles.sidebar_active : styles.sidebar}`}>
      <button
        onClick={() => {
          setState({ run: true, tourActive: true, stepIndex: 0 });
        }}
        className={styles.start_tour}
      >
        Start Tour
      </button>
      <Joyride
        steps={steps}
        continuous={true}
        showSkipButton
        callback={handleCallback}
        run={run}
      />

      <div className={styles.sidebar__header}>
        <div
          className={`${isOpen ? styles.bars_active : styles.bars}`}
          onClick={toggleSidebar}
        >
          <div
            className={`${styles.bar} ${isOpen ? styles.bar1_active : ""}`}
          ></div>
          <div
            className={`${styles.bar} ${isOpen ? styles.bar2_active : ""}`}
          ></div>
          <div
            className={`${styles.bar} ${isOpen ? styles.bar3_active : ""}`}
          ></div>
        </div>
      </div>
      <div className={styles.sidebar__content}>
        <ul className={styles.sidebar__list} id="firststep">
          <li>
            <Link href="/">
              <span
                className={
                  router.pathname == "/"
                    ? styles.list_title_active
                    : styles.list_title
                }
                id="dashboard"
              >
                <span className={styles.list_title_icon}>
                  <img
                    width="19"
                    height="19"
                    src="https://img.icons8.com/ios/50/performance-macbook.png"
                    alt="performance-macbook"
                  />
                </span>
                Dashboard
              </span>
            </Link>
          </li>
        </ul>
        <ul className={styles.sidebar__list}>
          <li>
            <Link href="/category/read">
              <span
                className={
                  router.pathname.startsWith("/category")
                    ? styles.list_title_active
                    : styles.list_title
                }
                id="categories"
              >
                <span className={styles.list_title_icon}>
                  <img
                    width="19"
                    height="19"
                    src="https://img.icons8.com/ios-filled/50/diversity.png"
                    alt="diversity"
                  />
                </span>
                Category
              </span>
            </Link>

            {/* <span className={styles.list_title} onClick={toggleCategory}>
              Category
              <motion.span
                animate={{ rotate: showCategory ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-chevron-down"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8
                  10.293l5.646-5.647a.5.5 0 1 1 .708.708l-6
                  6a.5.5 0 0 1-.708
                  0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </motion.span>
            </span>
            <AnimatePresence>
              {showCategory && (
                <motion.ul
                  className={styles.list_inner}
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className={styles.list_inner_content}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href="/category/read">
                      <li>All Categories</li>
                    </Link>
                    <Link href="/category/create">
                      <li>Create Category</li>
                    </Link>
                    <Link href="/category/update">
                      <li>Update Category</li>
                    </Link>
                    <Link href="/category/delete">
                      <li>Delete Category</li>
                    </Link>
                  </motion.div>
                </motion.ul>
              )}
            </AnimatePresence> */}
          </li>
        </ul>
        <ul className={styles.sidebar__list}>
          <li>
            <Link href="/product/read">
              <span
                className={
                  router.pathname.startsWith("/product")
                    ? styles.list_title_active
                    : styles.list_title
                }
                id="products"
              >
                <span className={styles.list_title_icon}>
                  <img
                    width="19"
                    height="19"
                    src="https://img.icons8.com/material-outlined/24/product.png"
                    alt="product"
                  />
                </span>
                Product
              </span>
            </Link>
            {/* <span className={styles.list_title} onClick={toggleProduct}>
              Product
              <motion.span
                animate={{ rotate: showProduct ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-chevron-down"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8
                  10.293l5.646-5.647a.5.5 0 1 1 .708.708l-6
                  6a.5.5 0 0 1-.708
                  0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </motion.span>
            </span>
            <AnimatePresence>
              {showProduct && (
                <motion.ul
                  className={styles.list_inner}
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className={styles.list_inner_content}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href="/product/create">
                      <li>Create Product</li>
                    </Link>
                    <Link href="/product/read">
                      <li>Read Product</li>
                    </Link>
                    <Link href="/product/update">
                      <li>Update Product</li>
                    </Link>
                    <Link href="/product/delete">
                      <li>Delete Product</li>
                    </Link>
                  </motion.div>
                </motion.ul>
              )}
            </AnimatePresence> */}
          </li>
        </ul>
        <ul className={styles.sidebar__list}>
          <li>
            <Link href="/notification/read">
              <span
                className={
                  router.pathname.startsWith("/notification")
                    ? styles.list_title_active
                    : styles.list_title
                }
                onClick={toggleNotification}
                id="notification"
              >
                <span className={styles.list_title_icon}>
                  <img
                    width="19"
                    height="19"
                    src="https://img.icons8.com/material-sharp/24/appointment-reminders--v1.png"
                    alt="appointment-reminders--v1"
                  />
                </span>
                Notification
                <span className={styles.list_title_iconn}>
                  {Notifications.length > 0 ? Notifications.length : null}
                </span>
              </span>
            </Link>
          </li>
        </ul>
        <ul className={styles.sidebar__list}>
          <li>
            <Link href="/profile">
              <span
                className={
                  router.pathname.startsWith("/profile")
                    ? styles.list_title_active
                    : styles.list_title
                }
                onClick={toggleNotification}
                id="profile"
              >
                <span className={styles.list_title_icon}>
                  <img
                    width="23"
                    height="23"
                    src="https://img.icons8.com/ios/50/user-male-circle--v1.png"
                    alt="user-male-circle--v1"
                  />
                </span>
                Profile
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
