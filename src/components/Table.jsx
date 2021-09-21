import { useRef, useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import { responseStatus } from "../constants";
import { useAxios } from "../hooks/useAxios";

const { PENDING, REJECTED, RESOLVED } = responseStatus;

function formatHeader(value) {
  return value.replace("_", " ").replace(/\w/, (match) => match.toUpperCase());
}

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

    return Object.entries(payload?.results?.[0] ?? {})
      .filter(([_, value]) => !Array.isArray(value))
      .map(([key]) => key);
  }, [status, payload]);

  return columns;
}

function PaginationControls({ setUrl, ...props }) {
  const Button = ({ direction }) => {
    const disabled = !props[direction];
    return (
      <button
        disabled={disabled}
        style={disabled ? { borderColor: "#80808045", color: "#80808045" } : {}}
        onClick={() => setUrl(props[direction])}
      >
        {direction}
      </button>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Button direction="previous" />
      <Button direction="next" />
    </div>
  );
}

function useUpdateEffect(cb, dependencies) {
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      return cb();
    }
  }, dependencies);
}

function Search({ search, setSearch }) {
  const [value, setValue] = useState(search);

  const timeout = useRef();
  useUpdateEffect(() => {
    timeout.current = setTimeout(() => {
      setSearch(value);
    }, 300);
    return () => clearTimeout(timeout.current);
  }, [value]);

  return (
    <input
      autoFocus={search}
      type="search"
      placeholder="Search by name"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export function Table({ url: initialUrl }) {
  const [url, setUrl] = useState(initialUrl);
  const [search, setSearch] = useState("");
  useEffect(() => {
    setUrl(`${initialUrl}?search=${search}`);
  }, [search, initialUrl]);

  const [status, payload] = useAxios(url);
  const columns = useDynamicColumns({ status, payload });

  if (status === PENDING) return <p>SPINNER</p>;
  if (status === REJECTED) throw new Error(payload);

  const { results: people, next, previous } = payload;
  return (
    <div>
      <Search {...{ search, setSearch }} />
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
                <td key={`${person}${column}`}>{formatData(person[column])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <PaginationControls {...{ next, previous, setUrl }} />
    </div>
  );
}
