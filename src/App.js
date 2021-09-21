import { useState } from "react";
import { ErrorBoundary, Table } from "./components";
import { endpoints, responseStatus } from "./constants";
import "./assets/skeleton.css";

const { PEOPLE } = endpoints;

function App() {
  return (
    <ErrorBoundary>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Table url={PEOPLE} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
