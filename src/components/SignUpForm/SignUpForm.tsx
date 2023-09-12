import { useState, useEffect, Dispatch } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import fetchData from "../../api/fetchData";
import postUser from "../../api/postUser";
import { Position } from "../../interfaces/interfaces";
import { FormEvent } from "react";
import s from "./SignUpForm.module.scss";

const SignUpForm = ({
  setStatus,
}: {
  setStatus: Dispatch<React.SetStateAction<string>>;
}) => {
  const [errorText, setErrorText] = useState("");
  const [token, setToken] = useState("");
  const [positions, setPosition] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    fetchData("positions").then((res) => setPosition(res.data.positions));
    fetchData("token").then((res) => setToken(res.data.token));
  }, []);

  const { values, errors, touched, handleChange, setFieldValue, handleBlur } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        phone: "",
        photo: "",
        positionId: "",
      },
      validateOnBlur: true,
      validationSchema: Yup.object({
        name: Yup.string()
          .min(2, "Must be more than 2 characters")
          .max(60, "Must be 60 characters or less")
          .required("Required"),
        phone: Yup.string()
          .matches(/^\+380\d{9}$/, "Invalid phone number")
          .required("Required"),
        email: Yup.string()
          .min(2, "Must be more than 2 characters")
          .email("Invalid email address")
          .max(100, "Must be 100 characters or less")
          .required("Required"),
        photo: Yup.string().required("Required"),
      }),
      onSubmit: () => {},
    });

  const validatePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];

    const img = new Image();
    img.src = window.URL.createObjectURL(file);
    img.onload = () => {
      if (img.width < 70 || img.height < 70) {
        setErrorText("The photo must be at least 70x70 pixels in size.");
        e.target.value = "";
        return;
      }
    };

    if (!file.type.match("image/jpeg")) {
      setErrorText("The photo must be in JPEG/JPG format.");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorText("Photos should be less than 5 MB in size.");
      e.target.value = "";
      return;
    } else {
      handleChange(e);
      setErrorText("");
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoad(true);

    const formData = new FormData();
    const formElement = e.target as HTMLFormElement;
    const photoInput = formElement.elements.namedItem(
      "photo"
    ) as HTMLInputElement | null;

    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("position_id", values.positionId);
    if (photoInput && photoInput.files)
      formData.append("photo", photoInput.files[0]);

    postUser(formData, token)
      .then((res) => {
        setStatus(String(res.status));
      })
      .catch((err) => {
        console.log(err);
        setStatus("");
      })
      .finally(() => setLoad(false));
  };

  const isFormValid =
    values.name.trim() !== "" &&
    values.email.trim() !== "" &&
    values.phone.trim() !== "" &&
    values.photo.trim() !== "" &&
    values.positionId !== "";

  return (
    <form className={s.signUpForm} onSubmit={onSubmit}>
      <div className={s.inputContainer}>
        <input
            className={
              errors.name && touched.name ? `${s.input} ${s.errorInput}` : s.input
            }
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
        {errors.name && touched.name && (
          <p className={s.error}>{errors.name}</p>
        )}
      </div>

      <div className={s.inputContainer}>
        <input
          className={
            errors.phone && touched.phone
              ? `${s.input} ${s.errorInput}`
              : s.input
          }
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
        {errors.phone && touched.phone ? (
          <p className={s.error}>{errors.phone}</p>
        ) : (
          <p className={s.helper}>+38 (XXX) XXX - XX - XX</p>
        )}
      </div>

      <div className={s.inputContainer}>
        <input
          className={
            errors.email && touched.email
              ? `${s.input} ${s.errorInput}`
              : s.input
          }
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
        {errors.email && touched.email && (
          <p className={s.error}>{errors.email}</p>
        )}
      </div>
      <div className={s.radioContainer}>
        <p className={s.radioTitle}>Select your position</p>
        {positions.map((item: Position, i) => {
          return (
            <div key={i} className={s.radioWrapper}>
              <input
                type="radio"
                id={String(item.id)}
                name="position_id"
                value={item.id}
                onChange={(e) => setFieldValue("positionId", e.target.value)}
              />
              <label htmlFor={String(item.id)}> {item.name}</label>
            </div>
          );
        })}
      </div>
      <div className={s.upload}>
        <div className={s.uploadContainer}>
          <label
            className={
              errorText ? `${s.uploadLabel} ${s.errorInput}` : s.uploadLabel
            }
            htmlFor="photo"
          >
            Upload
          </label>
          <div
            className={
              errorText
                ? `${s.inputUploadContainer} ${s.errorInput}`
                : s.inputUploadContainer
            }
          >
            <input
              className={!values.photo ? s.uploadInputEmpty : s.uploadInput}
              type="file"
              name="photo"
              id="photo"
              onChange={validatePhoto}
              onBlur={handleBlur}
              value={values.photo}
            />
          </div>
        </div>
        <p className={s.error}>{errorText}</p>
      </div>
      <div className={s.spinnerWrapper}>
        {load ? (
          <div className={s.loader}>load</div>
        ) : (
          <button
            className={isFormValid ? s.submitButton : s.disabled}
            type="submit"
            disabled={!isFormValid}
          >
            Submit
          </button>
        )}
      </div>
    </form>
  );
};
export default SignUpForm;
