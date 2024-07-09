const POST = require("../model/postModel");
const USER = require("../model/userModel")
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const createPost = async (req, res) => {
    const { text } = req.body;
    const image = req.files ? req.files.imagePath : null; 
    req.body.user = req.user.userId; 

    try {
        let imagePath = null;

        // Upload image to Cloudinary if exists
        if (image) {
            const result = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "backend-api",
            });
            console.log("Cloudinary upload successful", result);
            if (result && result.secure_url) {
                imagePath = result.secure_url;
                fs.unlinkSync(image.tempFilePath); 
            } else {
                console.log("Cloudinary upload failed");
                return res.status(500).json({ success: false, message: "Post failed to upload" });
            }
        }

        // Create new post using POST model
        const post = new POST({ text, imagePath, user: req.user.userId });
        await post.save();
        res.status(201).json({ success: true, message: "Post created successfully", post });
    } catch (error) {
        console.error("Error creating post", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


  const deletePost = async (req, res) => {
    const { postId } = req.params;
  
    try {
      const post = await POST.findById(postId);
      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }
  
      // Check if the post belongs to the user
      if (post.user.toString() !== req.user.userId) {
        return res.status(403).json({ success: false, message: "Unauthorized action" });
      }
  
      // Delete the image from Cloudinary if it exists
      if (post.imagePublicId) {
        await cloudinary.uploader.destroy(post.imagePublicId);
      }
  
      await POST.findByIdAndDelete(postId);
      res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;
  const image = req.files ? req.files.imagePath : null;

  try {
    const post = await POST.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Check if the post belong to the user
    if (post.user.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: "Unauthorized action" });
    }

    let imagePath = post.imagePath;
    let imagePublicId = post.imagePublicId;

    if (image) {
      // Delete old image from Cloudinary if it exists
      if (imagePublicId) {
        await cloudinary.uploader.destroy(imagePublicId);
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "posts",
      });
      console.log("cloudinary upload successful", result);
      if (result && result.secure_url) {
        imagePath = result.secure_url;
        imagePublicId = result.public_id;
        fs.unlinkSync(image.tempFilePath);
      } else {
        console.log("cloudinary upload failed");
        res.status(500).json({ success: false, message: "post failed to upload" });
        return;
      }
    }

    // Update the post
    post.text = text;
    post.imagePath = imagePath;
    post.imagePublicId = imagePublicId;
    await post.save();

    res.status(200).json({ success: true, message: "Post updated successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};



  module.exports = {
    createPost,
    deletePost,
    updatePost
};
