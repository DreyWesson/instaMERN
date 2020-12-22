import "./ImageUpload.css";
import React, { useState } from "react";
import { Button } from "@material-ui/core";
import db, { storage } from "../firebase";
import firebase from "firebase";
import { actionTypes } from "../actions/actionTypes";
import { chooseAction } from "../actions/actions";
import { useDispatch } from "react-redux";
import axios from "../axios";

export const ImageUpload = ({ username }) => {
  // console.log("UPLOAD USERNAME", username);
  const [caption, setCaption] = useState(""),
    [url, setUrl] = useState(""),
    [image, setImage] = useState(null),
    [progress, setProgress] = useState(0),
    dispatch = useDispatch();

  const handleChange = (e) => {
    e.target.files[0] && setImage(e.target.files[0]);
  };
  const handleUpload = (e) => {
    // Uploading the files
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressReport = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progressReport);
      },
      (err) => alert(err.message),
      () => {
        // Downloading the uploaded file
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            setUrl(url);
            // MERN IMPLEMENTATION
            axios.post("/upload", {
              caption: caption,
              user: username,
              image: url,
            });

            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
            setImage(null);
            setProgress(0);
            setCaption("");
            dispatch(chooseAction(false, actionTypes.SET_OPEN_UPLOAD));
          })
          .catch((err) => alert(err.message));
      }
    );
  };
  return (
    <div className="imageUpload">
      <h2>Upload Content</h2>
      <p>
        <small>
          <i>Add caption and upload your contents here</i>
        </small>
      </p>
      <input
        className="imageUpload__caption"
        type="text"
        placeholder="Enter a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <progress
        className="imageUpload__progressBar"
        value={progress}
        max="100"
      />
      <input
        className="imageUpload__button"
        type="file"
        onChange={handleChange}
      />
      <Button
        className="imageUpload__uploadButton"
        onClick={caption && image && handleUpload}
      >
        Upload
      </Button>
    </div>
  );
};

export default ImageUpload;
