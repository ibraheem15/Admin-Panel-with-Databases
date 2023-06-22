import axios from "axios";
import React, { useState } from "react";
import styles from "../styles/signup.module.css";
import Link from "next/link";

function signup() {
  const [data, setData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios
        .post("http://localhost/api/user/save", data)
        .then((res) => {
          console.log(res.data);
          //redirect to login page
          window.location.href = "/login";
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  return (
    // <div className={styles.login}>
    //   <h1 className="">Please Sign Up</h1>
    //   <form onSubmit={handleSubmit}>
    //     <label>
    //       <p>Username</p>
    //       <input type="text" required onChange={handleChange} name="username" />
    //     </label>
    //     <label>
    //       <p>Password</p>
    //       <input
    //         type="password"
    //         required
    //         onChange={handleChange}
    //         name="password"
    //       />
    //     </label>
    //     <label>
    //       <p>Mobile</p>
    //       <input type="text" required onChange={handleChange} name="mobile" />
    //     </label>
    //     <div>
    //       <button type="submit">Submit</button>
    //     </div>
    //   </form>
    // </div>
    <div className={styles.login}>
      <h1 className={styles.loginTitle}>Please Sign Up</h1>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <label className={styles.formLabel}>
          <p>Username</p>
          <input
            type="text"
            required
            onChange={handleChange}
            name="username"
            className={styles.inputField}
          />
        </label>
        <label className="formLabel">
          <p>Password</p>
          <input
            type="password"
            required
            onChange={handleChange}
            name="password"
            className={styles.inputField}
          />
        </label>
        <label className="formLabel">
          <p>Mobile</p>
          <input
            type="text"
            required
            onChange={handleChange}
            name="mobile"
            className={styles.inputField}
          />
        </label>
        <div className={styles.submitButtonWrapper}>
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </div>
      </form>
      {/* login */}
      <div className={styles.loginWrapper}>
        <Link href="/login">
          <a className={styles.signupLink}>Log In</a>
        </Link>
      </div>
    </div>
  );
}

export default signup;
