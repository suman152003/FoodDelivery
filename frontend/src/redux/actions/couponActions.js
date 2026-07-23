import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Validate a coupon code against the current cart total.
// Returns the discounted total, the discount amount, and any message
// (e.g. "add ₹50 more to avail this offer").
export const validateCoupon = createAsyncThunk(
  "coupon/validate",
  async ({ couponCode, cartItemsTotalAmount }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/v1/coupon/validate", {
        couponCode,
        cartItemsTotalAmount,
      });

      const coupon = data.data;
      const discountAmount = Math.max(
        0,
        cartItemsTotalAmount - coupon.finalTotal
      );

      return {
        couponName: coupon.couponName,
        finalTotal: coupon.finalTotal,
        discountAmount,
        message: coupon.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid coupon code."
      );
    }
  }
);
