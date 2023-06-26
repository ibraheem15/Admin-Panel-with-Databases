import React, { useState } from "react";
import styles from "../styles/sidebar.module.css";
// framer
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function sidebar() {
  const [showProduct, setShowProduct] = useState(false);
  const [showCategory, setShowCategory] = useState(false);

  const toggleProduct = () => {
    setShowProduct(!showProduct);
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
            <Link href="/">
              <span className={styles.list_title}>
                Dashboard
              </span>
            </Link>
          </li>
        </ul>
        <ul className={styles.sidebar__list}>
          <li>
            <span className={styles.list_title} onClick={toggleCategory}>
              Category
              <motion.span
                animate={{ rotate: showCategory ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-chevron-down"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8
                  10.293l5.646-5.647a.5.5 0 1 1 .708.708l-6
                  6a.5.5 0 0 1-.708
                  0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </motion.span>
            </span>
            <AnimatePresence>
              {showCategory && (
                <motion.ul
                  className={styles.list_inner}
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className={styles.list_inner_content}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href="/category/create">
                      <li>Create Category</li>
                    </Link>
                    <Link href="/category/read">
                      <li>Read Category</li>
                    </Link>
                    <Link href="/category/update">
                      <li>Update Category</li>
                    </Link>
                    <Link href="/category/delete">
                      <li>Delete Category</li>
                    </Link>
                  </motion.div>
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        </ul>
        <ul className={styles.sidebar__list}>
          <li>
            <span className={styles.list_title} onClick={toggleProduct}>
              Product
              <motion.span
                animate={{ rotate: showProduct ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-chevron-down"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8
                  10.293l5.646-5.647a.5.5 0 1 1 .708.708l-6
                  6a.5.5 0 0 1-.708
                  0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </motion.span>
            </span>
            <AnimatePresence>
              {showProduct && (
                <motion.ul
                  className={styles.list_inner}
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className={styles.list_inner_content}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href="/product/create">
                      <li>Create Product</li>
                    </Link>
                    <Link href="/product/read">
                      <li>Read Product</li>
                    </Link>
                    <Link href="/product/update">
                      <li>Update Product</li>
                    </Link>
                    <Link href="/product/delete">
                      <li>Delete Product</li>
                    </Link>
                  </motion.div>
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        </ul>
      </div>
    </div>
  );
}
