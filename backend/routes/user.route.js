import express from 'express'
import {
  changePassword,
  forgotPassword,
  google,
  login,
  logout,
  refreshAccessToken,
  register,
  updateProfile,
  verification,
  verifyOtp
} from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/cloud/multer.js';
const router = express.Router();

router.route("/register").post(
  upload.fields([
    { name: "profilePhoto", maxCount: 1 }
  ]), register);
router.route('/verify').post(verification);
router.route('/login').post(login);
router.route('/logout').post(logout);


router.route('/refresh').get(refreshAccessToken);

router.put(
  "/profile/update",
  isAuthenticated,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]),
  updateProfile
);

router.route('/forgot-password').post(forgotPassword);
router.route('/verify-otp/:email').post(verifyOtp);
router.route('/change-password/:email').post(changePassword);

router.route('/google').post(google);

export default router;