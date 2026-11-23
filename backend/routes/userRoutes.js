import express from "express";
import {
  authenticateAccessToken,
  deleteUser,
  fetchUserData,
  resetPassword,
  updateUser,
} from "../controllers/userController.js";
import {
  createUser,
  deleteToken,
  getToken,
  getUsers,
  login,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/user/:id", authenticateAccessToken, fetchUserData);

router.patch("/user/:id", authenticateAccessToken, updateUser);

router.patch("/admin/reset/:id", authenticateAccessToken, resetPassword)

router.delete("/user/:id", authenticateAccessToken, deleteUser);

router.post("/signup", createUser);

router.post("/login", login);

router.post("/token", getToken);

router.delete("/logout", authenticateAccessToken, deleteToken);

export default router;
