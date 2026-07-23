const express = require("express");
const router = express.Router();

const {
  newOrder,
  getSingleOrder,
  myOrders,
  allOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const authController = require("../controllers/authController");
const { authorizeRoles } = require("../middlewares/authorizeRoles");

router.route("/new").post(authController.protect, newOrder);

// admin routes (must come before the generic "/:id" route)
router
  .route("/admin/allOrders")
  .get(authController.protect, authorizeRoles("admin"), allOrders);
router
  .route("/admin/:id")
  .put(authController.protect, authorizeRoles("admin"), updateOrderStatus);

router.route("/:id").get(authController.protect, getSingleOrder);
router.route("/me/myOrders").get(authController.protect, myOrders);

module.exports = router;
