import axios from "axios";

const API_URL = "https://frontend-test-assignment-api.abz.agency/api/v1"

const fetchData = async(endpoint: string) => {
  try {
    return await axios.get(`${API_URL}/${endpoint}`)
  } catch (e) {
    throw new Error
  }
};

export default fetchData;