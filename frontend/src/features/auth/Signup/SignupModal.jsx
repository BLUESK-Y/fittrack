import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../../services/api";
import "./SignupModal.css";

const schema = yup.object().shape({
  name: yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
  email: yup.string().required("Email is required").email("Enter a valid email"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const SignupModal = ({ switchToLogin, onSuccess }) => {
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      reset();
      if (switchToLogin) switchToLogin();
    } catch (error) {
      const msg = error.response?.data?.message || "Signup failed. Please try again.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="modal-title">Create Account</h2>
      <p className="modal-subtitle">Enter your details to create your account.</p>

      {serverError && (
        <div className="auth-error-banner">
          <span>⚠️</span> {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <label>Name</label>
          <input type="text" {...register("name")} />
          <p className="error">{errors.name?.message}</p>
        </div>

        <div className="input-group">
          <label>Email</label>
          <input type="email" {...register("email")} />
          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="input-group">
          <label>Password</label>
          <input type="password" {...register("password")} />
          <p className="error">{errors.password?.message}</p>
        </div>

        <div className="input-group">
          <label>Confirm Password</label>
          <input type="password" {...register("confirmPassword")} />
          <p className="error">{errors.confirmPassword?.message}</p>
        </div>

        <button type="submit" className="modal-btn" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="switch-text" style={{ marginTop: "15px" }}>
          Already have an account?{" "}
          <span className="switch-text" onClick={switchToLogin}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default SignupModal;
