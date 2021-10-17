import { useEffect, useState } from "react";
import axios from "axios";
import { ResponseStatus } from "../constants";

export interface Payload {
  results: { [key: string]: any }[];
  next?: string;
  previous?: string;
}

type UseAxiosReturn = [ResponseStatus, Payload | string];

const initialState: UseAxiosReturn = [ResponseStatus.Pending, { results: [] }];

export function useAxios(url: string): UseAxiosReturn {
  const [response, setResponse] =
    useState<UseAxiosReturn>(initialState);

  useEffect(() => {
    if (url) {
      setResponse(initialState);
      axios
        .get<Payload | string>(url)
        .then(({ data }) => setResponse([ResponseStatus.Resolved, data]))
        .catch((error) => setResponse([ResponseStatus.Rejected, error]));
    }
  }, [url]);

  return response;
}
