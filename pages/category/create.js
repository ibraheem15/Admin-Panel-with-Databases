import React, { useState } from "react";
import RootLayout from "../../components/layout";
import styles from "../../styles/catcreate.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/dist/client/link";
import axios from "axios";

export default function category() {
  const [data, setData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);

    try {
      const response = await axios.post(
        "http://localhost/api/category/index.php",
        data
      );
      console.log(response.data);
      toast.success("Category created successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2800,
      });
      // Redirect to login page
      // window.location.href = "/category";
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
