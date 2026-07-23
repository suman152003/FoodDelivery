const express = require("express");

const {
  createCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  couponValidate,
} = require("../controllers/couponController");
const { protect } = require("../controllers/authController");
const { authorizeRoles } = require("../middlewares/authorizeRoles");
const router = express.Router();

router
  .route("/")
  .post(protect, authorizeRoles("admin"), createCoupon)
  .get(protect, authorizeRoles("admin"), getCoupon);
router
  .route("/:couponId")
  .patch(protect, authorizeRoles("admin"), updateCoupon)
  .delete(protect, authorizeRoles("admin"), deleteCoupon);
router.route("/validate").post(couponValidate);

module.exports = router;
