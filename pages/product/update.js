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
    price: "",
    category_id: "",
  });
  const [Category, setCategory] = useState([]);
  const [Products, setProducts] = useState([]);
  // const socket = io("http://localhost:8010");
  const [socket, setSocket] = useState(null);
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
    if (socket === null) {
      const newSocket = io("http://localhost:8010", {
        transports: ["websocket"],
        upgrade: false,
      });
      setSocket(newSocket);
    }

    getCategory();
    getProduct();
    getUser();
    //get all data from api and then filter it by id
    axios.get("http://localhost/api/product/index.php").then((res) => {
      const result = res.data.filter(
        (item) => item.id == window.location.search.split("=")[1].split("&")[0]
      );
      setData({
        id: result[0].id,
        name: result[0].name,
        price: result[0].price,
        description: result[0].description,
        category_id: result[0].category_id,
      });
    });
  }, [socket]);

  const getCategory = async () => {
    try {
      axios.get("http://localhost/api/category/index.php").then((res) => {
        // console.log(res.data);
        setCategory(res.data);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getProduct = async () => {
    try {
      axios.get("http://localhost/api/product/index.php").then((res) => {
        // console.log(res.data);
        setProducts(res.data);
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

    if (
      data.name === "" ||
      data.name.length < 3 ||
      data.name.length > 20 ||
      !data.name.match(/^[a-zA-Z ]*$/)
    ) {
      console.log("name");
      return;
    }

    if (data.price === "") {
      return;
    }

    if (
      data.description === "" ||
      data.description.length < 3 ||
      data.description.length > 100 ||
      !data.description.match(/^[a-zA-Z ]*$/)
    ) {
      return;
    }

    const result = Products.filter((item) => item.name == data.name);
    console.log(result);
    if (result.length > 0) {
      toast.error("Product already exists!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    try {
      axios
        .put("http://localhost/api/product/index.php?id=" + data.id, data)
        .then((res) => {
          // console.log(res.data);
          socket.emit("updateProduct", res.data);
        });
        toast.info("Product updated!", {
          position: toast.POSITION.TOP_CENTER,
        });

      //notificiation in database
      axios
        .post("http://localhost/api/notifications/index.php", {
          user_id: user.id,
          message: "Product updated",
          created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
        })
        .then((res) => {
          console.log(res.data);
        });

      setTimeout(() => {
        router.push("/product/read");
      }, 3000);
    } catch (err) {
      toast.error("Product not updated!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <RootLayout>
      <div
        className={styles.container}
        style={{
          fontFamily: "sans-serif",
        }}
      >
        <ToastContainer />
        <div className={styles.category}>
          <h1 className={styles.catTitle}>Update Product</h1>
          <form className={styles.catForm} onSubmit={handleUpdate}>
            <label className={styles.formLabel}>
              <input
                type="text"
                required
                onChange={(e) => setData({ ...data, name: e.target.value })}
                name="name"
                className={styles.inputField}
                placeholder="Name"
                minLength={3}
                value={data.name}
              />
              {isFormSubmitted &&
                (data.name === "" ||
                  data.name.length < 3 ||
                  data.name.length > 20 ||
                  !data.name.match(/^[a-zA-Z ]*$/)) && (
                  <span className={styles.error}>
                    Name must be between 3 to 20 characters and must not contain
                    number or special characters
                  </span>
                )}
            </label>
            <label className={styles.formLabelPrice}>
              <span className={styles.rsSymbol}>Rs</span>
              <input
                type="number"
                required
                onChange={(e) => setData({ ...data, price: e.target.value })}
                name="price"
                className={styles.inputField}
                placeholder="Price"
                minLength={3}
                value={data.price}
              />
              {isFormSubmitted && data.price === "" && (
                <span className={styles.error}>
                  Price must be greater than 0
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
                rows="4"
                cols="50"
                value={data.description}
                required
              />
              {isFormSubmitted &&
                (data.description === "" ||
                  data.description.length < 3 ||
                  data.description.length > 20 ||
                  !data.description.match(/^[a-zA-Z ]*$/)) && (
                  <span className={styles.error}>
                    Description must be between 3 to 20 characters and must not
                    contain special characters
                  </span>
                )}
            </label>
            {/* display the available categories */}
            <label className={styles.formLabel}>
              <select
                className={styles.inputField}
                onChange={(e) =>
                  setData({ ...data, category_id: e.target.value })
                }
                style={{
                  cursor: "pointer",
                }}
              >
                <option value="" className={styles.soption}>
                  Select Category
                </option>
                {Category.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                    className={styles.soption}
                  >
                    {product.name}
                  </option>
                ))}
              </select>
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
