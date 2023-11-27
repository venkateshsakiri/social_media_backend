const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
// const helmet = require('helmet');
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
// const bodyParser = require('body-parser');
const routes = require("./routes/routes");

dotenv.config();

const conStr = 'mongodb://0.0.0.0:27017/socialmedia';
// mongoose
//   .connect(conStr, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then((res) => {
//     console.log("Db connected successfully");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((res) => {
    console.log("Db connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json({ extended: false, limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: false, parameterLimit: 50000 })
);
app.use(express.json());
// app.use(bodyParser.json());
// app.use(express.json({ limit: '25mb' }));
app.use(cors());
// app.use(helmet());

app.use("/images", express.static(path.join(__dirname, "public/images")));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
    console.log(file);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  try {
    return res.status(200).json("file uploaded successfully");
  } catch (err) {
    console.log(err);
  }
});
app.use("/api", routes);

app.listen(8080, () => {
  console.log("server is running");
});
