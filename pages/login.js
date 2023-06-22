import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import axios from "axios";
import styles from "../styles/login.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// async function loginUser(credentials) {
//   return fetch("http://localhost:8080/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(credentials),
//   }).then((data) => data.json());
// }

export default function Login({ setToken }) {
  // const [username, setUsername] = useState();
  // const [password, setPassword] = useState();

  // const handleSubmit = async (e) => {
  //   if (username === undefined || password === undefined)
  //     return alert("Please fill in all fields");
  //   e.preventDefault();
  //   const token = await loginUser({
  //     username,
  //     password,
  //   });
  //   setToken(token);
  // };

  const [data, setData] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getusers();
  }, []);

  const getusers = async () => {
    axios.get("http://localhost/api/user/").then((res) => {
      // console.log(res.data);
      setUsers(res.data);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = users.find(
      (user) =>
        user.username === data.username && user.password === data.password
    );

    if (user) {
      console.log("Match");
      //show toast message
      toast.success("Login Successful", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2800,
      });

      //wait 3 seconds before redirecting
      setTimeout(() => {
        window.location.href = "/";
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
    <body className={styles.body}>
      <ToastContainer />

      <div className={styles.login}>
        <h1 className={styles.loginTitle}>Please Log In</h1>
        <form className={styles.loginForm}>
          <label className={styles.formLabel}>
            <input
              type="text"
              className={styles.inputField}
              onChange={(e) => setData({ ...data, username: e.target.value })}
              required
              placeholder="Username"
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
            <button type="button" className={styles.submitButton1}>
              <Link href="/signup" className={styles.Link}>
                <a className={styles.Link}>Sign Up</a>
              </Link>
            </button>
            <button
              type="submit"
              className={styles.submitButton2}
              onClick={handleSubmit}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </body>
  );
}

// Login.propTypes = {
//   setToken: PropTypes.func.isRequired,
// };
