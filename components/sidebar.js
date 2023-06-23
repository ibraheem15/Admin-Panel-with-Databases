import React, { useState } from "react";
import styles from "../styles/sidebar.module.css";

export default function sidebar() {
  const [showHome, setShowHome] = useState(false);
  const [showCategory, setShowCategory] = useState(false);

  const toggleHome = () => {
    setShowHome(!showHome);
  };

  const toggleCategory = () => {
    setShowCategory(!showCategory);
  };
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar__header}>
        <h3 className={styles.sidebar__title}>Sidebar</h3>
      </div>
      <div className={styles.sidebar__content}>
        <ul className={styles.sidebar__list}>
          <li>
            <span className={styles.list_title} onClick={toggleHome}>
              Home
            </span>

            {showHome && (
              <ul className={styles.list_inner}>
                <div className={styles.list_inner_content}>
                  <li>Home #1</li>
                  <li>Home #2</li>
                  <li>Home #3</li>
                </div>
              </ul>
            )}
          </li>
        </ul>
        <ul className={styles.sidebar__list}>
          <li>
            <span className={styles.list_title} onClick={toggleCategory}>
              Home
            </span>

            {showCategory && (
              <ul className={styles.list_inner}>
                <div className={styles.list_inner_content}>
                  <li>Home #1</li>
                  <li>Home #2</li>
                  <li>Home #3</li>
                </div>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
