import React, { useEffect, useState } from "react";

// images
import { ReactComponent as Logo } from "../assets/logo_no_shadow.svg";

// Components
import { UnstyledButton } from "../components/Button/UnstyledButton";
import DropdownMenu from "../components/DropdownMenu/DropdownMenu";
import { Link, useLocation } from "react-router-dom";
import Column from "../components/Layout/Column";
import Row from "../components/Layout/Row";

// icons
import {
  IoIosMail,
  IoIosSettings,
  IoMdArrowDropdown,
  IoMdNotifications,
  IoMdSearch,
} from "react-icons/io";
import { FaCloudUploadAlt } from "react-icons/fa";
import { RiDashboardLine, RiStackLine } from "react-icons/ri";
import { BiAddToQueue } from "react-icons/bi";

// Styles
import styles from "./sidebarStyles.css";
import regStyles from "../styles/constants";

// Context
import { AuthContext } from "../context/AuthContext";

// Queries
import { fetchUser } from "../utils/queries";

// Utils
import classNames from "classnames";
import { capitalize } from "lodash";

// Constants
import {
  APP_ACCOUNT_PATH,
  APP_BATCHES_PATH,
  APP_BUILD_PATH,
  APP_CREATE_BATCH_PATH,
  APP_PATH,
} from "../constants";

const headerHeight = 60;
const sidebarWidth = 250;

const mainLinks = [
  {
    to: APP_BUILD_PATH,
    Icon: FaCloudUploadAlt,
    title: "Upload",
  },
  // {
  //   to: APP_ALBUMS_PATH,
  //   Icon: IoIosAlbums,
  //   title: "Albums",
  // },
  {
    to: APP_ACCOUNT_PATH,
    Icon: IoIosSettings,
    title: "Settings",
  },
];

const batchLinks = [
  {
    to: APP_BATCHES_PATH,
    Icon: RiStackLine,
    title: "Manage",
  },
  {
    to: APP_CREATE_BATCH_PATH,
    Icon: BiAddToQueue,
    title: "Create",
  },
];

const topSection = {
  links: [
    {
      to: APP_BATCHES_PATH,
      Icon: RiDashboardLine,
      title: "Dashboard",
    },
  ],
};

const mainSection = {
  title: {
    text: "IMAGE MANAGEMENT",
  },
  links: mainLinks,
};

const batchSection = {
  title: {
    text: "BATCH MANAGEMENT",
  },
  links: batchLinks,
};

const HeaderSearch = ({}) => (
  <Row justify align style={{ marginLeft: "auto", marginRight: 16 }}>
    {/* <IoMdSearch size={20} />
    <span style={{ marginLeft: 8 }}>Search</span> */}
  </Row>
);

const Notifications = ({}) => (
  <Row align className={styles.notifications} style={{ margin: 16 }}>
    <IoMdNotifications color={regStyles.gray80} size={20} />
  </Row>
);

// TODO: don't hardcode this ??
const UserDropdown = ({ user = {}, logout }) =>
  user.loading ? null : (
    <DropdownMenu
      dropdownOptionsClassName={styles.dropdownOptions}
      dropdownOptions={
        <Column>
          <Column style={{ padding: 8, alignItems: "start" }}>
            <span style={{ marginRight: 8, fontSize: 16, fontWeight: "bold" }}>
              {user.first_name} {user.last_name}
            </span>
          </Column>
          <div
            style={{
              width: "100%",
              height: 2,
              background: regStyles.gray80,
            }}
          />
          <div style={{ padding: 8, fontSize: 14 }}>
            <UnstyledButton style={{ color: regStyles.base }} onClick={logout}>
              Logout
            </UnstyledButton>
          </div>
        </Column>
      }
    >
      <Row align style={{ marginRight: 16, color: regStyles.gray80 }}>
        <Row
          align
          justify
          style={{
            color: regStyles.white,
            background: regStyles.base,
            borderRadius: "50%",
            margin: 8,
            height: 30,
            width: 30,
          }}
        >
          {capitalize(user.first_name || [""])[0]}
          {capitalize(user.last_name || [""])[0]}
        </Row>
        <IoMdArrowDropdown color={regStyles.gray80} />
      </Row>
    </DropdownMenu>
  );

const Header = ({ isAuthenticated, logout }) => {
  const [user, setUser] = useState({
    loading: true,
  });
  useEffect(() => {
    fetchUser().then(({ data }) => setUser(data.user));
  }, [isAuthenticated]);

  return (
    <Row className={styles.header}>
      <Logo style={{ margin: "0 16px" }} width={30} />
      <Column justify>
        <span style={{ fontSize: 12 }}>Gauss</span>
        <span>Data Management Portal</span>
      </Column>
      <HeaderSearch />
      <Notifications />
      <UserDropdown user={user} logout={logout} />
    </Row>
  );
};

const Section = ({ section: { title, links } }) => {
  const location = useLocation();

  return (
    <Column className={styles.section}>
      {title && (
        <span
          style={{
            fontSize: 10,
            fontWeight: "bold",
            margin: "8px 0",
            color: regStyles.gray95,
          }}
        >
          {title.text}
        </span>
      )}
      {links.map(({ Icon, to, title }) => {
        const selected = location.pathname === to;

        return (
          <Link
            key={to}
            className={classNames(styles.sidebarLinkWrapper)}
            to={to}
          >
            <Icon
              className={styles.sidebarIcon}
              style={{
                color: selected ? regStyles.base : regStyles.gray95,
              }}
            />
            <span
              className={styles.navText}
              style={{
                color: selected ? regStyles.base : regStyles.gray95,
              }}
            >
              {title.toUpperCase()}
            </span>
          </Link>
        );
      })}
    </Column>
  );
};

const FinalSection = ({}) => {
  // const to = APP_PATH;
  // const title = "Settings";

  const to = "#";
  const title = "Contact Us";

  // delete when swapping to settings
  const mailTo = "mailto:jake@trygauss.com";

  return (
    <Column className={styles.finalSection}>
      <Link
        className={classNames(styles.sidebarLinkWrapper)}
        to={to}
        onClick={() => (window.location = mailTo)}
      >
        {/* <IoIosSettings */}
        <IoIosMail
          className={styles.sidebarIcon}
          style={{
            color: regStyles.gray95,
          }}
        />
        <span
          className={styles.navText}
          style={{
            color: regStyles.gray95,
          }}
        >
          {title.toUpperCase()}
        </span>
      </Link>
    </Column>
  );
};

const Page = ({ content, logout }) => {
  return (
    <AuthContext.Consumer>
      {({ isAuthenticated }) => (
        <Column
          style={{
            width: "100vw",
            height: "100vh",
            color: regStyles.gray80,
          }}
        >
          <Header isAuthenticated logout={logout} />
          <Row>
            <Row
              className={styles.sidebarContainer}
              style={{ width: sidebarWidth }}
            >
              <Column style={{ minWidth: sidebarWidth }}>
                <Section section={topSection} />
                {/* <Section section={mainSection} /> */}
                <Section section={batchSection} />
                <FinalSection />
              </Column>
            </Row>
            <Column
              style={{
                left: sidebarWidth,
                maxWidth: `calc(100vw - ${sidebarWidth}px)`,
                minWidth: `calc(100vw - ${sidebarWidth}px)`,
              }}
            >
              <div
                id="page-container"
                style={{
                  maxHeight: `calc(100vh - ${headerHeight}px)`,
                  minHeight: `calc(100vh - ${headerHeight}px)`,
                  overflow: "auto",
                }}
              >
                {content}
              </div>
            </Column>
          </Row>
        </Column>
      )}
    </AuthContext.Consumer>
  );
};

export default Page;
