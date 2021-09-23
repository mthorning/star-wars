import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { useUpdateEffect } from "../../hooks";

function PaginationControls({ setUrl, ...props }) {
  const Button = ({ direction }) => {
    const disabled = props[direction] === null;
    return (
      <button
        disabled={disabled}
        style={
          disabled ? { borderColor: "var(--gray)", color: "var(--gray)" } : {}
        }
        onClick={() => setUrl(props[direction])}
      >
        {direction}
      </button>
    );
  };

  return (
    <div>
      <Button direction="previous" />
      <Button direction="next" />
    </div>
  );
}

function Search({ search, setSearch }) {
  const [value, setValue] = useState(search);

  const timeout = useRef();
  useUpdateEffect(() => {
    timeout.current = setTimeout(() => {
      setSearch(value);
    }, 250);
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

export function Controls({
  initialUrl,
  url,
  setUrl,
  next,
  previous,
  count = 0,
}) {
  const totalPages = Math.ceil(count / 10);

  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);
  const page = params.get("page") || 1;

  const pages = new Array(totalPages).fill().map((_, i) => i + 1);

  const [selectedPage, setSelectedPage] = useState(page);
  useUpdateEffect(() => {
    params.set("page", selectedPage);
    setUrl(`${initialUrl}?${params.toString()}`);
  }, [selectedPage]);

  const [search, setSearch] = useState("");

  useUpdateEffect(() => {
    setUrl(`${initialUrl}${search ? `?search=${search}` : ""}`);
  }, [search, initialUrl, setUrl]);

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <select
        value={selectedPage}
        onChange={(event) => setSelectedPage(event.target.value)}
      >
        {pages.map((page) => (
          <option value={page}>{page}</option>
        ))}
      </select>
      <Search {...{ search, setSearch }} />
      {`${page} / ${totalPages}`}
      <PaginationControls {...{ next, previous, setUrl }} />
    </div>
  );
}

Controls.propTypes = {
  initialUrl: PropTypes.string.isRequired,
  setUrl: PropTypes.func.isRequired,
  previous: PropTypes.string,
  next: PropTypes.string,
};
