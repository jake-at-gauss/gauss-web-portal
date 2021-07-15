import React, { useEffect, useState } from "react";

// Components
import Column from "../../components/Layout/Column";
import Row from "../../components/Layout/Row";

// Utils
import moment from "moment";
import { isEmpty } from "lodash";

// API
import { fetchBatches } from "../../utils/queries";
import { UnstyledButton } from "../../components/Button/UnstyledButton";

// Styles
import regStyles from "../../styles/constants";

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
];

const EmptyState = ({}) => {
  return (
    <Column style>
      <span>It looks like you haven't created any Batches yet! </span>
    </Column>
  );
};

const Grid = ({ gridProps, data, config, emptyState }) => {
  return (
    <Column {...gridProps}>
      <Row>
        {config.map(({ title, flex = 1 }, i) => (
          <div key={i} style={{ flex, fontWeight: 'bold' }}>
            {title}
          </div>
        ))}
      </Row>
      {isEmpty(data) && emptyState}
      {!isEmpty(data) &&
        data.map((row, i) => (
          <Row key={i}>
            {config.map(({ content, cellFn, accessor, style, flex = 1 }, i) => (
              <div key={`${accessor}${i}`} style={{ flex: flex, ...style }}>
                {content || (cellFn && cellFn(row)) || row[accessor]}
              </div>
            ))}
          </Row>
        ))}
    </Column>
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

export default BatchManager;
