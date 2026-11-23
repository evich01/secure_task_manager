import dotenv from "dotenv";
import postModel from "../db/posts.js";

dotenv.config();

export const getPosts = async (req, res) => {
  try {
    const posts = await postModel.find({ author: req.user.userId });
    res.status(200).json(posts);
  } catch {
    res.status(500).json({ message: `Error fetching posts` });
  }
};

export const createPost = async (req, res) => {
  const { post } = req.body;

  if (!post) return res.status(400).json({ message: "No post found" });
  try {
    const newPost = await postModel.create({
      post: post,
      author: req.user.userId,
    });

    res.status(201).json(newPost);
  } catch {
    res.status(500).json({ message: `Error creating post` });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const selectedPost = await postModel.findById(id);
    if (!selectedPost) {
  return res.status(404).json({
    message: "Post not found"
  });
}
    res.status(200).json(selectedPost);
  } catch {
    res.status(500).json({ message: `Error fetching post` });
  }
};
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { post } = req.body;

  try {
    // Check if post content was provided
    if (!post) {
      return res.status(400).json({
        message: "Post content is required",
      });
    }

    // Find the post first
    const selectedPost = await postModel.findById(id);

    // Check if post exists
    if (!selectedPost) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Authorization check
    if (selectedPost.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Unauthorized to update this post",
      });
    }

    // Update post
    selectedPost.post = post;

    await selectedPost.save();

    res.status(200).json({
      message: "Post updated successfully",
      updatedPost: selectedPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating post",
      error: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    // Find post first
    const selectedPost = await postModel.findById(id);

    // Check if post exists
    if (!selectedPost) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Authorization check
    if (selectedPost.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Unauthorized to delete this post",
      });
    }

    // Delete post
    await postModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting post",
      error: error.message,
    });
  }
};