import { isEmpty } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { RiCheckboxMultipleBlankLine } from "react-icons/ri";
import { UnstyledButton } from "../../components/Button/UnstyledButton";
import Grid from "../../components/Grid/Grid";
import Column from "../../components/Layout/Column";
import Row from "../../components/Layout/Row";
import { APP_BATCH_PATH } from "../../constants";
import withPageWrapper from "../../hocs/withPageWrapper";
import regStyles from "../../styles/constants";
import { parsePath } from "../../utils/general";
import { fetchBatchTasks } from "../../utils/queries";

import styles from "./BatchViewer.css";

const gridConfig = [
  {
    title: "Task",
    style: { marginTop: 8 },
    flex: 30,
    cellFn: ({ batch_identifier, id }) => `${batch_identifier}-${id}`,
  },
  {
    title: "Status",
    accessor: "status",
    flex: 25,
    style: { marginTop: 8 },
  },
  {
    title: "Selected Option",
    accessor: "selected_option",
    style: { marginTop: 8 },
    flex: 25,
    cellFn: ({ selected_option }) =>
      !!selected_option ? (
        selected_option
      ) : (
        <b style={{ color: "#fdad0d", fontStyle: "italic" }}>
          pending task completion
        </b>
      ),
  },
  {
    title: "Created",
    style: { marginTop: 8 },
    flex: 20,
    cellFn: ({ created_at }) => moment(created_at).local().format("LLL"),
  },
];

const EmptyState = ({}) => {
  return (
    <Column style={{ paddingTop: 16 }}>
      <span>
        It looks like there aren't any tasks associated with this batch.
      </span>
    </Column>
  );
};

const renderBatchOption = (option) => {
  return (
    <span className={styles.batchOption} style={{ padding: 4 }} key={option}>
      {option}
    </span>
  );
};

const BatchViewer = ({}) => {
  const { id: batch_identifier } = parsePath(APP_BATCH_PATH);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [batch, setBatch] = useState({});

  const csvContent = tasks
    .reduce(
      (acc, { image, selected_option }) => [
        ...acc,
        `${image.origin_url},${selected_option}`,
      ],
      ["data:text/csv;charset=utf-8,"]
    )
    .join("\n");

  // Pagination
  //   const [pagination, setPagination] = useState({ page: 1, more: false });
  //   const incrementPage = () =>
  //     setPagination({ ...pagination, page: pagination.page + 1 });
  //   const decrementPage = () =>
  //     setPagination({ ...pagination, page: pagination.page - 1 });

  //   const backDisabled = pagination.page <= 1 || loading;
  //   const nextDisabled = !pagination.more || loading;

  useEffect(() => {
    setLoading(true);
    fetchBatchTasks(batch_identifier)
      .then(({ data }) => {
        setTasks(data.tasks);
        setBatch(data.batch);
        // setPagination({ ...pagination, more: data.more });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Column>
      <Row className={styles.componentContainer}>
        <Column>
          <Row align>
            <b>Batch Type: </b>
            <span style={{ padding: 4 }}>Classification</span>
          </Row>
          <Row align style={{ marginTop: 8 }}>
            <b>Batch Status: </b>
            <span style={{ padding: 4 }}>
              {batch.status === "in progress"
                ? `${Math.round(
                    (100 *
                      tasks.filter(({ status }) => status === "completed")
                        .length) /
                      tasks.length
                  )}% Complete`
                : batch.status}
            </span>
          </Row>
          {!isEmpty(batch.options) && (
            <Row align style={{ marginTop: 8 }}>
              <b>Batch Options: </b>
              {batch.options.map(renderBatchOption)}
            </Row>
          )}
        </Column>
        <Column style={{ flex: 1 }}>
          <a
            style={{
              color: regStyles.base,
              fontWeight: "bold",
            }}
            href={encodeURI(csvContent)}
            download={`${batch.batch_identifier || moment.now()}_results.csv`}
          >
            Export to CSV
          </a>
        </Column>
      </Row>
      <Column className={styles.componentContainer} style={{ marginTop: 32 }}>
        <Grid
          data={tasks}
          config={gridConfig}
          emptyState={!loading && <EmptyState />}
          resultProps={{
            style: {
              maxHeight: 300,
              overflow: "overlay",
            },
          }}
        />
        {/* TODO: pagination */}
        {/* {(pagination.more || pagination.page > 1) && (
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
      )} */}
      </Column>
    </Column>
  );
};

export default withPageWrapper(BatchViewer, {
  Icon: RiCheckboxMultipleBlankLine,
  title: (() => "Batch " + parsePath(APP_BATCH_PATH).id)(),
  styles: {
    componentContainer: styles.pageContainer,
  },
});
