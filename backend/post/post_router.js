const PostModel = require("./post_model");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { isUserAuthenticated } = require("../auth/auth_service");
const { uploadImage } = require("../image/image_service");
const path = require("path");
const fs = require("fs");

router.get("/", async (req, res, next) => {
  console.log("checking user to retrieve posts");
  const user = isUserAuthenticated(req);
  if (user) {
    const postsData = await PostModel.find();
    const posts = postsData.map((p) => ({
      user_name: p.user.name,
      user_profile: p.user.image,
      post_id: p.id,
      posted_time: p.createdTime,
      post_image:
        p.image == undefined
          ? null
          : "http://localhost:3001/api/images/" + p.image,
      post_content: p.content,
      post_likes: p.likedUsers.length,
      location: p.location,
      liked: p.likedUsers.includes(user._id),
    }));
    return res.send(posts);
  }
  return res.status(401).send({ message: "not authorized" });
});

router.post("/upload", async (req, res, _) => {
  user = isUserAuthenticated(req);
  if (user) {
    let uploadPath;
    let file;
    if (req.files) {
      file = req.files.image;
      const extension = file.name.split(".").pop();
      const newFileName = crypto.randomUUID() + "." + extension;
      if (!fs.existsSync(path.join(__dirname, "..", "storage", "images"))) {
        fs.mkdirSync(path.join(__dirname, "..", "storage", "images"), {
          recursive: true,
        });
      }
      uploadPath = path.join(__dirname, "..", "storage", "images", newFileName);
      return file.mv(uploadPath, async (err) => {
        console.log("calling mv");
        if (err) {
          return res.status(500).send({ message: "unable to upload image" });
        }
        console.log("user_image", user.image);
        const post = new PostModel({
          content: req.body.postDetails,
          image: newFileName,
          location: req.body.location,
          user: { id: user._id, image: user.image, name: user.name },
          likedUsers: [],
        });

        await post.save();
        return res.send({ message: "post created" });
      });
    } else {
      const post = new PostModel({
        content: req.body.postDetails,
        location: req.body.location,
        user: { id: user._id, image: user.image, name: user.name },
        likedUsers: [],
      });

      await post.save();
      return res.send({ message: "post created" });
    }
  }
  return res.status(401).send({ message: "user not authenticated" });
});

router.post("/like", async (req, res, _) => {
  user = isUserAuthenticated(req);
  if (user) {
    const post = await PostModel.findById(req.body.post_id);
    if (post) {
      const index = post.likedUsers.indexOf(user._id);
      if (index == -1) {
        post.likedUsers.push(user._id);
      } else {
        post.likedUsers.splice(index, 1);
      }
      const updatedPost = await post.save();
      return res.send({
        user_name: updatedPost.user.name,
        user_profile: updatedPost.user.image,
        post_id: updatedPost.id,
        posted_time: updatedPost.createdTime,
        post_image: "http://localhost:3001/api/images/" + updatedPost.image,
        post_content: updatedPost.content,
        post_likes: updatedPost.likedUsers.length,
        location: updatedPost.location,
        liked: updatedPost.likedUsers.includes(user._id),
      });
    }
    return res.status(404).send("post not found");
  }
  return res.status(401).send("un authenticated");
});

module.exports = router;
