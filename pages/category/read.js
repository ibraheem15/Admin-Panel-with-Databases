import React, { useState, useEffect } from "react";
import RootLayout from "../../components/layout";
import axios from "axios";
import styles from "../../styles/catread.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/dist/client/link";
import { useRouter } from "next/router";
import Update from "./update";

export default function read() {
  const [categories, setcategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getcategories();
  }, []);

  const getcategories = async () => {
    axios.get("http://localhost/api/category/index.php").then((res) => {
      console.log(res.data);
      setcategories(res.data);
    });
  };

  function handleEdit(e, id, name, description) {
    e.preventDefault();
    //route to edit page wihtout reloading
    router.push({
      pathname: "/category/update",
      query: { id: id, name: name, description: description },
    });

  }

  function handleDelete(e, id) {
    e.preventDefault();
    try {
      axios
        .delete("http://localhost/api/category/index.php?id=" + id)
        .then((res) => {
          console.log(res.data);
          toast.success("Category deleted successfully!", {
            position: toast.POSITION.TOP_CENTER,
          });
          getcategories();
        });
    } catch (err) {
      console.log(err);
      toast.error("Category not deleted!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

  return (
    <RootLayout>
      <div
        style={{
          marginTop: "70px",
          marginLeft: "250px",
          fontFamily: "sans-serif",
        }}
      >
        <ToastContainer />
        <div className={styles.title}>
          <h1>All Categories</h1>
        </div>
        {/* cards */}
        <div className={styles.cardContainer}>
          {categories.map(
            (category) => (
              console.log(category),
              (
                <div className={styles.card}>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>

                  <div className={styles.btnContainer}>
                    <button
                      className={styles.btn}
                      onClick={(e) =>
                        handleEdit(
                          e,
                          category.id,
                          category.name,
                          category.description
                        )
                      }
                    >
                      Edit
                    </button>
                    <button
                      className={styles.btn2}
                      onClick={(e) => handleDelete(e, category.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </RootLayout>
  );
}
