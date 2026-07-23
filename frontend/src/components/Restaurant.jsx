import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  deleteRestaurant,
  analyzeReviews,
  addRestaurantReview,
} from "../redux/actions/restaurantAction";

const Restaurant = ({ restaurant }) => {
  const dispatch = useDispatch();
  const [showAI, setShowAI] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { isAuthenticated, user } = useSelector(
    (state) => state.user || {}
  );
  const { submittingReview, reviewError } = useSelector(
    (state) => state.restaurants
  );

  const restaurantImage = restaurant.images?.[0]?.url || "/images/template.jpeg";
  const restaurantBadge = restaurant.isVeg ? "Pure Veg" : "Mixed Menu";

  //DELETE
  const handleDelete = () => {
    if (!window.confirm("Delete this restaurant?")) return;

    dispatch(deleteRestaurant(restaurant._id)).catch(() => {
      alert("Unable to delete");
    });
  };

  //RE-ANALYZE REVIEWS (admin)
  const handleAnalyze = () => {
    dispatch(analyzeReviews(restaurant._id));
  };

  //SUBMIT REVIEW
  const submitReviewHandler = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      addRestaurantReview({
        restaurantId: restaurant._id,
        rating: Number(rating),
        Comment: comment,
      })
    );

    if (addRestaurantReview.fulfilled.match(result)) {
      toast.success("Review submitted");
      setShowReviewForm(false);
      setComment("");
      setRating(5);
    }
  };

  return (
    <div className="col-sm-12 col-md-6 col-lg-4 my-3">
      <div className="card restaurant-card p-3">
        <Link to={`/eats/stores/${restaurant._id}/menus`} className="restaurant-link">
          <img
            className="restaurant-image"
            src={restaurantImage}
            alt={restaurant.name}
          />
        </Link>

        <div className="restaurant-info">
          <div className="restaurant-top-row">
            <h4>{restaurant.name}</h4>
            <span className="restaurant-rating-pill">★ {restaurant.ratings || 4.5}</span>
          </div>

          <div className="restaurant-badges">
            <span className="restaurant-badge">{restaurantBadge}</span>
            <span className="restaurant-badge restaurant-badge-soft">
              {restaurant.numOfReviews || 0} reviews
            </span>
          </div>

          <p className="rest_address">{restaurant.address}</p>

          <div className="restaurant-menu-preview">
            <span>Featured</span>
            <span>Bestsellers</span>
            <span>Desserts</span>
          </div>

          <div className="d-flex flex-wrap mt-2">
            {restaurant.reviewSentiment && (
              <button className="ai-btn mr-2" onClick={() => setShowAI(!showAI)}>
                {showAI ? "➖ Hide Summary" : "💬 View Review Summary"}
              </button>
            )}

            {isAuthenticated && (
              <button
                className="btn btn-sm btn-outline-secondary mr-2"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? "Cancel" : "✍️ Write a Review"}
              </button>
            )}

            {isAuthenticated && user && user.role === "admin" && (
              <button className="btn btn-sm btn-outline-info" onClick={handleAnalyze}>
                🔄 Re-analyze Reviews
              </button>
            )}
          </div>
        </div>

    {showAI && (
      <div className="ai-insights-box">

      <div className="ai-status">
      Review Summary : 
          😊 <strong>
            {restaurant.reviewSentiment}
          </strong>
       
        </div>

        <ul>
          {(restaurant.reviewSummaryBullets || []).map(
            (point, index) => (
              <li key={index}>{point}</li>
            )
          )}
        </ul>

        <div className="mentions">
          {(restaurant.reviewTopMentions || []).map(
            (item, index) => (
              <span
                key={index}
                className="mention-tag"
              >
                #{item}
              </span>
            )
          )}
        </div>

      </div>
    )}

    {showReviewForm && (
      <form className="review-form mt-3" onSubmit={submitReviewHandler}>
        {reviewError && <p className="text-danger">{reviewError}</p>}

        <div className="form-group">
          <label>Rating</label>
          <select
            className="form-control"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
            <option value="4">⭐⭐⭐⭐ (4)</option>
            <option value="3">⭐⭐⭐ (3)</option>
            <option value="2">⭐⭐ (2)</option>
            <option value="1">⭐ (1)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Comment</label>
          <textarea
            className="form-control"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>

        <button
          className="btn btn-primary btn-sm"
          type="submit"
          disabled={submittingReview}
        >
          {submittingReview ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    )}

</div>

 {isAuthenticated && user && user.role === "admin" && (
            <button
              className="btn btn-danger btn-sm mt-2"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
    </div>
  );
};

export default Restaurant;
