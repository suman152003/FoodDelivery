import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItems,
  removeItemFromCart,
  updateCartQuantity,
} from "../../redux/actions/cartActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupee } from "@fortawesome/free-solid-svg-icons";
import { payment } from "../../redux/actions/orderActions";
import { validateCoupon } from "../../redux/actions/couponActions";
import { clearCoupon } from "../../redux/slices/couponSlice";
import { toast } from "react-toastify"; 

const Cart = () => {
  const dispatch = useDispatch();

  const { cartItems, restaurant } = useSelector((state) => state.cart);
  const {
    applied: appliedCoupon,
    loading: couponLoading,
    error: couponError,
  } = useSelector((state) => state.coupon);

  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.foodItem.price,
    0
  );

  // If the cart total changes, a previously applied coupon no longer
  // reflects the current total, so drop it and make the user re-apply.
  useEffect(() => {
    if (appliedCoupon) {
      dispatch(clearCoupon());
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCouponCode("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  const removeCartItemHandler = (id) => {
    dispatch(removeItemFromCart(id));
    toast.success("Item removed from cart"); 
  };

  const increaseQty = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (newQty > stock) {
      toast.error("Exceeded stock limit");
      return;
    }
    dispatch(updateCartQuantity(id, newQty));
  };

  const decreaseQty = (id, quantity) => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      dispatch(updateCartQuantity(id, newQty));
    } else {
      toast.error("Minimum quantity reached"); 
    }
  };

  const applyCouponHandler = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    dispatch(
      validateCoupon({
        couponCode: couponCode.trim(),
        cartItemsTotalAmount: subtotal,
      })
    );
  };

  const removeCouponHandler = () => {
    dispatch(clearCoupon());
    setCouponCode("");
  };

  const finalTotal = appliedCoupon ? appliedCoupon.finalTotal : subtotal;

  const checkoutHandler = () => {
    dispatch(payment(cartItems, restaurant, appliedCoupon));
    // // navigate("/delivery");
  };

  return (
    <>
      {cartItems.length === 0 ? (
        <h2 className="mt-5">Your Cart is empty</h2>
      ) : (
        <>
          <h2 className="mt-5">
            Your Cart: <b>{cartItems.length} items</b>
          </h2>
          <h3 className="mt-5">
            Restaurant: <b>{restaurant.name}</b>
          </h3>

          <div className="row d-flex justify-content-between cartt">
            <div className="col-12 col-lg-8">
              {cartItems.map((item) => (
                <div className="cart-item" key={item._id}>
                  <div className="row">
                    <div className="col-4 col-lg-3">
                      <img
                        src={item.foodItem.images[0].url}
                        alt="items"
                        height="90"
                        width="115"
                      />
                    </div>

                    <div className="col-5 col-lg-3">
                      {item.foodItem.name}
                    </div>

                    <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                      <p id="card_item_price">
                        <FontAwesomeIcon icon={faIndianRupee} size="xs" />
                        {item.foodItem.price}
                      </p>
                    </div>

                    <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                      <div className="stockCounter d-inline">
                        <span
                          className="btn btn-danger minus"
                          onClick={() =>
                            decreaseQty(item.foodItem._id, item.quantity)
                          }
                        >
                          -
                        </span>

                        <input
                          type="number"
                          className="form-control count d-inline"
                          value={item.quantity}
                          readOnly
                        />

                        <span
                          className="btn btn-primary plus"
                          onClick={() =>
                            increaseQty(
                              item.foodItem._id,
                              item.quantity,
                              item.foodItem.stock
                            )
                          }
                        >
                          +
                        </span>
                      </div>
                    </div>

                    <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                      <i
                        id="delete_cart_item"
                        className="fa fa-trash btn btn-danger"
                        onClick={() =>
                          removeCartItemHandler(item.foodItem._id)
                        }
                      ></i>
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
            </div>

            <div className="col-12 col-lg-3 my-4">
              <div id="order_summary">
                <h4>Order Summary</h4>
                <hr />

                <p>
                  Subtotal:
                  <span className="order-summary-values">
                    {cartItems.reduce(
                      (acc, item) => acc + Number(item.quantity),
                      0
                    )}
                    (Units)
                  </span>
                </p>

                <p>
                  Total:
                  <span className="order-summary-values">
                    <FontAwesomeIcon icon={faIndianRupee} size="xs" />
                    {subtotal.toFixed(2)}
                  </span>
                </p>

                <hr />

                <div className="coupon-section mb-3">
                  {appliedCoupon ? (
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-success">
                        "{appliedCoupon.couponName}" applied
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={removeCouponHandler}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form
                      className="d-flex"
                      onSubmit={applyCouponHandler}
                    >
                      <input
                        type="text"
                        className="form-control mr-2"
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="btn btn-secondary"
                        disabled={couponLoading || !couponCode.trim()}
                      >
                        {couponLoading ? "Checking..." : "Apply"}
                      </button>
                    </form>
                  )}

                  {couponError && (
                    <p className="text-danger mt-2 mb-0">{couponError}</p>
                  )}

                  {appliedCoupon?.message && (
                    <p className="text-info mt-2 mb-0">
                      {appliedCoupon.message}
                    </p>
                  )}
                </div>

                {appliedCoupon && (
                  <p>
                    Discount:
                    <span className="order-summary-values text-success">
                      -<FontAwesomeIcon icon={faIndianRupee} size="xs" />
                      {appliedCoupon.discountAmount.toFixed(2)}
                    </span>
                  </p>
                )}

                <p>
                  <b>Amount Payable:</b>
                  <span className="order-summary-values">
                    <b>
                      <FontAwesomeIcon icon={faIndianRupee} size="xs" />
                      {finalTotal.toFixed(2)}
                    </b>
                  </span>
                </p>

                <hr />

                <button
                  id="checkout_btn"
                  className="btn btn-primary btn-block"
                  onClick={checkoutHandler}
                >
                  Check Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;