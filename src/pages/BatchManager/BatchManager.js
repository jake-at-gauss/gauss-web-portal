import React, { useEffect, useState } from "react";

// Components
import Column from "../../components/Layout/Column";
import Row from "../../components/Layout/Row";

// Utils
import moment from "moment";

// API
import { fetchBatches } from "../../utils/queries";
import { UnstyledButton } from "../../components/Button/UnstyledButton";

const gridConfig = [
  {
    title: "Batch",
    accessor: "batch_identifier",
  },
  {
    title: "Status",
    accessor: "status",
  },
  {
    title: "Created",
    cellFn: ({ created_at }) => moment(created_at).local().format("LLL"),
  },
];

const Grid = ({ gridProps, data, config }) => {
  return (
    <Column {...gridProps}>
      <Row>
        {config.map(({ title, flex = 1 }, i) => (
          <div key={i} style={{ flex }}>
            {title}
          </div>
        ))}
      </Row>
      {data.map((row, i) => (
        <Row key={i}>
          {config.map(({ content, cellFn, accessor, style, flex = 1 }) => (
            <div key={accessor} style={{ flex: flex, ...style }}>
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
  }, [pagination]);

  return (
    <Column>
      <Grid data={batches} config={gridConfig} />
      {(pagination.more || pagination.page > 1) && (
        <Row>
          <UnstyledButton
            onClick={decrementPage}
            disabled={backDisabled}
            style={{ opacity: backDisabled ? 0.5 : 1 }}
          >
            Back
          </UnstyledButton>
          <span style={{ margin: 8 }}>{pagination.page}</span>
          <UnstyledButton
            onClick={incrementPage}
            disabled={nextDisabled}
            style={{ opacity: nextDisabled ? 0.5 : 1 }}
          >
            Next
          </UnstyledButton>
        </Row>
      )}
    </Column>
  );
};

export default BatchManager;
