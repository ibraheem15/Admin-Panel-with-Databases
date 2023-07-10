import React, { useState, useEffect } from "react";
import RootLayout from "../../components/layout";
import axios from "axios";
import styles from "../../styles/category/catread.module.css";
import { useRouter } from "next/router";
import Link from "next/dist/client/link";
import Cookies from "js-cookie";
//* toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//* mui datagrid
import { DataGrid } from "@mui/x-data-grid";

//notification handle
import io from "socket.io-client";
const sockett = io.connect("http://localhost:8010");
//firebase
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase.config";

export default function read() {
  const [categories, setcategories] = useState([]);
  const router = useRouter();
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    mobile: "",
  });
  const [socket, setSocket] = useState(sockett);
  const [prevData, setPrevData] = useState({});

  useEffect(() => {
    socket.on("categoryAdded", () => {
      toast.success("New category added!", {
        position: toast.POSITION.TOP_CENTER,
      });
      getcategories();
    });

    socket.on("categoryUpdated", (category) => {
      toast.info("Category updated!", {
        position: toast.POSITION.TOP_CENTER,
      });
      getcategories();
    });

    socket.on("categoryDeleted", (category) => {
      toast.warning("Category deleted!", {
        position: toast.POSITION.TOP_CENTER,
      });
      getcategories();
    });

    getcategories();
    getUser();

    return () => {
      if (socket) {
        socket.off("categoryAdded");
        socket.off("categoryUpdated");
        socket.off("categoryDeleted");
      }
    };
  }, [socket]);

  const getcategories = async () => {
    axios.get("http://localhost/api/category/index.php").then((res) => {
      console.log(res.data);
      setcategories(res.data);
    });
  };

  const getUser = () => {
    const user = Cookies.get("user");
    if (user) {
      setUser(JSON.parse(user));
    }
    console.log(user);
  };

  function handleEdit(e, id, name, description) {
    e.preventDefault();
    //route to edit page wihtout reloading
    router.push({
      pathname: "/category/update",
      query: { id: id, name: name, description: description },
    });
  }

  function handleDelete(id) {
    //id is only the sr no of the table
    //get id of the category
    id = categories[id - 1].id;
    try {
      axios
        .delete("http://localhost/api/category/index.php?id=" + id)
        .then((res) => {
          toast.warning("Category deleted!", {
            position: toast.POSITION.TOP_CENTER,
          });
          socket.emit("deleteCategory", res.data);
          getcategories();
        });

      categories.forEach(async (category) => {
        if (category.id == id) {
          console.log(category);
          const docRef = collection(db, "categories");
          const q = query(docRef, where("name", "==", category.name));
          const querySnapshot = await getDocs(q);
          console.log(querySnapshot);
          console.log(category.name);

          const categories = querySnapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          });
          console.log(categories);

          categories.forEach((category) => {
            deleteDoc(doc(db, "categories", category.id));
          });
        }
      });

      //notification in database
      axios
        .post("http://localhost/api/notifications/index.php", {
          user_id: user.id,
          message: "Category deleted",
          created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
        })
        .then((res) => {
          console.log(res.data);
        });
    } catch (err) {
      console.log(err);
      toast.error("Category not deleted!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

  const columns = [
    { field: "id", headerName: "Category ID", width: 200 },
    { field: "name", headerName: "Category Name", width: 200 },
    { field: "description", headerName: "Category Description", width: 200 },
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
              style={{
                cursor: "pointer",
              }}
              className={styles.img1}
              onClick={() => {
                let cid = categories[params.row.id - 1].id;
                router.push({
                  pathname: "/category/update",
                  query: {
                    id: cid,
                    name: params.row.name,
                    description: params.row.description,
                  },
                });
              }}
            />
            <img
              width="30"
              height="30"
              src="https://img.icons8.com/material-rounded/65/filled-trash.png"
              alt="delete"
              className={styles.img2}
              onClick={() => {
                handleDelete(params.row.id);
              }}
            />
          </>
        );
      },
    },
  ];

  //rows with id as sr no
  const rows = categories.map((category, index) => {
    return {
      id: index + 1,
      name: category.name,
      description: category.description,
    };
  });

  return (
    <RootLayout>
      <div className={styles.container}>
        {/* <ToastContainer /> */}
        <div className={styles.title}>
          <h1>All Categories</h1>
        </div>

        <div className={styles.addContainer}>
          <Link href="/category/create">
            <img
              width="30"
              height="30"
              src="https://img.icons8.com/ios/50/plus-2-math.png"
              alt="plus-2-math"
              style={{
                cursor: "pointer",
              }}
            />
          </Link>
          <span
            style={{
              marginTop: "3px",
              marginLeft: "10px",
              fontSize: "20px",
            }}
          >
            Add Category
          </span>
        </div>

        {categories.length > 0 ? (
          <DataGrid
            columns={columns}
            rows={rows}
            pageSize={5}
            checkboxSelection
            disableSelectionOnClick
            className={styles.datatable}
          />
        ) : (
          <div className={styles.noProduct}>
            <img
              src="https://thenounproject.com/api/private/icons/4440881/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0"
              alt="no-product"
              width="400"
              height="400"
            />
            <h1
              style={{
                marginLeft: "30px",
                marginTop: "-20px",
              }}
            >
              No Categories Found
            </h1>
          </div>
        )}
      </div>
    </RootLayout>
  );
}
