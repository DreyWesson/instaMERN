import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Pusher from "pusher";
import dotenv from "dotenv";
import dbModel from "./dbModel.js";
dotenv.config();
// app config
const app = express(),
  port = process.env.PORT || 8080,
  { MONGODB_PASSWORD } = process.env,
  pusher = new Pusher({
    appId: "1119050",
    key: "8234b92e4ce2b85a5a40",
    secret: "8c6075b74f18e746a882",
    cluster: "eu",
    useTLS: true,
  });

pusher.trigger("my-channel", "my-event", {
  message: "hello world",
});

// middlewares
app.use(express.json());
app.use(cors());

// DB config
const connection_url = `mongodb+srv://admin:${MONGODB_PASSWORD}@cluster0.cyzph.mongodb.net/instaDB?retryWrites=true&w=majority`;
mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("mongoDB connected");
  const changeStream = mongoose.connection.collection("posts").watch();
  changeStream.on("change", (change) => {
    console.log("💪 PUSHER change stream triggered 👉", change);
    if (change.operationType === "insert") {
      console.log("🔫Triggering PUSHER ***IMG UPLOAD***");

      // Get post details
      const { user, caption, image } = change.fullDocument;
      pusher.trigger("posts", "inserted", {
        user,
        caption,
        image,
      });
    } else {
      console.log("Unknown trigger from pusher");
    }
  });
});

// api routes
app.get("/", (req, res) => {
  res.status(200).send("Hello world");
});
app.post("/upload", (req, res) => {
  const body = req.body;
  dbModel.create(body, (err, data) => {
    err ? res.status(500).send(err) : res.status(201).send(data);
  });
});
app.get("/sync", (req, res) => {
  dbModel.find((err, data) => {
    err ? res.status(500).send(err) : res.status(200).send(data);
  });
});

// app.get("/delete", (req, res) => {
//   console.log("REQUEST", mongoose.connection.collection("posts").paths);
// dbModel.collection.drop();
// dbModel.collection.findByIdAndRemove({ _id: req.body._id }, (err) => {
//   console.log(err);
// });
// });

// Listener
app.listen(port, () =>
  console.log(`Listening on port http://localhost:${port}`)
);
