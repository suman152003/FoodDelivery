import { createSlice } from "@reduxjs/toolkit";
import {
  getCoupons,
  createCoupon,
  updateCouponAdmin,
  deleteCouponAdmin,
} from "../actions/couponAdminActions";

const initialState = {
  coupons: [],
  loading: false,
  error: null,

  creating: false,
  createError: null,

  updating: false,
  updateError: null,

  deleting: false,
  deleteError: null,
};

const couponAdminSlice = createSlice({
  name: "couponAdmin",
  initialState,
  reducers: {
    clearCouponAdminErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(getCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createCoupon.pending, (state) => {
        state.creating = true;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.creating = false;
        state.coupons.push(action.payload);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      })

      .addCase(updateCouponAdmin.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateCouponAdmin.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.coupons.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
      })
      .addCase(updateCouponAdmin.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      })

      .addCase(deleteCouponAdmin.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteCouponAdmin.fulfilled, (state, action) => {
        state.deleting = false;
        state.coupons = state.coupons.filter(
          (c) => c._id !== action.payload.couponId
        );
      })
      .addCase(deleteCouponAdmin.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = action.payload;
      });
  },
});

export const { clearCouponAdminErrors } = couponAdminSlice.actions;
export default couponAdminSlice.reducer;
