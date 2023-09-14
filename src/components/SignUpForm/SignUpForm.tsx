import { useState, useRef, useEffect, Dispatch } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import { toast, ToastContainer } from "react-toastify";
import fetchData from "../../api/fetchData";
import postUser from "../../api/postUser";
import { RE_EMAIL, RE_PHONE } from "../../regex/regex";
import { Position } from "../../interfaces/interfaces";
import { FormEvent } from "react";
import "react-toastify/dist/ReactToastify.css";
import s from "./SignUpForm.module.scss";

const SignUpForm = ({
  setStatus,
}: {
  setStatus: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [errorText, setErrorText] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [positions, setPosition] = useState<Position[]>([]);
  const [load, setLoad] = useState<boolean>(false);
  const photoFile = useRef<Blob | string>("");

  useEffect(() => {
    fetchData("positions").then((res) => setPosition(res.data.positions));
    fetchData("token").then((res) => setToken(res.data.token));
  }, []);

  const {
    values,
    isValid,
    errors,
    touched,
    handleChange,
    setFieldError,
    setFieldValue,
    setErrors,
    handleBlur,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      photo: "",
      positionId: "",
    },
    validateOnBlur: true,
    validateOnMount: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Must be more than 2 characters")
        .max(60, "Must be 60 characters or less")
        .required("Required"),
      phone: Yup.string()
        .matches(RE_PHONE, "Invalid phone number")
        .required("Required"),
      positionId: Yup.string().required("Required"),
      email: Yup.string()
        .min(2, "Must be more than 2 characters")
        .matches(RE_EMAIL, "Invalid email address")
        .max(100, "Must be 100 characters or less")
        .required("Required"),
      photo: Yup.string().required("Required"),
    }),
    onSubmit: () => {},
  });

  const validatePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];

    if (!file) {
      photoFile.current = "";
      setFieldValue("photo", "");

      return;
    }

    photoFile.current = file;

    setFieldValue("photo", e.target.files![0].name);

    const img = new Image();
    img.src = window.URL.createObjectURL(file);
    img.onload = () => {
      if (img.width < 70 || img.height < 70) {
        setErrorText("The photo must be at least 70x70 pixels in size.");
        return;
      }
    };

    if (!file.type.match("image/jpeg")) {
      setErrorText("The photo must be in JPEG/JPG format.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorText("Photos should be less than 5 MB in size.");
      return;
    } else {
      handleChange(e);
      setErrorText("");
    }
  };

  const notify = () =>
    toast.error("Oops, something went wrong! Please try again.");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoad(true);

    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("position_id", values.positionId);
    formData.append("photo", photoFile.current);

    postUser(
      formData,
      token,
      setFieldError,
      setStatus,
      setErrors,
      notify
    ).finally(() => setLoad(false));
  };

  const onPositionChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFieldValue("positionId", e.target.value);

  return (
    <>
      <form className={s.signUpForm} onSubmit={onSubmit}>
        <div className={s.inputContainer}>
          <input
            className={clsx(s.input, {
              [s.errorInput]: errors.name && touched.name,
            })}
            type="text"
            id="name"
            name="name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
            maxLength={60}
            placeholder=" "
          />
          <label className={s.label} htmlFor="name">
            Your name
          </label>
          <p className={s.error}>
            {errors.name && touched.name && errors.name}
          </p>
        </div>
        <div className={s.inputContainer}>
          <input
            className={clsx(s.input, {
              [s.errorInput]: errors.email && touched.email,
            })}
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            placeholder=" "
          />
          <label className={s.label} htmlFor="email">
            Email
          </label>
          <p className={s.error}>
            {errors.email && touched.email && errors.email}
          </p>
        </div>
        <div className={s.inputContainer}>
          <input
            className={clsx(s.input, {
              [s.errorInput]: errors.phone && touched.phone,
            })}
            type="text"
            id="phone"
            name="phone"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.phone}
            maxLength={13}
            placeholder=" "
          />
          <label className={s.label} htmlFor="phone">
            Phone
          </label>
          <p
            className={clsx({
              [s.error]: errors.phone && touched.phone,
              [s.helper]: !errors.phone || !touched.phone,
            })}
          >
            {errors.phone && touched.phone
              ? errors.phone
              : "+38 (XXX) XXX - XX - XX"}
          </p>
        </div>
        <div className={s.radioContainer}>
          <p className={s.radioTitle}>Select your position</p>
          {positions.map((item: Position, i) => {
            return (
              <label key={i} className={s.radioLabel}>
                <input
                  className={s.visuallyHidden}
                  type="radio"
                  name="position_id"
                  value={item.id}
                  onChange={onPositionChange}
                />
                <span className={s.outerCircle}></span>
                <span className={s.innerCircle}></span>
                <span className={s.radioLabelText}>{item.name}</span>
              </label>
            );
          })}
        </div>
        <div className={s.upload}>
          <div className={s.uploadContainer}>
            <label
              className={clsx(s.uploadLabel, {
                [s.errorInput]: errorText,
              })}
              htmlFor="photo"
            >
              Upload
            </label>
            <div
              className={clsx(s.inputUploadContainer, {
                [s.errorInput]: errorText,
              })}
            >
              <input
                className={clsx({
                  [s.uploadInputEmpty]: !values.photo,
                  [s.uploadInput]: values.photo,
                })}
                type="file"
                title={values.photo || ""}
                name="photo"
                accept=".jpg, .jpeg"
                id="photo"
                onChange={validatePhoto}
                onBlur={handleBlur}
              />
            </div>
          </div>
          <p className={s.error}>{errorText}</p>
        </div>
        <div className={s.spinnerWrapper}>
          {load ? (
            <div className="loader"></div>
          ) : (
            <button
              className={clsx({
                [s.disabled]: !isValid,
                [s.submitButton]: isValid,
              })}
              type="submit"
              disabled={!isValid}
            >
              Sign up
            </button>
          )}
        </div>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default SignUpForm;
