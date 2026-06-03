import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  email: yup.string().required("Email is required").email("Enter a valid email"),
  password: yup.string().required("Password is required"),
});

const LoginModal = ({ switchToSignup, onSuccess }) => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      // res.data is the user object (interceptor unwrapped it)
      localStorage.setItem("user", JSON.stringify(res.data));
      if (onSuccess) onSuccess();
      navigate("/dashboard");
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong. Please try again.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="modal-title">Welcome Back</h2>
      <p className="modal-subtitle">Please enter your details to access your dashboard.</p>

      {serverError && (
        <div className="auth-error-banner">
          <span>⚠️</span> {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            className={errors.email ? "input-error" : ""}
            {...register("email")}
          />
          {errors.email && <p className="field-error">⚠ {errors.email.message}</p>}
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            className={errors.password ? "input-error" : ""}
            {...register("password")}
          />
          {errors.password && <p className="field-error">⚠ {errors.password.message}</p>}
        </div>

        <button type="submit" className="modal-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="switch-text">
          Don't have an account?{" "}
          <span onClick={switchToSignup}>Sign Up</span>
        </p>
      </form>
    </div>
  );
};

export default LoginModal;
