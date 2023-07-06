import React, { useState, useEffect } from "react";
import Link from "next/link";
import RootLayout from "../components/layout";

import styles from "../styles/profile/product.module.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/dist/client/router";
//react redux
import { useSelector, useDispatch } from "react-redux";
import { logIn, logOut, updateUser } from "../redux/features/authSlice";
//react toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// io
import io from "socket.io-client";

export default function profile() {
  const [data, setData] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    mobile: "",
  });
  const user = useSelector((state) => state.auth);
  const router = useRouter();
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();

  const handleUpdate = async (e) => {
    e.preventDefault();

    //form validation
    if (
      data.username === undefined ||
      data.email === undefined ||
      data.password === undefined ||
      data.mobile === undefined
    )
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

    //check if mobile is valid with numbers only
    if (!data.mobile.match(/^[0-9]+$/)) return alert("Mobile must be numbers");

    //check if mobile is valid with 11 numbers
    if (data.mobile.length !== 11) return alert("Mobile must be 11 numbers");

    //password validation
    if (
      !data.password.match(
        /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/
      )
    )
      return alert(
        "Password must contain at least one letter, one number and one special character"
      );

    //update user on redux
    dispatch(
      updateUser({
        id: data.id,
        username: data.username,
        email: data.email,
        password: data.password,
        mobile: data.mobile,
      })
    );

    //update user on database
    try {
      axios
        .put("http://localhost/api/user/index.php?id=" + data.id, data)
        .then((res) => {
          console.log(res.data);
          socket.emit("updateUser", res.data);
        });
    } catch (error) {
      console.log(error);
    }

    //notificiation in database
    axios
      .post("http://localhost/api/notifications/index.php", {
        user_id: user.id,
        message: "Profile updated",
        created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      })
      .then((res) => {
        console.log(res.data);
      });
  };

  const getUser = async () => {
    console.log(user);
    setData({
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      mobile: user.mobile,
    });
  };

  useEffect(() => {
    //connect to socket
    if (socket === null) {
      const newSocket = io("http://localhost:8010", {
        transports: ["websocket"],
        upgrade: false,
      });
      setSocket(newSocket);
    }

    if (socket) {
      socket.on("userUpdated", (updatedCategory) => {
        //toastify
        toast.success("Profile Updated Successfully", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      });

      socket.off("userUpdated", (updatedCategory) => {
        console.log("off");
      });
    }

    getUser();

    return () => {
      if (socket) socket.off("userUpdated");
    };
  }, [socket]);

  return (
    <RootLayout>
      <div
        className={styles.container}
        style={{
          fontFamily: "sans-serif",
          marginTop: "80px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "40px",
            fontWeight: "bold",
            marginLeft: "10rem",
          }}
        >
          Profile
        </h1>
        <div className={styles.category}>
          {/* <h1 className={styles.catTitle}>Update Profile</h1> */}
          {/* image */}
          <div className={styles.catImage}>
            <img
              src="https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
              alt="profile"
              className={styles.catImage}
            />
            {/* button to change image */}
            <div className={styles.catImageBtnWrapper}>
              {/* <button className={styles.catImageBtn}>Change Image</button> */}
            </div>
          </div>
          {/* form */}

          <form className={styles.catForm} onSubmit={handleUpdate}>
            <label className={styles.formLabel}>
              <input
                type="text"
                required
                onChange={(e) => setData({ ...data, username: e.target.value })}
                name="username"
                className={styles.inputField}
                placeholder="Username"
                minLength={3}
                value={data.username}
              />
            </label>
            <label className={styles.formLabel}>
              <input
                type="email"
                required
                onChange={(e) => setData({ ...data, email: e.target.value })}
                name="email"
                className={styles.inputField}
                placeholder="Email"
                minLength={3}
                value={data.email}
              />
            </label>
            <label className={styles.formLabel}>
              <input
                type="password"
                required
                onChange={(e) => setData({ ...data, password: e.target.value })}
                name="password"
                className={styles.inputField}
                placeholder="Password"
                minLength={3}
                value={data.password}
              />
            </label>
            <label className={styles.formLabel}>
              <input
                type="text"
                required
                onChange={(e) => setData({ ...data, mobile: e.target.value })}
                name="mobile"
                className={styles.inputField}
                placeholder="Mobile"
                minLength={3}
                value={data.mobile}
              />
            </label>
            <div className={styles.submitButtonWrapper}>
              <button type="submit" className={styles.submitButton2}>
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </RootLayout>
  );
}
