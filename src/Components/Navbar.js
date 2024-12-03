import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <div className={styles.navbar_outer}>
      <div className={styles.navbar}>
        <nav>
          <ul>
            <li>
              <Link to="/Feature" className={styles.nav_link}>
                <div>
                  <img src="dash_nav.svg"></img>
                  Dashboard
                </div>
              </Link>
            </li>
            <li>
              <Link to="/MyActivity" className={styles.nav_link}>
                <div>
                  <img
                    style={{ height: "23px", marginLeft: "-1px" }}
                    src="act_nav.svg"
                  ></img>
                  My Activity
                </div>
              </Link>
            </li>
            <li>
              <Link to="/LeaderBoard" className={styles.nav_link}>
                <div>
                  <img src="leader_nav.svg"></img>
                  Leader Board
                </div>
              </Link>
            </li>
            <li>
              <Link to="/Chat" className={styles.nav_link}>
                <div>
                  <img style={{ height: "22px" }} src="chat_nav.svg"></img>
                  Conversations
                </div>
              </Link>
            </li>
            <li>
              <Link to="/Feed" className={styles.nav_link}>
                <div>
                  <img style={{ height: "22px" }} src="feed_nav.svg"></img>
                  Community Hub
                </div>
              </Link>
            </li>
            <li>
              <Link to="/Registration" className={styles.nav_link}>
                <div>
                  <img src="reg_nav.svg" style={{ height: "22px" }}></img>Add
                  Account
                </div>
              </Link>
            </li>
            <li>
              <Link to="/Login" className={styles.nav_link}>
                <div>
                  <img style={{ height: "22px" }} src="log_nav.svg"></img>Switch
                  User
                </div>
              </Link>
            </li>
            <li>
              <Link to="/UserProfile" className={styles.nav_link}>
                <div>
                  <img style={{ height: "22px" }} src="pro_nav.svg"></img>User
                  Profile / Log out
                </div>
              </Link>
            </li>
            <li>
              <Link to="/AboutUs" className={styles.nav_link}>
                <div>
                  <img style={{ height: "25px" }} src="team_nav.svg"></img>About
                  Us
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
