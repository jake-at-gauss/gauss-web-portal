import React, { useEffect, useState } from "react";

// Components
import { UnstyledButton } from "../../components/Button/UnstyledButton";
import Column from "../../components/Layout/Column";
import Grid from "../../components/Grid/Grid";
import Row from "../../components/Layout/Row";
import { Link } from "react-router-dom";

// Utils
import { composePath } from "../../utils/general";
import moment from "moment";

// API
import { fetchBatches } from "../../utils/queries";

// Styles
import styles from "./BatchManager.css";
import regStyles from "../../styles/constants";
import { RiStackLine } from "react-icons/ri";

// Constants
import { APP_BATCH_PATH } from "../../constants";

const gridConfig = [
  {
    title: "Batch",
    accessor: "batch_identifier",
    style: { marginTop: 8 },
  },
  {
    title: "Status",
    accessor: "status",
    style: { marginTop: 8 },
  },
  {
    title: "Created",
    style: { marginTop: 8 },
    cellFn: ({ created_at }) => moment(created_at).local().format("LLL"),
  },
  {
    title: "",
    style: { marginTop: 8 },
    cellFn: ({ batch_identifier }) => (
      <Link
        to={composePath(APP_BATCH_PATH, { id: batch_identifier })}
        style={{
          display: "flex",
          alignItems: "center",
          color: regStyles.base,
          alignSelf: "flex-end",
          fontWeight: "bold",
        }}
      >
        View Batch Details
      </Link>
    ),
  },
];

const EmptyState = ({}) => {
  return (
    <Column style={{ paddingTop: 16 }}>
      <span>It looks like you haven't created any batches yet! </span>
    </Column>
  );
};

const withPageWrapper =
  (Component) =>
  ({}) => {
    return (
      <div className={styles.container}>
        <h2 style={{ display: "flex" }}>
          <RiStackLine />
          <span style={{ marginLeft: 8 }}>Manage Task Batches</span>
        </h2>
        <Column className={styles.managementContainer}>
          <Component />
        </Column>
      </div>
    );
  };

const BatchManager = ({}) => {
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);

  // Pagination
  const [pagination, setPagination] = useState({ page: 1, more: false });
  const incrementPage = () =>
    setPagination({ ...pagination, page: pagination.page + 1 });
  const decrementPage = () =>
    setPagination({ ...pagination, page: pagination.page - 1 });

  const backDisabled = pagination.page <= 1 || loading;
  const nextDisabled = !pagination.more || loading;

  useEffect(() => {
    setLoading(true);
    fetchBatches(pagination.page || 1)
      .then(({ data }) => {
        setBatches(data.task_batches);
        setPagination({ ...pagination, more: data.more });
      })
      .finally(() => setLoading(false));
  }, [pagination.page]);

  return (
    <Column style={{ padding: 32 }}>
      <Grid
        data={batches}
        config={gridConfig}
        emptyState={!loading && <EmptyState />}
      />
      {(pagination.more || pagination.page > 1) && (
        <Row>
          <UnstyledButton
            onClick={decrementPage}
            disabled={backDisabled}
            style={{
              opacity: backDisabled ? 0.5 : 1,
              color: regStyles.base,
              fontWeight: "bold",
            }}
          >
            Back
          </UnstyledButton>
          <span style={{ margin: 8, color: regStyles.dark }}>
            Page {pagination.page}
          </span>
          <UnstyledButton
            onClick={incrementPage}
            disabled={nextDisabled}
            style={{
              opacity: nextDisabled ? 0.5 : 1,
              color: regStyles.base,
              fontWeight: "bold",
            }}
          >
            Next
          </UnstyledButton>
        </Row>
      )}
    </Column>
  );
};

export default withPageWrapper(BatchManager);
