import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  getCoupons,
  createCoupon,
  updateCouponAdmin,
  deleteCouponAdmin,
} from "../../redux/actions/couponAdminActions";
import { clearCouponAdminErrors } from "../../redux/slices/couponAdminSlice";
import Loader from "../layout/Loader";

const emptyForm = {
  couponName: "",
  subTitle: "",
  minAmount: "",
  maxDiscount: "",
  discount: "",
  details: "",
  expire: "",
};

const AdminCoupons = () => {
  const dispatch = useDispatch();

  const {
    coupons,
    loading,
    error,
    creating,
    createError,
    updating,
    updateError,
    deleting,
    deleteError,
  } = useSelector((state) => state.couponAdmin);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(getCoupons());
  }, [dispatch]);

  useEffect(() => {
    [error, createError, updateError, deleteError].forEach((e) => {
      if (e) toast.error(e);
    });
    if (error || createError || updateError || deleteError) {
      dispatch(clearCouponAdminErrors());
    }
  }, [error, createError, updateError, deleteError, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      minAmount: Number(form.minAmount),
      discount: Number(form.discount),
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
    };

    if (editingId) {
      const result = await dispatch(
        updateCouponAdmin({ couponId: editingId, couponData: payload })
      );
      if (updateCouponAdmin.fulfilled.match(result)) {
        toast.success("Coupon updated");
        resetForm();
      }
    } else {
      const result = await dispatch(createCoupon(payload));
      if (createCoupon.fulfilled.match(result)) {
        toast.success("Coupon created");
        resetForm();
      }
    }
  };

  const editHandler = (coupon) => {
    setEditingId(coupon._id);
    setForm({
      couponName: coupon.couponName || "",
      subTitle: coupon.subTitle || "",
      minAmount: coupon.minAmount ?? "",
      maxDiscount: coupon.maxDiscount ?? "",
      discount: coupon.discount ?? "",
      details: coupon.details || "",
      expire: coupon.expire ? coupon.expire.substring(0, 10) : "",
    });
  };

  const deleteHandler = (couponId) => {
    if (!window.confirm("Delete this coupon?")) return;
    dispatch(deleteCouponAdmin(couponId));
  };

  return (
    <div className="my-4">
      <h1 className="mb-4">Manage Coupons (Admin)</h1>

      <div className="row">
        <div className="col-12 col-lg-5">
          <form className="shadow-lg p-4 rounded" onSubmit={submitHandler}>
            <h4>{editingId ? "Edit Coupon" : "Create Coupon"}</h4>

            <div className="form-group">
              <label>Code</label>
              <input
                type="text"
                name="couponName"
                className="form-control"
                value={form.couponName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Subtitle</label>
              <input
                type="text"
                name="subTitle"
                className="form-control"
                value={form.subTitle}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Details</label>
              <input
                type="text"
                name="details"
                className="form-control"
                value={form.details}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Min Order Amount (₹)</label>
              <input
                type="number"
                name="minAmount"
                className="form-control"
                value={form.minAmount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Discount (%)</label>
              <input
                type="number"
                name="discount"
                className="form-control"
                value={form.discount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Max Discount (₹) — optional</label>
              <input
                type="number"
                name="maxDiscount"
                className="form-control"
                value={form.maxDiscount}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Expires On</label>
              <input
                type="date"
                name="expire"
                className="form-control"
                value={form.expire}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={creating || updating}
            >
              {editingId
                ? updating
                  ? "Saving..."
                  : "Save Changes"
                : creating
                ? "Creating..."
                : "Create Coupon"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary ml-2"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="col-12 col-lg-7 mt-4 mt-lg-0">
          {loading ? (
            <Loader />
          ) : coupons.length > 0 ? (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Min Amount</th>
                  <th>Expires</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id}>
                    <td>{coupon.couponName}</td>
                    <td>{coupon.discount}%</td>
                    <td>₹{coupon.minAmount}</td>
                    <td>
                      {coupon.expire
                        ? new Date(coupon.expire).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary mr-2"
                        onClick={() => editHandler(coupon)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        disabled={deleting}
                        onClick={() => deleteHandler(coupon._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No coupons yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;
