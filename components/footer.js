import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_container}>
        <div className={styles.footer_column}>
          <h3 className={styles.footer_logo}>About Us</h3>
          <p className={styles.footer_text}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut viverra
            eros id ante dignissim lacinia.
          </p>
        </div>
        <div className={styles.footer_column}>
          <h3 className={styles.footer_logo}>Contact</h3>
          <p className={styles.footer_text}>Email: hellowWorld@gmail.com</p>
          <p>Phone: +92123123123</p>
        </div>
        <div className={styles.footer_column}>
          <h3 className={styles.footer_logo}>Follow Us</h3>
          <div className={styles.social_icons}>
            <a href="#">
              <i>
                <img
                  width="30"
                  height="30"
                  src="https://img.icons8.com/ios-glyphs/250/ffffff/facebook-new.png"
                  alt="facebook-new"
                />
              </i>
            </a>
            <a href="#">
              <i className={""}>
                <img
                  width="30"
                  height="30"
                  src="https://img.icons8.com/ios-filled/250/ffffff/instagram-new--v1.png"
                  alt="instagram-new--v1"
                />
              </i>
            </a>
            <a href="#">
              <i className={""}>
                <img
                  width="30"
                  height="30"
                  src="https://img.icons8.com/ios-filled/250/ffffff/linkedin.png"
                  alt="linkedin"
                />
              </i>
            </a>
          </div>
        </div>
      </div>
      <div className={styles.footer_bottom}>
        <p>&copy; 2023 Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
}
