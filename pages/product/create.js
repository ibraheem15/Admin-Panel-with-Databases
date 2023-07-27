import React, { useEffect, useState } from "react";
import RootLayout from "../../components/layout";
import styles from "../../styles/product/create.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Link from "next/dist/client/link";
import { useRouter } from "next/router";
import io from "socket.io-client";
import Cookies from "js-cookie";
const socket = io.connect("http://localhost:8010");
//firebase
import { db } from "../../firebase.config";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

export default function category() {
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  const getProducts = async () => {
    axios.get("http://localhost/api/product/index.php").then((res) => {
      console.log(res.data);
      setProducts(res.data);
    });
  };

  const getCategories = async () => {
    axios.get("http://localhost/api/category/index.php").then((res) => {
      console.log(res.data);
      setCategories(res.data);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);

    //form validation
    if (!data.name || !data.price || !data.category_id) {
      return;
    }

    //name validation
    if (
      data.name.length < 3 ||
      data.name.length > 20 ||
      !data.name.match(/^[a-zA-Z]+$/)
    ) {
      return;
    }

    //description validation
    if (
      data.description.length < 3 ||
      data.description.length > 100 ||
      !data.description.match(/^[a-zA-Z]+$/)
    ) {
      return;
    }

    //if name already exists in database, do not create
    const found = products.find((element) => element.name === data.name);
    if (found) {
      return;
    }

    try {
      // const response = await axios.post(
      //   "http://localhost/api/product/index.php",
      //   data
      // );
      // console.log(response.data);
      // toast.success("Product created successfully", {
      //   position: toast.POSITION.TOP_CENTER,
      //   autoClose: 2800,
      // });

      // socket.emit("newProduct", response.data);

      axios.post("http://localhost/api/product/index.php", data).then((res) => {
        console.log(res.data);
        toast.success("Product created successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        socket.emit("newProduct", res.data);
      });

      //firebase
      const docRef = await addDoc(collection(db, "products"), {
        name: data.name,
        description: data.description,
        price: data.price,
        category_id: data.category_id,
        created_at: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);

      if (docRef.id) {
        toast.success("Product created successfully!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2800,
        });
        router.push("/product/read");
        return;
      }

      //notificiation in database
      axios
        .post("http://localhost/api/notifications/index.php", {
          user_id: Cookies.get("id"),
          message: "New Product added",
          created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
        })
        .then((res) => {
          console.log(res.data);
        });

      setTimeout(() => {
        router.push("/product/read");
      }, 3000);
    } catch (error) {
      console.log(error);
      toast.error("Product creation failed", {
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
          <h1 className={styles.catTitle}>Create New Product</h1>
          <form className={styles.catForm} onSubmit={handleSubmit}>
            <label className={styles.formLabel}>
              <input
                type="text"
                required
                onChange={(e) => setData({ ...data, name: e.target.value })}
                name="name"
                className={styles.inputField}
                placeholder="Name"
                minLength={3}
              />
              {isFormSubmitted &&
                (data.name === "" ||
                  data.name.length < 3 ||
                  data.name.length > 20 ||
                  !data.name.match(/^[a-zA-Z]+$/)) && (
                  <p className={styles.error}>
                    Name must be between 3 and 20 characters long and must
                    contain only alphabets
                  </p>
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
              {isFormSubmitted &&
                (data.description === "" ||
                  data.description.length < 3 ||
                  data.description.length > 100 ||
                  !data.description.match(/^[a-zA-Z]+$/)) && (
                  <p className={styles.error}>
                    Description must be between 3 and 100 characters long and
                    must contain only alphabets
                  </p>
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
                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                    className={styles.soption}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
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
