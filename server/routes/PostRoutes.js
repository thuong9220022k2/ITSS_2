const express = require("express");
const {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  searchPost,
  getPostsByUser,
  getMyPosts,
  getPostsPending
} = require("../controllers/PostController");

const router = express.Router();

router.get('/',getAllPosts)
router.get('/my-post',getMyPosts)
router.get('/pending-post',getPostsPending)
router.get('/by-user/:uid',getPostsByUser)
router.post("/",createPost);
router.post("/search",searchPost)
router.post("/:id/like",likePost)
router.route("/:id").get(getPostById).put(updatePost).delete(deletePost);

module.exports = router;
