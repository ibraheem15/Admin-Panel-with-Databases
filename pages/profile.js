import React, { useState, useEffect } from "react";
import Link from "next/link";
import RootLayout from "../components/layout";

import styles from "../styles/profile/profile.module.css";
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
//firebase
import { db } from "../firebase.config";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
//joyride
import { useAppContext } from "../components/Tourcontext";
import { useMount } from "react-use";
import Joyride, { CallBackProps } from "react-joyride";

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
  const [isformsubmitted, setisformsubmitted] = useState(false);
  const [prevData, setPrevData] = useState({});

  const handleUpdate = async (e) => {
    e.preventDefault();
    setisformsubmitted(true);

    //form validation
    if (
      data.username === undefined ||
      data.email === undefined ||
      data.password === undefined ||
      data.mobile === undefined
    )
      return;
    //check if email is valid
    if (
      !data.email.match(
        /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})+$/
      )
    )
      return;
    //check if password is valid
    if (data.password.length < 6) return;
    //check if mobile is valid with numbers only
    if (!data.mobile.match(/^[0-9]+$/)) return;

    //check if mobile is valid with 11 numbers
    if (data.mobile.length !== 11) return;

    //password validation
    if (
      !data.password.match(
        /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/
      )
    )
      return;

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
          // socket.emit("updateUser", res.data);
          toast.success("Profile Updated Successfully", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
          });
        });
    } catch (error) {
      console.log(error);
    }

    try {
      //firebase
      const docRef = collection(db, "users");
      const q = query(docRef, where("username", "==", prevData.username));
      const querySnapshot = await getDocs(q);

      const users = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      console.log(users);

      users.forEach(async (user) => {
        updateDoc(doc(db, "users", user.id), {
          username: data.username,
          email: data.email,
          password: data.password,
          mobile: data.mobile,
          updated_at: serverTimestamp(),
        });
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

    //update user in cookies
    Cookies.set(
      "user",
      JSON.stringify({
        id: data.id,
        username: data.username,
        email: data.email,
        password: data.password,
        mobile: data.mobile,
      })
    );
  };

  const getUser = async () => {
    console.log(user);

    if (user.id !== null) {
      //get user from cookies
      setData({
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        mobile: user.mobile,
      });
      setPrevData({
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        mobile: user.mobile,
      });
    } else {
      const cookuser = Cookies.get("user");
      if (cookuser) {
        const user = JSON.parse(cookuser);
        console.log(user);
        dispatch(
          logIn({
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password,
            mobile: user.mobile,
          })
        );
        setPrevData({
          id: user.id,
          username: user.username,
          email: user.email,
          password: user.password,
          mobile: user.mobile,
        });
      }
    }
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

  //joyride
  const {
    setState,
    state: { tourActive },
  } = useAppContext();

  useMount(() => {
    // if (tourActive) {
    setState({ run: true, stepIndex: 1 });
    // }
  });

  const steps = [
    {
      target: "#profile_update",
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
            Profile Update
          </h1>
          <p>
            This form allows you to{" "}
            <span style={{ fontWeight: "bold" }}>update</span> your profile
            information.
          </p>
        </>
      ),
    },
  ];

  const handleCallback = (data) => {
    const { status, type, index } = data;
    const finishedStatuses = ["finished", "skipped"];
    if (finishedStatuses.includes(status)) {
      setState({ run: false, tourActive: false });
      router.push("/");
    }
  };

  const showPassword = () => {
    const x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
    
  };

  return (
    <RootLayout>
      <Joyride
        steps={steps}
        continuous={true}
        callback={handleCallback}
        run={
          // if route has query param tour=true then run the tour
          router.query.tour === "true" ? true : false
        }
      />
      <div
        className={styles.container}
        style={{
          fontFamily: "sans-serif",
        }}
      >
        <h1 className={styles.title}>Profile</h1>
        <div className={styles.category}>
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

          <form
            className={styles.catForm}
            onSubmit={handleUpdate}
            id="profile_update"
          >
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
              {isformsubmitted &&
                (data.username === "" ||
                  data.username.length < 3 ||
                  data.username.length > 20 ||
                  !data.username.match(/^[a-zA-Z0-9]+$/)) && (
                  <span className={styles.error}>Invalid Username</span>
                )}
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
              {isformsubmitted &&
                (data.email === "" ||
                  data.email.length < 3 ||
                  !data.email.match(
                    /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,})$/
                  )) && <span className={styles.error}>Invalid Email</span>}
            </label>
            <label className={styles.passwordlabel}>
              <input
                type="password"
                onChange={(e) => setData({ ...data, password: e.target.value })}
                name="password"
                className={styles.inputField}
                placeholder="Password"
                minLength={3}
                value={data.password}
                id="password"
              />
              {isformsubmitted &&
                (data.password === "" ||
                  data.password.length < 8 ||
                  !data.password.match(
                    /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/
                  )) && (
                  <span className={styles.error}>
                    Password must contain at least 8 characters, including
                    UPPER/lowercase and numbers and special characters
                  </span>
                )}
              <span
                className={styles.showPassword}
                onClick={showPassword}
                id="showPassword"
              >
                <img
                  width="18"
                  height="18"
                  src="https://img.icons8.com/fluency-systems-filled/48/visible.png"
                  alt="visible"
                />
              </span>
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
              {isformsubmitted &&
                (data.mobile === "" ||
                  data.mobile.length !== 11 ||
                  !data.mobile.match(/^[0-9]+$/)) && (
                  <span className={styles.error}>Invalid Mobile</span>
                )}
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
