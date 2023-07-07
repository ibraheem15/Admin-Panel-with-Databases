import axios from "axios";
import React, { useState, useEffect } from "react";
import RootLayout from "../../components/layout";
import styles from "../../styles/category/catupdate.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
//notification imports
import * as io from "socket.io-client";

export default function update() {
  const [data, setData] = useState({
    name: "",
    description: "",
  });

  const [categories, setCategories] = useState([]);
  // const socket = io("http://localhost:8010");
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    mobile: "",
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (socket === null) {
      const newSocket = io("http://localhost:8010", {
        transports: ["websocket"],
        upgrade: false,
      });
      setSocket(newSocket);
    }

    getCategory();
    getUser();
    //get all data from api and then filter it by id
    axios.get("http://localhost/api/category/index.php").then((res) => {
      const result = res.data.filter(
        (item) => item.id == window.location.search.split("=")[1].split("&")[0]
      );
      setData({
        id: result[0].id,
        name: result[0].name,
        description: result[0].description,
      });
    });
  }, [socket]);

  const getCategory = async () => {
    try {
      axios.get("http://localhost/api/category/index.php").then((res) => {
        // console.log(res.data);
        setCategories(res.data);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getUser = () => {
    const user = Cookies.get("user");
    if (user) {
      setUser(JSON.parse(user));
    }
    console.log(user);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);

    if (!data.name || !data.description) {
      return;
    }

    if (data.name.length < 3 || data.description.length < 3) {
      return;
    }

    if (data.name.length > 20 || data.description.length > 100) {
      return;
    }
    // !data.namee.match(/^[a-zA-Z ]*$/)) && (
    if (
      !data.name.match(/^[a-zA-Z ]*$/) ||
      !data.description.match(/^[a-zA-Z ]*$/)
    ) {
      return;
    }

    const result = categories.filter((item) => item.name == data.name);
    console.log(result);
    if (result.length > 0) {
      toast.error("Category already exists!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    try {
      axios
        .put("http://localhost/api/category/index.php?id=" + data.id, data)
        .then((res) => {
          // console.log(res.data);
          toast.info("Category updated!", {
            position: toast.POSITION.TOP_CENTER,
          });
          socket.emit("updateCategory", res.data);
        });

      //notificiation in database
      axios
        .post("http://localhost/api/notifications/index.php", {
          user_id: user.id,
          message: "Category updated",
          created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
        })
        .then((res) => {
          console.log(res.data);
        });

      setTimeout(() => {
        router.push("/category/read");
      }, 3000);
    } catch (err) {
      toast.error("Category not updated!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <RootLayout>
      <div className={styles.container}>
        <ToastContainer />
        <div className={styles.category}>
          <h1 className={styles.catTitle}>Update Category</h1>
          <form className={styles.catForm} onSubmit={handleUpdate}>
           
            <label className={styles.formLabel}>
              <input
                type="text"
                required
                onChange={(e) => setData({ ...data, name: e.target.value })}
                name="namee"
                className={styles.inputField}
                placeholder="New Name"
                minLength={3}
                value={data.name}
              />
              {isFormSubmitted &&
                (data.name === "" ||
                  data.name.length < 3 ||
                  data.name.length > 20 ||
                  data.name.match(/^[a-zA-Z]+$/) == null) && (
                  <span className={styles.error}>
                    Name must be between 3 to 20 characters and must not be
                    contain any special characters or numbers!
                  </span>
                )}
            </label>
            <label className={styles.formLabel}>
              <textarea
                className={styles.inputField}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                placeholder="Description"
                rows="3"
                cols="50"
                value={data.description}
              />
              {isFormSubmitted &&
                (data.description === "" ||
                  data.description.length < 3 ||
                  data.description.length > 100 ||
                  data.description.match(/^[a-zA-Z]+$/) == null) && (
                  <span className={styles.error}>
                    Description must be between 3 to 100 characters and must not
                    be contain any special characters or numbers!
                  </span>
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
