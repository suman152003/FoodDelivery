import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// List all coupons (admin)
export const getCoupons = createAsyncThunk(
  "couponAdmin/getCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/v1/coupon");
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch coupons"
      );
    }
  }
);

// Create a coupon (admin)
export const createCoupon = createAsyncThunk(
  "couponAdmin/createCoupon",
  async (couponData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/v1/coupon", couponData, {
        headers: { "Content-Type": "application/json" },
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to create coupon"
      );
    }
  }
);

// Update a coupon (admin)
export const updateCouponAdmin = createAsyncThunk(
  "couponAdmin/updateCoupon",
  async ({ couponId, couponData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(
        `/v1/coupon/${couponId}`,
        couponData,
        { headers: { "Content-Type": "application/json" } }
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to update coupon"
      );
    }
  }
);

// Delete a coupon (admin)
export const deleteCouponAdmin = createAsyncThunk(
  "couponAdmin/deleteCoupon",
  async (couponId, { rejectWithValue }) => {
    try {
      await api.delete(`/v1/coupon/${couponId}`);
      return { couponId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to delete coupon"
      );
    }
  }
);
