import moment from "moment";
import React, { useEffect, useState } from "react";
import Column from "../../components/Layout/Column";
import Row from "../../components/Layout/Row";
import { fetchBatches } from "../../utils/queries";

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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchBatches(page || 1).then(({ data }) => {
      setBatches(data.task_batches);
      setLoading(false);
    });
  }, [page]);

  return (
    <Column>
      <Grid data={batches} config={gridConfig} />
    </Column>
  );
};

export default BatchManager;
