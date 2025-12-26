/**
 * Register Page
 * User registration form using React Hook Form and React Query
 */
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import type { RegisterData } from "../api/auth";
import Input from "../components/Input";
import Button from "../components/Button";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      alert("Registration successful! Please login.");
      navigate("/login");
    },
    onError: (error: any) => {
      let errorMessage = "Registration failed. Please try again.";

      alert(errorMessage);
    },
  });

  // Form submission handler
  const onSubmit = (data: RegisterData) => {
    mutation.mutate(data);
  };

  return (
    <div className="page-container">
      <div className="card">
        <h1 className="page-title">Register</h1>
        <p className="page-description">Create a new account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <Input
            label="Username"
            name="username"
            type="text"
            register={register}
            errors={errors}
            required
            placeholder="Enter your username"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            register={register}
            errors={errors}
            required
            placeholder="Enter your password (min 8 characters)"
          />

          <Button
            type="submit"
            isLoading={mutation.isPending}
            disabled={mutation.isPending}
          >
            Register
          </Button>
        </form>

        {mutation.isSuccess && (
          <div className="success-message">
            Registration successful! Redirecting to login...
          </div>
        )}

        <div className="form-footer">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
