import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/navbar.module.css";

export default function Nav() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <nav className={styles.navbar_container}>
      <div>
        <Link href="/">
          <a className={styles.logo_container}>Logo</a>
        </Link>
      </div>

      <div className={styles.bars} onClick={handleToggle}>
        <div
          className={`${styles.bar} ${isNavOpen ? styles.bar1_active : ""}`}
        ></div>
        <div
          className={`${styles.bar} ${isNavOpen ? styles.bar2_active : ""}`}
        ></div>
        <div
          className={`${styles.bar} ${isNavOpen ? styles.bar3_active : ""}`}
        ></div>
      </div>

      <ul
        className={`${styles.nav_items} ${
          isNavOpen ? styles.nav_items_active : ""
        }`}
      >
        <li className={styles.nav_link}>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li className={styles.nav_link}>
          <a href="#">Service</a>
        </li>
        <li className={styles.nav_link}>
          <a href="#">Projects</a>
        </li>
        <li className={styles.nav_link}>
          <a href="#">About</a>
        </li>
        <div className={styles.login_register}>
          <Link href="/login">
            <a className={styles.button}>Sign Out</a>
          </Link>
          {/* <Link href="/signup">
            <a className={styles.button}>Register</a>
          </Link> */}
        </div>
      </ul>
    </nav>
  );
}
