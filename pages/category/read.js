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
//* rsuite table
// import "rsuite-table/lib/less/index.less"; // or
// import { Table, Column, HeaderCell, Cell } from "rsuite-table";
// import "rsuite-table/dist/css/rsuite-table.css";
//* mui datagrid
import { DataGrid } from "@mui/x-data-grid";

//notification handle
import io from "socket.io-client";
const sockett = io.connect("http://localhost:8010");

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
  // const [socket, setSocket] = useState(null);
  // const socket = io("http://localhost:8010", {
  //   transports: ["websocket"],
  //   upgrade: false,
  // });
  // socket.on("connection", () => {
  //   console.log("connected");
  // });

  // socket.on("categoryAdded", () => {
  //   toast.success("New category added!", {
  //     position: toast.POSITION.TOP_CENTER,
  //   });
  // });

  //notification

  useEffect(() => {
    // if (sockett === null) {
    //   const newSocket = io.connect("http://localhost:8010");
    //   setSocket(newSocket);
    // }

    // if (sockett) {
    //   // socket.once("categoryAdded", (category) => {
    //   //   toast.success("New category added!", {
    //   //     position: toast.POSITION.TOP_CENTER,
    //   //   });
    //   // });
    //   // socket.off("categoryAdded", (category) => {
    //   //   console.log("off");
    //   // });
    //   const handleCategoryAdded = (category) => {
    //     toast.success("New category added!", {
    //       position: toast.POSITION.TOP_CENTER,
    //     });
    //     socket.off("categoryAdded", handleCategoryAdded);
    //   };
    //   socket.once("categoryAdded", handleCategoryAdded);

    socket.on("categoryAdded", () => {
      toast.success("New category added!", {
        position: toast.POSITION.TOP_CENTER,
      });
      getcategories();
    });
    // }
    // }

    socket.on("categoryUpdated", (category) => {
      toast.info("Category updated!", {
        position: toast.POSITION.TOP_CENTER,
      });
      getcategories();
    });
    //   socket.off("categoryUpdated", (category) => {
    //     console.log("off");
    //   });

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
    // }, []);
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
        {/* <Table
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
        </Table> */}
        {categories.length > 0 ? (
          <DataGrid
            columns={columns}
            rows={rows}
            pageSize={5}
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
