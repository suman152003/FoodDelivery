import { createSlice } from "@reduxjs/toolkit";
import { validateCoupon } from "../actions/couponActions";

const initialState = {
  loading: false,
  error: null,
  applied: null, // { couponName, finalTotal, discountAmount, message }
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    clearCoupon: (state) => {
      state.applied = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.applied = action.payload;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.applied = null;
      });
  },
});

export const { clearCoupon } = couponSlice.actions;
export default couponSlice.reducer;
