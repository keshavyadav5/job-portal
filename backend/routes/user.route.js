import express from 'express'
import {
  google,
  login,
  logout,
  register,
  updateProfile
} from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/cloud/multer.js';
const router = express.Router();
import jwt from "jsonwebtoken";

router.route("/register").post(
  upload.fields([
    { name: "profilePhoto", maxCount: 1 }
  ]), register);

router.route('/login').post(login);
router.route('/logout').post(logout);

router.put(
  "/profile/update",
  isAuthenticated,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]),
  updateProfile
);

router.route('/google').post(google);

export default router;