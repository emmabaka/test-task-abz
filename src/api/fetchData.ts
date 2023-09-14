import axios, { AxiosError } from "axios";
import { API_URL } from "../constants/constants";
import { Id } from "react-toastify";

const fetchData = async (endpoint: string, notify: { (): Id; (): void }) => {
  try {
    const response = await axios.get(`${API_URL}/${endpoint}`);

    if (!response) throw new Error();

    return response;
  } catch (error) {
    const { response } = error as AxiosError;

    if (!response) return;

    if (
      response.status === 404 ||
      response.status === 422 ||
      response.status >= 500
    ) {
      notify();
    }
  }
};

export default fetchData;
