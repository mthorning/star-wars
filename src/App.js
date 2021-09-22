import { ErrorBoundary, Table } from "./components";
import { endpoints } from "./constants";
import "./assets/normalize.css";
import "./assets/skeleton.css";

const { PEOPLE } = endpoints;

function App() {
  return (
    <ErrorBoundary>
      <div className="container">
        <Table url={PEOPLE} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
