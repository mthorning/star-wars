import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { useUpdateEffect } from "../../hooks";

enum Direction {
  Previous = 'previous',
  Next = 'next',
}

interface PaginationControlsProps {
  setUrl: (url: string) => void
  next?: string
  previous?: string
}

interface ButtonProps {
  direction: Direction
}

function PaginationControls(props: PaginationControlsProps) {

  const Button = ({ direction }: ButtonProps) => {
    const dir: 'next' | 'previous' = direction
    const url: string = props[dir] ?? ''
    const disabled = url === null;
    return (
      <button
        disabled={disabled}
        style={
          disabled ? { borderColor: "var(--gray)", color: "var(--gray)" } : {}
        }
        onClick={() => props.setUrl(url)}
      >
        {direction}
      </button>
    );
  };

  return (
    <div>
      <Button direction={Direction.Previous} />
      <Button direction={Direction.Next} />
    </div>
  );
}

interface SearchProps {
  search: string;
  setSearch: (search: string) => void;
}

function Search({ search, setSearch }: SearchProps) {
  const [value, setValue] = useState(search);

  const timeout = useRef<ReturnType<typeof setTimeout>>();
  useUpdateEffect(() => {
    timeout.current = setTimeout(() => {
      setSearch(value);
    }, 250);
    return () => clearTimeout(timeout.current as unknown as number);
  }, [value]);

  return (
    <input
      autoFocus={!!search}
      type="search"
      placeholder="Search by name"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

interface ControlsProps {
  initialUrl: string;
  setUrl: (url: string) => void;
  next?: string;
  previous?: string;
}

export function Controls({
  initialUrl,
  setUrl,
  next,
  previous,
}: ControlsProps) {
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
