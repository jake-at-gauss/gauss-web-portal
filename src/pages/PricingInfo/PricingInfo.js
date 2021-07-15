import React from "react";
import { BiInfoCircle } from "react-icons/bi";

// Styles
import styles from "./PricingInfo.css";

// Components
import Column from "../../components/Layout/Column";
import regStyles from "../../styles/constants";

const withPageWrapper =
  (Component) =>
  ({}) => {
    return (
      <div className={styles.container}>
        <h2 style={{ display: "flex" }}>
          <BiInfoCircle />
          <span style={{ marginLeft: 8 }}>Pricing</span>
        </h2>
        <Column className={styles.pricingContainer}>
          <Component />
        </Column>
      </div>
    );
  };

const PricingInfo = ({}) => {
  return (
    <Column>
      <h2>Task Types</h2>
      <Column style={{ padding: `0 16px` }}>
        <h2 style={{ marginTop: 0 }}>Classification</h2>
        <span>
          Beta pricing is a flat labeling rate of 10&#162; per image per
          dataset.
        </span>
        <h2>Bounding Boxes</h2>
        <span>
          Beta pricing is a flat labeling rate of 10&#162; per image per
          dataset.
        </span>
      </Column>
      <Column
        style={{ fontSize: 14, fontWeight: "bold", color: regStyles.dark }}
      >
        <span style={{ marginTop: 32 }}>
          *Our pricing varies based on the task type requested for each dataset.
          During our open beta, we're only offering classification for
          self-serve data labeling. More to come soon!
        </span>
        <span style={{ marginTop: 8 }}>
          **For custom pricing on large or recurring orders please reach out to us at{" "}
          <a href="mailto:andrew@trygauss.com">andrew@trygauss.com</a>.
        </span>
      </Column>
    </Column>
  );
};

export default withPageWrapper(PricingInfo);
