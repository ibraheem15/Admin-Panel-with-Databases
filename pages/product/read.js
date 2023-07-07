import React, { useState, useEffect } from "react";
import RootLayout from "../../components/layout";
import axios from "axios";
import styles from "../../styles/product/read.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
//mui datagrid
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/dist/client/link";
//notification
import * as io from "socket.io-client";
const sockett = io.connect("http://localhost:8010");

export default function read() {
  const [category, setcategory] = useState([]);
  const [products, setproducts] = useState([]);
  const router = useRouter();
  const [socket, setSocket] = useState(sockett);

  useEffect(() => {
    // if (socket === null) {
    //   const newSocket = io("http://localhost:8010", {
    //     transports: ["websocket"],
    //     upgrade: false,
    //   });
    //   setSocket(newSocket);
    // }
    // if (socket) {
    socket.on("productAdded", (category) => {
      toast.success("New Product added!", {
        position: toast.POSITION.TOP_CENTER,
      });
      getproducts();
    });
    //   socket.off("productAdded", (category) => {
    //     console.log("productAdded");
    //   });

    socket.on("productUpdated", (category) => {
      toast.info("Product updated!", {
        position: toast.POSITION.TOP_CENTER,
      });
      getproducts();
    });
    // socket.off("productUpdated", (category) => {
    //   console.log("productUpdated");
    // });

    //   const handleProductUpdated = (product) => {
    //     toast.info("Product updated!", {
    //       position: toast.POSITION.TOP_CENTER,
    //     });
    //     socket.off("productUpdated", handleProductUpdated);
    //   };
    //   socket.once("productUpdated", handleProductUpdated);

    socket.on("productDeleted", (category) => {
      toast.warning("Product deleted!", {
        position: toast.POSITION.TOP_CENTER,
      });
      getproducts();
    });
    // }

    getproducts();
    getcategory();

    return () => {
      if (socket) {
        socket.off("productUpdated");
        socket.off("productAdded");
        socket.off("productDeleted");
      }
    };
  }, [socket]);

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

  const deleteproduct = async (id) => {
    console.log(id);
    try {
      axios
        .delete("http://localhost/api/product/index.php?id=" + id)
        .then((res) => {
          socket.emit("deleteProduct", id);
          getproducts();
        });
    } catch (error) {
      console.log(error);
    }

    //notificiation in database
    axios
      .post("http://localhost/api/notifications/index.php", {
        user_id: Cookies.get("id"),
        message: "Product deleted",
        created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      })
      .then((res) => {
        console.log(res.data);
      });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Product Name",
      width: 150,
      editable: true,
    },
    {
      field: "price",
      headerName: "Price",
      width: 100,
      editable: true,
    },
    {
      field: "category_id",
      headerName: "Category ID",
      width: 150,
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      editable: true,
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <img
              width="30"
              height="30"
              src="https://img.icons8.com/pastel-glyph/64/create-new--v2.png"
              alt="edit"
              style={{}}
              className={styles.img1}
              onClick={() => {
                router.push({
                  pathname: "/product/update",
                  query: {
                    id: params.row.id,
                    name: params.row.name,
                    price: params.row.price,
                    category_id: params.row.category_id,
                    description: params.row.description,
                  },
                });
              }}
            />
            <img
              width="30"
              height="30"
              src="https://img.icons8.com/material-rounded/60/filled-trash.png"
              alt="delete"
              className={styles.img2}
              onClick={() => deleteproduct(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  const rows = products.map((product) => {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      category_id: product.category_id,
      description: product.description,
    };
  });

  return (
    <RootLayout>
      <div className={styles.container}>
        <ToastContainer />
        <div className={styles.title}>
          <h1>All Products</h1>
        </div>
        {/* add product */}
        <div className={styles.addContainer}>
          <Link href="/product/create">
            <img
              width="30"
              height="30"
              src="https://img.icons8.com/ios/50/plus-2-math.png"
              alt="plus-2-math"
              style={{ cursor: "pointer" }}
            />
          </Link>
          <span
            style={{
              marginTop: "3px",
              marginLeft: "10px",
              fontSize: "20px",
            }}
          >
            Add Product
          </span>
        </div>
        {/* if not product available then show image else show datagrid */}
        {products.length > 0 ? (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
          />
        ) : (
          <div className={styles.noProduct}>
            <img
              // src="https://callistoindia.com/images/no-products-found.png"
              src="https://thenounproject.com/api/private/icons/4440881/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0"
              // src="https://png.pngtree.com/png-clipart/20210711/original/pngtree-no-result-search-icon-png-image_6511543.jpg"
              alt="no-product"
              width="400"
              height="400"
            />
            <h1
              style={{
                marginLeft: "50px",
                marginTop: "-30px",
              }}
            >
              No Products Found
            </h1>
          </div>
        )}
      </div>
    </RootLayout>
  );
}
