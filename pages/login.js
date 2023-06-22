import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import axios from "axios";
import styles from "../styles/login.module.css";

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
  const [valid, setValid] = useState(false);

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
    users.map((user) => {
      if (user.username === data.username && user.password === data.password) {
        console.log("match");
        window.location.href = "/";
        setValid(true);
        // set token
        // setToken(user);
        // const token = user;
        // setToken(token);
      }
    });
    if (!valid) {
      //create label for invalid login
      const label = document.createElement("label");
      label.innerHTML = "Invalid Login";
      label.style.color = "red";
      label.style.fontSize = "12px";
      label.style.fontWeight = "bold";
      label.style.marginTop = "10px";
      label.style.marginBottom = "10px";
      const form = document.querySelector("form");
      form.appendChild(label);

      //remove label after 3 seconds
      setTimeout(() => {
        label.remove();
      }
      , 3000);

      
    }

  };

  return (
    <div className={styles.login}>
      <h1 className={styles.loginTitle}>Please Log In</h1>
      <form className={styles.loginForm}>
        <label className={styles.formLabel}>
          <p>Username</p>
          <input
            type="text"
            className={styles.inputField}
            onChange={(e) => setData({ ...data, username: e.target.value })}
            required
          />
        </label>
        <label className={styles.formLabel}>
          <p>Password</p>
          <input
            type="password"
            className={styles.inputField}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            required
          />
        </label>
        <div className={styles.submitButtonWrapper}>
          <button
            type="submit"
            className={styles.submitButton}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </form>
      <div className={styles.loginWrapper}>
        <Link href="/signup">
          <a className={styles.signupLink}>Sign Up</a>
        </Link>
      </div>
    </div>
  );
}

// Login.propTypes = {
//   setToken: PropTypes.func.isRequired,
// };
