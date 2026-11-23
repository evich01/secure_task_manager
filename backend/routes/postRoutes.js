import express from "express";
import { authenticateAccessToken } from "../controllers/userController.js";

import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/posts", authenticateAccessToken, getPosts);

router.post("/create", authenticateAccessToken, createPost);

router.get("/post/:id", authenticateAccessToken, getPost);

router.patch("/update/:id", authenticateAccessToken, updatePost);

router.delete("/delete/:id", authenticateAccessToken, deletePost);

export default router;
