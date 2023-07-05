import React, { useEffect, useState } from "react";
import RootLayout from "../../components/layout";
import styles from "../../styles/product/create.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Link from "next/dist/client/link";
import { useRouter } from "next/router";
import io from "socket.io-client";

export default function category() {
  const [data, setData] = useState({});
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (socket === null) {
      const newSocket = io("http://localhost:8010");
      setSocket(newSocket);
    }

    if (socket) {
      socket.once("productAdded", (category) => {
        toast.success("New Product added!", {
          position: toast.POSITION.TOP_CENTER,
        });
      });

      socket.once("productUpdated", (category) => {
        toast.info("Product updated!", {
          position: toast.POSITION.TOP_CENTER,
        });
      });

      socket.on("productDeleted", (category) => {
        toast.warning("Product deleted!", {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    }

    getProducts();
    getCategories();
  }, [socket]);

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
    console.log(data);

    //if name already exists in database, do not create
    const found = products.find((element) => element.name === data.name);
    if (found) {
      toast.error("Product already exists!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/api/product/index.php",
        data
      );
      console.log(response.data);
      
      socket.emit("newProduct", response.data);

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
