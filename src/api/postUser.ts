import axios from "axios";

const API_URL = "https://frontend-test-assignment-api.abz.agency/api/v1";

const postUser = async (formData: FormData, token: string) => {
  try {
    return await axios.post(`${API_URL}/users`, formData, {
      headers: {
        Token: token,
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (e) {
    throw new Error();
  }
};

export default postUser;
