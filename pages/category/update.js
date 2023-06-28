import axios from "axios";
import React, { useState, useEffect } from "react";
import RootLayout from "../../components/layout";
import styles from "../../styles/category/catupdate.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function update() {
  const [data, setData] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategory();
    //get all data from api and then filter it by id
    axios.get("http://localhost/api/category/index.php").then((res) => {
      console.log(res.data);
      const result = res.data.filter(
        (item) => item.id == window.location.search.split("=")[1].split("&")[0]
      );
      console.log(result);
      setData({
        id: result[0].id,
        name: result[0].name,
        description: result[0].description,
      });
    });

  }, []);

  const getCategory = async () => {
    try {
      axios
        .get("http://localhost/api/category/index.php")
        .then((res) => {
          console.log(res.data);
          setCategories(res.data);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

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
          console.log(res.data);
          toast.success("Category updated successfully!", {
            position: toast.POSITION.TOP_CENTER,
          });
        });
    } catch (err) {
      toast.error("Category not updated!", {
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
          <h1 className={styles.catTitle}>Update Category</h1>
          <form className={styles.catForm} onSubmit={handleUpdate}>
            {/* <label className={styles.formLabel}>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  onChange={(e) =>
                    setData({ ...data, oldname: e.target.value })
                  }
                  name="oldname"
                  className={styles.inputField}
                  placeholder="Old Name"
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
            </label> */}
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
