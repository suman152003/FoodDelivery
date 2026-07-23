import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addItemToCart,
  updateCartQuantity,
  removeItemFromCart,
} from "../redux/actions/cartActions";
import { deleteFoodItem } from "../redux/actions/menuActions";

const Fooditem = ({ fooditem, restaurant }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //state (Redux Toolkit user slice)
  const { user } = useSelector((state) => state.user);
  const isAuthenticated = !!user;

  //cart from slice
  const { cartItems } = useSelector((state) => state.cart);

  const foodImage = fooditem.images?.[0]?.url || "/images/placeholder.png";
  const stockState = fooditem.stock > 0 ? "Fresh pick" : "Sold out";

  // Derive quantity/showButtons straight from redux state instead of
  // mirroring it into local state via useEffect (avoids cascading renders).
  const cartItem = cartItems.find(
    (item) => item.foodItem._id === fooditem._id
  );
  const quantity = cartItem ? cartItem.quantity : 1;
  const showButtons = !!cartItem;

  // ➖ decrease
  const decreaseQty = () => {
    if (quantity > 1) {
      dispatch(updateCartQuantity(fooditem._id, quantity - 1));
    } else {
      dispatch(removeItemFromCart(fooditem._id));
    }
  };

  // ➕ increase
  const increaseQty = () => {
    if (quantity < fooditem.stock) {
      dispatch(updateCartQuantity(fooditem._id, quantity + 1));
    } else {
      alert("Exceeded stock limit");
    }
  };

  //add to cart
  const addToCartHandler = () => {
    if (!isAuthenticated) {
      return navigate("/users/login");
    }

    dispatch(addItemToCart(fooditem._id, restaurant, quantity));
  };

  return (
    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
      <div className="card p-3 rounded">
        <img
          className="card-img-top mx-auto food-image"
          src={foodImage}
          alt={fooditem.name}
        />

        <div className="card-body d-flex flex-column">
          <div className="food-card-badges">
            <span className="food-chip">{stockState}</span>
          </div>
          <h5 className="card-title">{fooditem.name}</h5>

          <p className="fooditem_des">{fooditem.description}</p>

          <p className="card-text">
            <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
            {fooditem.price}
          </p>

          {!showButtons ? (
          
            (!isAuthenticated || user?.role !== "admin") && (
              <button
              id="cart_btn"
              className="btn btn-primary ml-4"
              disabled={fooditem.stock === 0}
              onClick={addToCartHandler}
            >
              Add to Cart
            </button>
            )
          ) : (
            <div className="stockCounter d-inline">
              <span className="btn btn-danger minus" onClick={decreaseQty}>
                -
              </span>

              <input
                type="number"
                className="form-control count d-inline"
                value={quantity}
                readOnly
              />

              <span className="btn btn-primary plus" onClick={increaseQty}>
                +
              </span>
            </div>
          )}

          <hr />

          <p>
            Status:
            <span
              className={
                fooditem.stock > 0 ? "greenColor" : "redColor"
              }
            >
              {fooditem.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </p>

          {/* ADMIN DELETE */}
          {isAuthenticated && user?.role === "admin" && (
            <button
              className="btn btn-danger btn-sm mt-2"
              onClick={() => {
                if (!window.confirm("Delete this food item?")) return;
                dispatch(deleteFoodItem(fooditem._id));
              }}
            >
              Delete
            </button>
          )} 
        </div>
      </div>
    </div>
  );
};

export default Fooditem;