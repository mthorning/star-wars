import { useEffect, useState } from "react";
import axios from "axios";
import { responseStatus } from "../constants";

const { PENDING, RESOLVED, REJECTED } = responseStatus;

const initialState = [PENDING, {}];

export function useAxios(url) {
  const [response, setResponse] = useState(initialState);

  useEffect(() => {
    if (url) {
      setResponse(initialState);
      axios
        .get(url)
        .then(({ data }) => setResponse([RESOLVED, data]))
        .catch((error) => setResponse([REJECTED, error]));
    }
  }, [url]);

  return response;
}
