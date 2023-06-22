import axios from "axios";
import React, { useState, useEffect } from "react";
import styles from "../styles/signup.module.css";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function signup() {
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

  const showToastMessage = () => {
    toast.success("Success Notification !", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userExists = users.find((user) => user.username === data.username);

    if (userExists) {
      toast.error("User already exists", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2800,
      });
    } else {
      try {
        const response = await axios.post(
          "http://localhost/api/user/save",
          data
        );
        console.log(response.data);
        // Redirect to login page
        window.location.href = "/login";
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  return (
    <body className={styles.body}>
      <div className={styles.login}>
        <h1 className={styles.loginTitle}>Please Sign Up</h1>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <label className={styles.formLabel}>
            <input
              type="text"
              required
              onChange={handleChange}
              name="username"
              className={styles.inputField}
              placeholder="Username"
            />
          </label>
          <label className={styles.formLabel}>
            <input
              type="password"
              required
              onChange={handleChange}
              name="password"
              className={styles.inputField}
              placeholder="Password"
            />
          </label>
          <label className={styles.formLabel}>
            <input
              type="text"
              required
              onChange={handleChange}
              name="mobile"
              className={styles.inputField}
              placeholder="Mobile"
            />
          </label>
          <div className={styles.submitButtonWrapper}>
            <button type="button" className={styles.submitButton2}>
              <Link href="/login">
                <a className={styles.Link}>Log In</a>
              </Link>
            </button>
            <button type="submit" className={styles.submitButton1}>
              Sign Up
            </button>
            <ToastContainer />
          </div>
        </form>
      </div>
    </body>
  );
}

export default signup;
