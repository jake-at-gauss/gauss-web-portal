import { isEmpty } from "lodash";
import React from "react";
import Column from "../Layout/Column";
import Row from "../Layout/Row";

// Config
// -

const Grid = ({
  gridProps,
  resultProps,
  data,
  config,
  emptyState,
  rowDecorator,
}) => {
  return (
    <Column {...gridProps}>
      <Row>
        {config.map(({ title, flex = 1 }, i) => (
          <div key={i} style={{ flex, fontWeight: "bold", padding: 4 }}>
            {title}
          </div>
        ))}
      </Row>
      <Column {...resultProps}>
        {isEmpty(data) && emptyState}
        {!isEmpty(data) &&
          data.map((row, i) => (
            <Row key={i} style={rowDecorator && rowDecorator(row)}>
              {config.map(
                ({ content, cellFn, accessor, style, flex = 1 }, i) => (
                  <div
                    key={`${accessor}${i}`}
                    style={{
                      flex: flex,
                      padding: 4,
                      ...style,
                    }}
                  >
                    {content || (cellFn && cellFn(row)) || row[accessor]}
                  </div>
                )
              )}
            </Row>
          ))}
      </Column>
    </Column>
  );
};

export default Grid;
