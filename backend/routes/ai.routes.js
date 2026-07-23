const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller");
const { protect } = require("../controllers/authController");
const { authorizeRoles } = require("../middlewares/authorizeRoles");


// router.post("/generate-food-ai", aiController.generateFoodAI);
router.get("/test", (req, res) => {
  res.send("AI route working");
});
// router.post(
//   "/generate-food-ai/:foodId",
//   aiController.generateAndSaveFoodAI
// );

// GENERATE ONLY
router.post(
  "/generate-food-ai",
  protect,
  authorizeRoles("admin"),
  aiController.generateFoodAI
);

// GENERATE + SAVE
router.post(
  "/generate-food-ai/:foodId",
  protect,
  authorizeRoles("admin"),
  (req, res, next) => {
    console.log("FOOD ID:", req.params.foodId);
    next();
  },
  aiController.generateAndSaveFoodAI
);

//analyzer
router.put(
  "/admin/restaurants/:id/analyze",
  protect,
  authorizeRoles("admin"),
  aiController.analyzeRestaurantReviews
);




// const restaurantController = require(
//   "../controllers/restaurant.controller"
// );

router.put(
  "/stores/:id/review",
  protect,
  aiController.addReview
);



module.exports = router;