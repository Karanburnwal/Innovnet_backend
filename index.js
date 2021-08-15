const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/authRoute");
const usersRoute = require("./routes/usersRoute");
const postsRoute = require("./routes/postsRoute");
const categoriesRoute = require("./routes/categoriesRoute");
const multer = require("multer");
const path = require("path");
dotenv.config();
app.use(express.json());
var cors = require("cors");
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "/images")));
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.p32px.mongodb.net/blog?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    }
  )
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});
app.delete("/api/delete/:imagename", async (req, res) => {
  if (!req.params.imagename) {
    return res.status(500).json("error in delete");
  } else {
    try {
      fs.unlinkSync(__dirname + "/" + req.params.imagename);
      console.log("successfully deleted /tmp/hello");
      return res.status(200).json("Successfully! Image has been Deleted");
    } catch (err) {
      return res.status(400).json(err);
    }
  }
});
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/posts", postsRoute);
app.use("/api/categories", categoriesRoute);

app.listen(process.env.PORT, () => {
  console.log("server is running at port 5000");
});
