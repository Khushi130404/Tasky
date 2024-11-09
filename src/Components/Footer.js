import React, { useRef } from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  const footerRef = useRef(null);

  const handleMouseMove = (e) => {
    const footer = footerRef.current;
    if (footer) {
      const { width, height, left, top } = footer.getBoundingClientRect();

      const x = e.clientX - left;
      const y = e.clientY - top;

      const xPercent = (x / width) * 100;
      const yPercent = (y / height) * 100;

      footer.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
    }
  };

  return (
    <footer
      className={styles.footer}
      ref={footerRef}
      onMouseMove={handleMouseMove}
    >
      <div className={styles.footer_container}>
        <div className={styles.footerSection}>
          <h2 className={styles.footer_title}>Task List</h2>
          <p>
            Stay organized and boost your productivity with our Task List App.
            Easily manage your daily tasks, set priorities, and track your
            progress all in one place.
          </p>
        </div>
        <div className={`${styles.footerSection} ${styles.footerMargin}`}>
          <h3>Navigation</h3>
          <ul className={styles.footer_navList}>
            <li>Home</li>
            <li>About Us</li>
            <li>Services</li>
            <li>Contact</li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h3>Information</h3>
          <p>+91 7433933113</p>
          <p>todolist219@gmail.com</p>
          <p>Vadodara, Gujarat, India</p>
        </div>
        <div className={styles.footerSection}>
          <h3>Contact Hours</h3>
          <p>Mon - Thu: 8:00 - 21:00</p>
          <p>Fri: 8:00 - 20:00</p>
          <p>Sat: 10:00 - 23:00</p>
          <p>Sun: Closed</p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; 2024 All rights reserved | Block is made by Khushi Patel</p>
        <div className={styles.footer_socialIcons}>
          <img src="/facebook.svg" alt="Facebook" className="socialIcon" />
          <img src="/twitter.svg" alt="Twitter" className="socialIcon" />
          <img src="/instagram.svg" alt="Instagram" className="socialIcon" />
          <img src="/linkedin.svg" alt="LinkedIn" className="socialIcon" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
