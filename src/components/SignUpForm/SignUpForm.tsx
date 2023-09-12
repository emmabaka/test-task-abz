import { useState, useEffect, Dispatch } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
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
  const [errorText, setErrorText] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [positions, setPosition] = useState<Position[]>([]);
  const [load, setLoad] = useState<boolean>(false);

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
  console.log(values.photo);

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
        {errors.name && touched.name && (
          <p className={s.error}>{errors.name}</p>
        )}
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
        {errors.email && touched.email && (
          <p className={s.error}>{errors.email}</p>
        )}
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
        {errors.phone && touched.phone ? (
          <p className={s.error}>{errors.phone}</p>
        ) : (
          <p className={s.helper}>+38 (XXX) XXX - XX - XX</p>
        )}
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
                onChange={(e) => setFieldValue("positionId", e.target.value)}
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
              name="photo"
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
              [s.disabled]: !isFormValid,
              [s.submitButton]: isFormValid,
            })}
            type="submit"
            disabled={!isFormValid}
          >
            Sign up
          </button>
        )}
      </div>
    </form>
  );
};
export default SignUpForm;
