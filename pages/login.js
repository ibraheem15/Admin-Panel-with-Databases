import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import axios from "axios";
import styles from "../styles/login.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RootLayout from "../components/layout";
import Cookies from "js-cookie";
import { useRouter } from "next/dist/client/router";
import { route } from "next/dist/server/router";
import { useDispatch,useSelector } from "react-redux";
import authSlice, { logIn, logOut } from "../redux/features/authSlice";

export default function Login() {
  const [data, setData] = useState({});
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("user");
    if (token) {
      router.push("/");
    }
    getusers();
  }, []);

  const getusers = async () => {
    axios
      .get("http://localhost/api/user/index.php", {
        headers: {
          Authorization: `Bearer ${Cookies.get("user")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //form validation
    if (data.email === undefined || data.password === undefined)
      return alert("Please fill in all fields");

    //check if email is valid
    if (
      !data.email.match(
        /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})+$/
      )
    )
      return alert("Please enter a valid email address");

    //check if password is valid
    if (data.password.length < 6)
      return alert("Password must be at least 6 characters");

    //password must contain at least one number and one letter and one special character
    if (
      !data.password.match(
        /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/
      )
    )
      return alert(
        "Password must contain at least one number and one letter and one special character"
      );

    //check if user exists
    const user = users.find(
      (user) => user.email === data.email && user.password === data.password
    );

    if (user) {
      dispatch(logIn(user));

      // set cookie
      Cookies.set("user", JSON.stringify(user), { expires: 1 });
      console.log(user);
      //show toast message
      toast.success("Login Successful", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2800,
      });

      //wait 3 seconds before redirecting
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } else {
      console.log("No Match");
      //show toast message
      toast.error("Invalid Username or Password", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2800,
      });
    }
  };

  return (
    <RootLayout>
      <body className={styles.body}>
        <ToastContainer />
        <div className={styles.login}>
          <h1 className={styles.loginTitle}>Please Log In</h1>
          {/* <h1 className={styles.loginTitle}>
            {auth.username ? auth.username : ""}
          </h1> */}
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <label className={styles.formLabel}>
              <input
                type="text"
                required
                onChange={(e) => setData({ ...data, email: e.target.value })}
                name="email"
                className={styles.inputField}
                placeholder="Email"
                minLength={3}
              />
            </label>
            <label className={styles.formLabel}>
              <input
                type="password"
                className={styles.inputField}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                required
                placeholder="Password"
              />
            </label>
            <div className={styles.submitButtonWrapper}>
              <Link href="/signup">
                <a className={styles.Link}>
                  <button type="button" className={styles.submitButton1}>
                    Sign Up
                  </button>
                </a>
              </Link>

              <button type="submit" className={styles.submitButton2}>
                Sign In
              </button>
            </div>
          </form>
        </div>
      </body>
    </RootLayout>
  );
}
