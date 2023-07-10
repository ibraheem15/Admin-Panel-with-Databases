import axios from "axios";
import React, { useState, useEffect } from "react";
import styles from "../styles/signup.module.css";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RootLayout from "../components/layout";
import Cookies from "js-cookie";
import { useRouter } from "next/dist/client/router";
//firebase
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase.config";

function signup() {
  const [data, setData] = useState({});
  const [users, setUsers] = useState([]);
  const router = useRouter();
  //firebase
  const collectionRef = collection(db, "users");
  const [createuser, setCreateuser] = useState("");
  const [fusers, setFusers] = useState([]);

  useEffect(() => {
    const token = Cookies.get("user");
    if (token) {
      router.push("/");
    }
    getusers();
    getFusers();
  }, []);

  const getusers = async () => {
    axios.get("http://localhost/api/user/").then((res) => {
      // console.log(res.data);
      setUsers(res.data);
    });
  };

  const getFusers = async () => {
    const querySnapshot = await getDocs(collectionRef);
    const ffusers = querySnapshot.docs.map((doc) => doc.data());
    console.log(ffusers);
    setFusers(ffusers);
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
          "http://localhost/api/user/index.php",
          data
        );
        console.log(response.data);
        // Redirect to login page
        window.location.href = "/login";
      } catch (error) {
        console.log(error);
      }
    }

    //firebase
    try {
      const docRef = await addDoc(collectionRef, {
        username: data.username,
        email: data.email,
        password: data.password,
        mobile: data.mobile,
        createdAt: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);
      setCreateuser(docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  return (
    <RootLayout>
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
                pattern="[a-z0-9\s]+"
                minLength={3}
                title="Please enter a valid username with only lowercase letters e.g. abc123 "
              />
            </label>
            <label className={styles.formLabel}>
              <input
                type="text"
                required
                onChange={handleChange}
                name="email"
                className={styles.inputField}
                placeholder="Email"
                pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                minLength={3}
                title="Please enter a valid email address e.g. abc@abc.com"
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
                pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?=\S+$).{8,}$"
                title="Please enter a valid password with at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character e.g. Abcd123@"
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
                pattern="[0-9]{11}"
                title="Please enter a valid mobile number e.g. 01234567891"
              />
            </label>
            <div className={styles.submitButtonWrapper}>
              <Link href="/login">
                <a className={styles.Link}>
                  <button type="button" className={styles.submitButton2}>
                    Log In
                  </button>
                </a>
              </Link>

              <button type="submit" className={styles.submitButton1}>
                Sign Up
              </button>
              <ToastContainer />
            </div>
          </form>
        </div>
      </body>
    </RootLayout>
  );
}

export default signup;
