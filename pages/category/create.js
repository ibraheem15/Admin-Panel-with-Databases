import React, { useEffect, useState } from "react";
import RootLayout from "../../components/layout";
import styles from "../../styles/category/catcreate.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Cookies from "js-cookie";
//notification imports
import * as io from "socket.io-client";

export default function category() {
  const [data, setData] = useState({});
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    mobile: "",
  });


  useEffect(() => {
    getCategories();
    getUser();
    // notification
  }, []);

  const getUser = () => {
    const user = Cookies.get("user");
    if (user) {
      setUser(JSON.parse(user));
    }
    console.log(user);
  };

  const getCategories = async () => {
    axios.get("http://localhost/api/category/index.php").then((res) => {
      // console.log(res.data);
      setCategories(res.data);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);

    //if name already exists in database, do not create
    const found = categories.find((element) => element.name === data.namee);
    if (found) {
      toast.error("Category already exists!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/api/category/index.php",
        data
      );
      console.log(response.data);
    
      const socket = io("localhost:8010");
      socket.emit("newCategory", response.data);
      setData({});

      //add notification to database
      const notification = {
        user_id: user.id,
        message: "New Category Created",
        created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      };

      const response2 = await axios.post(
        "http://localhost/api/notifications/index.php",
        notification
      );
      console.log(notification);
    } catch (error) {
      console.log(error);
      toast.error("Category creation failed", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2800,
      });
    }
  };

  return (
    <RootLayout>
      <body
        className={styles.body}
        style={{
          marginTop: "70px",
        }}
      >
        <ToastContainer />
        <div className={styles.category}>
          <h1 className={styles.catTitle}>Create New Category</h1>
          <form className={styles.catForm} onSubmit={handleSubmit}>
            <label className={styles.formLabel}>
              <input
                type="text"
                required
                onChange={(e) => setData({ ...data, namee: e.target.value })}
                name="namee"
                className={styles.inputField}
                placeholder="Name"
                minLength={3}
              />
            </label>
            <label className={styles.formLabel}>
              <textarea
                className={styles.inputField}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                placeholder="Description"
                rows="4"
                cols="50"
              />
            </label>
            <div className={styles.submitButtonWrapper}>
              <button type="submit" className={styles.submitButton2}>
                Create
              </button>
            </div>
          </form>
        </div>
      </body>
    </RootLayout>
  );
}
