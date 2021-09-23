import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { responseStatus } from "../../constants";
import { useAxios } from "../../hooks";
import { Controls } from "./Controls";

const { REJECTED, RESOLVED } = responseStatus;

// TODO: Replace this when JSON Schema is returned
function formatHeader(value) {
  return value.replace("_", " ").replace(/\w/, (match) => match.toUpperCase());
}

// TODO: Replace this when JSON Schema is returned
function formatData(value) {
  switch (true) {
    case /^https:\/\/.*/.test(value):
      return <a href={value}>{value}</a>;
    case /^\d{4}-\d{2}-\d{2}T.*/.test(value):
      return dayjs(value).format("DD/MM/YYYY");
    default:
      return value;
  }
}

function useDynamicColumns({ status, payload }) {
  const columns = useMemo(() => {
    if (status !== RESOLVED) return [];

    return (
      Object.entries(payload?.results?.[0] ?? {})
        // TODO: Add functionality for displaying arrays of data
        .filter(([_, value]) => !Array.isArray(value))
        .map(([key]) => key)
    );
  }, [status, payload]);

  return columns;
}

export function Table({ url: initialUrl }) {
  const [url, setUrl] = useState(initialUrl);
  const [status, payload] = useAxios(url);

  // TODO: /people/schema was responding with 404 so creating columns
  // dynamically here.
  const columns = useDynamicColumns({ status, payload });

  // TODO: Better error handling.
  if (status === REJECTED) throw new Error(payload);

  const { results: people = [], next, previous, count } = payload;

  // TODO: Show a "No data" message if nil results.
  return (
    <>
      <Controls {...{ initialUrl, url, setUrl, next, previous, count }} />
      <div
        style={{
          border: "1px solid var(--gray)",
          padding: "24px",
          height: "900px",
        }}
        className="u-max-full-width"
      >
        {status === RESOLVED ? (
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{formatHeader(column)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.name}>
                  {columns.map((column) => (
                    <td key={`${person}${column}`}>
                      {formatData(person[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="spinner" />
        )}
      </div>
    </>
  );
}

Table.propTypes = {
  url: PropTypes.string.isRequired,
};
