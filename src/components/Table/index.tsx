import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { ResponseStatus } from "../../constants";
import { useAxios, Payload } from "../../hooks";
import { Controls } from "./Controls";

function formatHeader(value: string) {
  return value.replace("_", " ").replace(/\w/, (match) => match.toUpperCase());
}

function formatData(value: string) {
  switch (true) {
    case /^https:\/\/.*/.test(value):
      return <a href={value}>{value}</a>;
    case /^\d{4}-\d{2}-\d{2}T.*/.test(value):
      return dayjs(value).format("DD/MM/YYYY");
    default:
      return value;
  }
}

interface UseDynamicColumnsProps {
  status: ResponseStatus
  payload: Payload | string
}

function useDynamicColumns({ status, payload }: UseDynamicColumnsProps) {
  const columns = useMemo(() => {
    if (status !== ResponseStatus.Resolved) return [];

    let response = payload as Payload
    return (
      Object.entries(response?.results?.[0] ?? {})
        .filter(([_, value]) => !Array.isArray(value))
        .map(([key]) => key)
    );
  }, [status, payload]);

  return columns;
}

interface TableProps {
  url: string
}

export function Table({ url: initialUrl }: TableProps) {
  const [url, setUrl] = useState(initialUrl);
  const [status, payload] = useAxios(url);

  // TODO: /people/schema was responding with 404 so creating columns
  // dynamically here.
  const columns = useDynamicColumns({ status, payload });

  // TODO: Better error handling.
  if (status === ResponseStatus.Rejected) throw new Error(payload as string);

  const { results: people = [], next, previous } = payload as Payload;

  // TODO: Show a "No data" message if nil results.
  return (
    <>
      <Controls {...{ initialUrl, setUrl, next, previous }} />
      <div
        style={{
          border: "1px solid var(--gray)",
          padding: "24px",
          height: "900px",
        }}
        className="u-max-full-width"
      >
        {status === ResponseStatus.Resolved ? (
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
