import express from 'express'
import {
  login,
  logout,
  register,
  updateProfile
} from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { singleUpload } from "../middlewares/multer.js";
import upload from '../middlewares/cloud/multer.js';
const router = express.Router();


router.route("/register").post(singleUpload, register);
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


export default router;