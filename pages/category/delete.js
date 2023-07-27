import axios from "axios";
import React, { useState, useEffect } from "react";
import RootLayout from "../../components/layout";
import styles from "../../styles/category/catdelete.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function deletecat() {
  const [data, setData] = useState({});
  const handleDelete = async (e) => {
    console.log(data);
    e.preventDefault();
    try {
      axios
        .delete("http://localhost/api/category/index.php", data)
        .then((res) => {
          console.log(res.data);
          toast.success("Category deleted successfully!", {
            position: toast.POSITION.TOP_CENTER,
          });
        });
    } catch (err) {
      console.log(err);
      toast.error("Category not deleted!", {
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
          <h1 className={styles.catTitle}>Delete Category</h1>
          <form className={styles.catForm} onSubmit={handleDelete}>
            <label className={styles.formLabel}>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  name="oldname"
                  className={styles.inputField}
                  placeholder="Name"
                  minLength={3}
                />
                <span
                  className={styles.inputSpan}
                  style={{
                    margin: "10px 0px",
                  }}
                >
                  OR
                </span>
                <input
                  type="text"
                  onChange={(e) => setData({ ...data, id: e.target.value })}
                  name="id"
                  className={styles.inputField}
                  placeholder="Id"
                  minLength={1}
                />
              </div>
            </label>
            <div className={styles.submitButtonWrapper}>
              <button type="submit" className={styles.submitButton2}>
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </RootLayout>
  );
}
