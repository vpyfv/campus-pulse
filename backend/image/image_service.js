const path = require("path");

const uploadImage = async (req) => {
  let uploadPath;
  let file;
  file = req.files.image;
  const extension = file.name.split(".").pop();
  const newFileName = crypto.randomUUID() + "." + extension;
  uploadPath = path.join(__dirname, "..", "storage", "images", newFileName);
  return await file.mv(uploadPath, (err) => {
    console.log("calling mv");
    if (err) {
      return null;
    }
    return newFileName;
  });
};

module.exports = { uploadImage };
