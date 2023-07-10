import React, { useEffect, useState } from "react";
import RootLayout from "../../components/layout";
import styles from "../../styles/category/catcreate.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Cookies from "js-cookie";
//notification imports
import * as io from "socket.io-client";
import { useRouter } from "next/router";
//firebase
import { db } from "../../firebase.config";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

const socket = io("http://localhost:8010");

export default function category() {
  const [data, setData] = useState({
    namee: "",
    description: "",
  });
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    mobile: "",
  });
  const router = useRouter();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

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
    setIsFormSubmitted(true);

    //check if name is empty or has less than 3 characters or has any special characters
    if (
      data.namee === "" ||
      data.namee.length < 3 ||
      !data.namee.match(/^[a-zA-Z ]*$/)
    ) {
      return;
    }

    //check if description is empty or has less than 3 characters or has any special characters
    if (
      data.description === "" ||
      data.description.length < 3 ||
      !data.description.match(/^[a-zA-Z ]*$/)
    ) {
      // show error message below description field without toast
      return;
    }

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
      toast.success("Category created successfully!", {
        position: toast.POSITION.TOP_CENTER,
      });

      socket.emit("newCategory", response.data);

      // firebase
      const collectionRef = collection(db, "categories");
      const payload = {
        name: data.namee,
        description: data.description,
        created_at: serverTimestamp(),
      };
      const docRef = await addDoc(collectionRef, payload);

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
      //wait for 2 seconds before redirecting
      setTimeout(() => {
        router.push("/category");
      }, 3000);
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
                onChange={(e) => setData({ ...data, namee: e.target.value })}
                name="namee"
                className={styles.inputField}
                placeholder="Name"
                minLength={3}
              />
              {isFormSubmitted &&
                (data.namee === "" ||
                  data.namee.length < 3 ||
                  !data.namee.match(/^[a-zA-Z ]*$/)) && (
                  <p className={styles.error}>
                    Invalid category name. Please enter a valid category name.
                  </p>
                )}
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
              {isFormSubmitted &&
                (data.description === "" ||
                  data.description.length < 3 ||
                  !data.description.match(/^[a-zA-Z ]*$/)) && (
                  <p className={styles.error}>
                    Invalid description. Please enter a valid description.
                  </p>
                )}
            </label>
            {/* show error message of description field */}
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
