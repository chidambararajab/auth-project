/**
 * Login Page
 * User login form using React Hook Form and React Query
 */
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import type { LoginData } from "../api/auth";
import Input from "../components/Input";
import Button from "../components/Button";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  // Query part send
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      navigate("/dashboard");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.error ||
        "Login failed. Please check your credentials.";
      alert(errorMessage);
    },
  });

  // Form submission handler
  const onSubmit = (data: LoginData) => {
    mutation.mutate(data);
  };

  return (
    <div className="page-container">
      <div className="card">
        <h1 className="page-title">Login</h1>
        <p className="page-description">Sign in to your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <Input
            label="Username"
            name="username"
            type="text"
            register={register}
            errors={errors}
            required
            placeholder="Enter username"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            register={register}
            errors={errors}
            required
            placeholder="Enter your password"
          />

          <Button
            type="submit"
            isLoading={mutation.isPending}
            disabled={mutation.isPending}
          >
            Login
          </Button>
        </form>

        <div className="form-footer">
          Don't have an account?{" "}
          <Link to="/register" className="link">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
