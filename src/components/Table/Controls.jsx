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

export function Controls({ initialUrl, setUrl, next, previous }) {
  const [search, setSearch] = useState("");

  useUpdateEffect(() => {
    setUrl(`${initialUrl}${search ? `?search=${search}` : ""}`);
  }, [search, initialUrl, setUrl]);

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Search {...{ search, setSearch }} />
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
