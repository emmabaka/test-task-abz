import { Dispatch, SetStateAction } from "react";
import axios, { AxiosError } from "axios";
import { FormikErrors } from "formik";
import { API_URL } from "../constants/constants";
import { Id } from "react-toastify";

type ErrResponse = {
  fails: { [key: string]: string[] };
  message: string;
  success: boolean;
};

const postUser = async (
  formData: FormData,
  token: string,
  setFieldError: (field: string, value: string | undefined) => void,
  setStatus: Dispatch<SetStateAction<boolean>>,
  setErrors: (
    errors: FormikErrors<{
      [key: string]: string[];
    }>
  ) => void,
  notify: { (): Id; (): void; }) => {
  try {
    const res = await axios.post(`${API_URL}/users`, formData, {
      headers: {
        Token: token,
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.status === 201) setStatus(true);

    return res;
  } catch (error) {
    const { response } = error as AxiosError;

    if (!response) return;

    if (response.status === 409) {
      setFieldError("phone", "Phone may already exist");
      setFieldError("email", "Email may already exist");
    }

    if (response.status === 422) {
      const errData = response.data as ErrResponse;

      setErrors(errData.fails);
    }

    if (response.status >= 500) {
      notify();
    }
  }
};

export default postUser;
