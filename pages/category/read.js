import React, { useState, useEffect } from "react";
import RootLayout from "../../components/layout";
import axios from "axios";
import styles from "../../styles/category/catread.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { Table, Column, HeaderCell, Cell } from "rsuite-table";
import Cookies from "js-cookie";
// import "rsuite-table/lib/less/index.less"; // or
import "rsuite-table/dist/css/rsuite-table.css";
import Link from "next/dist/client/link";

//notification handle
import io from "socket.io-client";

export default function read() {
  const [categories, setcategories] = useState([]);
  const router = useRouter();
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    mobile: "",
  });

  //notification

  useEffect(() => {
    if (socket === null) {
      const newSocket = io("http://localhost:8010");
      setSocket(newSocket);
    }

    if (socket) {
      socket.on("categoryAdded", (category) => {
        console.log("category added", category);
        toast.success("New category added!", {
          position: toast.POSITION.TOP_CENTER,
        });
      });

      socket.once("categoryUpdated", (category) => {
        console.log("category updated", category);
        toast.info("Category updated!", {
          position: toast.POSITION.TOP_CENTER,
        });
      });

      socket.on("categoryDeleted", (category) => {
        console.log("category deleted", category);
        toast.warning("Category deleted!", {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    }

    getcategories();
    getUser();
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

  function handleDelete(e, id) {
    e.preventDefault();
    try {
      axios
        .delete("http://localhost/api/category/index.php?id=" + id)
        .then((res) => {
          //notification
          // const socket = io("http://localhost:8010");
          socket.emit("deleteCategory", res.data);
          getcategories();
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

  return (
    <RootLayout>
      <div className={styles.container}>
        {/* <ToastContainer /> */}
        <div className={styles.title}>
          <h1>All Categories</h1>
        </div>

        {/* cards */}
        {/* <div className={styles.cardContainer}>
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
        </div> */}
        {/* <Table
          height={400}
          data={categories}
          onRowClick={(data) => {
            console.log(data);
          }}
        >
          <Column width={200} align="center" fixed>
            <HeaderCell>Category ID</HeaderCell>
            <Cell dataKey="id" />
          </Column>
          <Column width={200} align="center" fixed>
            <HeaderCell>Category Name</HeaderCell>
            <Cell dataKey="name" />
          </Column>

          <Column width={200} align="center">
            <HeaderCell>Category Description</HeaderCell>
            <Cell dataKey="description" />
          </Column>

          <Column width={200} fixed="right">
            <HeaderCell>Action</HeaderCell>

            <Cell>
              {(rowData) => {
                function handleAction(e) {
                  e.preventDefault();
                  handleEdit(e, rowData.id, rowData.name, rowData.description);
                }
                return (
                  <span>
                    <a onClick={handleAction}> Edit </a> |{" "}
                    <a onClick={(e) => handleDelete(e, rowData.id)}> Remove </a>
                  </span>
                );
              }}
            </Cell>
          </Column>
        </Table> */}
        <div className={styles.addContainer}>
          <Link href="/category/create">
            <img
              width="30"
              height="30"
              src="https://img.icons8.com/ios/50/plus-2-math.png"
              alt="plus-2-math"
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
        <Table
          height={400}
          width={800}
          data={categories}
          onRowClick={(data) => {
            console.log(data);
          }}
          className={styles.customTable}
        >
          <Column width={200} align="center">
            <HeaderCell>Sr No.</HeaderCell>
            {/* add index of each key */}
            <Cell>
              {(rowData, rowIndex) => {
                return <span>{rowIndex + 1}</span>;
              }}
            </Cell>
          </Column>
          <Column width={200} align="center">
            <HeaderCell>Category Name</HeaderCell>
            <Cell dataKey="name" />
          </Column>
          <Column width={200} align="center">
            <HeaderCell>Category Description</HeaderCell>
            <Cell dataKey="description" />
          </Column>
          <Column width={200} fixed="right">
            <HeaderCell
              style={{
                marginLeft: "25px",
              }}
            >
              Action
            </HeaderCell>
            <Cell>
              {(rowData) => {
                function handleAction(e) {
                  e.preventDefault();
                  handleEdit(e, rowData.id, rowData.name, rowData.description);
                }
                return (
                  <div className={styles.btnContainer}>
                    <button
                      className={styles.btn}
                      onClick={(e) =>
                        handleEdit(
                          e,
                          rowData.id,
                          rowData.name,
                          rowData.description
                        )
                      }
                    >
                      <img
                        width="20"
                        height="20"
                        src="https://img.icons8.com/pastel-glyph/64/create-new--v2.png"
                        alt="create-new--v2"
                      />
                    </button>
                    <button
                      className={styles.btn2}
                      onClick={(e) => handleDelete(e, rowData.id)}
                    >
                      <img
                        width="20"
                        height="20"
                        src="https://img.icons8.com/material-rounded/24/filled-trash.png"
                        alt="filled-trash"
                      />
                    </button>
                  </div>
                );
              }}
            </Cell>
          </Column>
        </Table>
      </div>
    </RootLayout>
  );
}
