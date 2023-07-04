import React, { useEffect, useState } from "react";
import * as io from "socket.io-client";
import axios from "axios";
import RootLayout from "../../components/layout";
import styles from "../../styles/notification/read.module.css";
//table imports
import { DataGrid } from "@mui/x-data-grid";

export default function Read() {
  const [Notifications, setNotifications] = useState([]);

  useEffect(() => {
    console.log(new Date().toISOString().slice(0, 19).replace("T", " "));
    getNotifications();
  }, []);

  const getNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost/api/notifications/index.php"
      );
      const data = response.data;
      setNotifications(data);
    } catch (error) {
      console.log(error);
    }
  };

  const rows = Notifications.map((item,index) => {
    const { id, ...rest } = item;
    return { id: index+1, ...rest };    

  });

  const GridColDef = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "user_id", headerName: "User ID", width: 130 },
    { field: "message", headerName: "Message", width: 230 },
    { field: "created_at", headerName: "Created At", width: 130 },
  ];

  return (
    <RootLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Notifications</h1>
        <div className={styles.dataGridWrapper}>
          <DataGrid rows={rows} columns={GridColDef} />
        </div>
      </div>
    </RootLayout>
  );
}
