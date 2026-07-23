import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { forgotPassword } from "../../redux/actions/userActions";
import { clearErrors, clearMessage } from "../../redux/slices/userSlice";
import Loader from "../layout/Loader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const { error, message, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [dispatch, error, message]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="row wrapper">
          <div className="col-10 col-lg-5">
            <form className="shadow-lg" onSubmit={submitHandler}>
              <h1 className="mb-3">Forgot Password</h1>

              <p className="mb-4">
                Enter the email address associated with your account and
                we'll send you a link to reset your password.
              </p>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button className="btn btn-block py3" type="submit">
                Send Reset Link
              </button>

              <Link to="/users/login" className="float-right mt-3">
                Back to Login
              </Link>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgotPassword;
