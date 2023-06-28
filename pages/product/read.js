import React, { useState, useEffect } from "react";
import RootLayout from "../../components/layout";
import axios from "axios";
import styles from "../../styles/product/read.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

export default function read() {
  const [category, setcategory] = useState([]);
  const [products, setproducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getproducts();
    getcategory();
  }, []);

  const getproducts = async () => {
    axios.get("http://localhost/api/product/index.php").then((res) => {
      console.log(res.data);
      setproducts(res.data);
    });
  };

  const getcategory = async () => {
    axios.get("http://localhost/api/category/index.php").then((res) => {
      console.log(res.data);
      setcategory(res.data);
    });
  };

  //   const deleteproduct = async (id) => {
  //     axios
  //       .delete("http://localhost/api/product/delete.php?id=" + id)
  //       .then((res) => {
  //         console.log(res.data);
  //         toast.success("Product Deleted Successfully");
  //         getproducts();
  //       });
  //   };

  return (
    <RootLayout>
      <div className={styles.container}>
        <ToastContainer />
        <div className={styles.title}>
          <h1>All Products</h1>
        </div>
        {/* cards */}
        <div className={styles.cardContainer}>
          {products.map(
            (product) => (
              console.log(product),
              (
                <div className={styles.card}>
                  <h3>{product.name}</h3>
                  {/* category in h4 */}
                  {/* <h4>{product.category_id}</h4> */}

                  <p>{product.description}</p>

                  <div className={styles.price}>
                    <h4>Rs {product.price}</h4>
                    <div className={styles.btnContainer}>
                      <button
                        className={styles.btn}
                        onClick={(e) =>
                          handleEdit(
                            e,
                            product.id,
                            product.name,
                            product.price,
                            product.description
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        className={styles.btn2}
                        onClick={(e) => handleDelete(e, product.id)}
                      >
                        Delete
                      </button>
                    </div>
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
