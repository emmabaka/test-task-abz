import axios from "axios";
import { API_URL } from "../constants/constants";


const fetchData = async (endpoint: string) => {
  try {
    return await axios.get(`${API_URL}/${endpoint}`);
  } catch (e) {
    throw new Error();
  }
};

export default fetchData;
