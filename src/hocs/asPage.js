import React, { useState } from "react";
import Column from "../components/Layout/Column";
import Row from "../components/Layout/Row";
import styles from "./sidebarStyles.css";
import regStyles from "../styles/constants";
import classNames from "classnames";

// images
import { ReactComponent as Logo } from "../assets/logo_no_shadow.svg";

// Components
import { Link, useLocation } from "react-router-dom";
import {
  APP_ACCOUNT_PATH,
  APP_ALBUMS_PATH,
  APP_BATCHES_PATH,
  APP_BUILD_PATH,
  APP_CREATE_BATCH_PATH,
} from "../constants";

// icons
import {
  IoIosAlbums,
  IoIosSettings,
  IoMdArrowDropdown,
  IoMdNotifications,
  IoMdSearch,
} from "react-icons/io";
import { FaCloudUploadAlt } from "react-icons/fa";
import { RiDashboardLine, RiStackLine } from "react-icons/ri";
import { BiAddToQueue } from "react-icons/bi";

const headerHeight = 60;
const sidebarWidth = 250;

const mainLinks = [
  {
    to: APP_BUILD_PATH,
    Icon: FaCloudUploadAlt,
    title: "Upload",
  },
  {
    to: APP_ALBUMS_PATH,
    Icon: IoIosAlbums,
    title: "Albums",
  },
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
      to: "",
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
    <IoMdSearch size={20} />
    <span style={{ marginLeft: 8 }}>Search</span>
  </Row>
);

const SectionTitle = ({ title }) => (
  <Link
    className={classNames(styles.sidebarLinkWrapper)}
    to={title.to}
    style={{ borderBottom: `2px solid ${regStyles.gray40}` }}
  >
    <RiDashboardLine
      className={styles.sidebarIcon}
      style={{ color: regStyles.gray95 }}
    />
    <span className={styles.navText} style={{ color: regStyles.gray95 }}>
      {title.text}
    </span>
  </Link>
);

const Notifications = ({}) => (
  <Row align className={styles.notifications} style={{ margin: 16 }}>
    <IoMdNotifications color={regStyles.gray80} size={20} />
  </Row>
);

const UserDropdown = ({}) => (
  <Row align style={{ marginRight: 16 }}>
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
      JZ
    </Row>
    <span style={{ marginRight: 8 }}>Jake Zegil</span>
    <IoMdArrowDropdown color={regStyles.gray80} />
  </Row>
);

const Header = ({}) => (
  <Row className={styles.header}>
    <Logo style={{ margin: "0 16px" }} width={30} />
    <Column justify>
      <span style={{ fontSize: 12 }}>Gauss</span>
      <span>Data Management Portal</span>
    </Column>
    <HeaderSearch />
    <Notifications />
    <UserDropdown />
  </Row>
);

const Section = ({ section: { title, links } }) => {
  const location = useLocation();

  return (
    <Column className={styles.section}>
      {/* <SectionTitle title={title} /> */}
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
  const to = "";
  const title = "Settings";

  return (
    <Column className={styles.finalSection}>
      <Link className={classNames(styles.sidebarLinkWrapper)} to={to}>
        <IoIosSettings
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
    <Column
      style={{
        width: "100vw",
        height: "100vh",
        color: regStyles.gray80,
      }}
    >
      <Header />
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
  );
};

export default Page;
