import { useEffect } from "react";
import "./App.css";
import { Header, Poster } from "./components";
// import db, { auth } from "./firebase"; //Firebase implementation
import { auth } from "./firebase"; //MongoDB implementation
import InstagramEmbed from "react-instagram-embed";
import { useDispatch, useSelector } from "react-redux";
import { actionTypes } from "./actions/actionTypes";
import { chooseAction } from "./actions/actions";
import { CameraAlt } from "@material-ui/icons";
import axios from "./axios";
import Pusher from "pusher-js";

function App() {
  const { REACT_APP_CLIENT_TOKEN, REACT_APP_ID } = process.env,
    merge = `${REACT_APP_ID}|${REACT_APP_CLIENT_TOKEN}`;
  const {
    SET_USER,
    SET_POSTS,
    SET_OPEN_UPLOAD,
    SET_OPEN_SIGN_IN,
  } = actionTypes;

  const dispatch = useDispatch();
  const { user } = useSelector(({ userReducer }) => {
    let { user } = userReducer;
    return {
      user,
    };
  });
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) =>
      authUser
        ? dispatch(chooseAction(authUser, SET_USER))
        : dispatch(chooseAction(null, SET_USER))
    );
    return () => unsubscribe();
  }, [dispatch, SET_USER]);

  // MONGODB IMPLEMENTATION
  const fetchPosts = async () => {
    await axios.get("/sync").then((res) => {
      console.log(res);
      dispatch(chooseAction(res.data, SET_POSTS));
    });
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const pusher = new Pusher("8234b92e4ce2b85a5a40", {
      cluster: "eu",
    });

    var channel = pusher.subscribe("posts");
    channel.bind("inserted", function (data) {
      console.log("Data received ", data);
      fetchPosts();
    });
  }, []);

  //   useEffect(() => {
  // const fetchPosts = axios.get('/sync')

  //     function database() {
  //       db.collection("posts")
  //         .orderBy("timestamp", "desc")
  //         .onSnapshot((snapshot) => {
  //           dispatch(
  //             chooseAction(
  //               snapshot.docs.map((doc) => {
  //                 const data = doc.data(),
  //                   id = doc.id;
  //                 return { id, ...data };
  //               }),
  //               SET_POSTS
  //             )
  //           );
  //         });
  //     }
  //     database();
  //   }, [SET_POSTS, dispatch]);

  return (
    <div className="app">
      <Header />
      <Poster />
      <div className="app__cameraContainer">
        <CameraAlt
          className="app__camera"
          fontSize="large"
          onClick={() => {
            if (user) {
              dispatch(chooseAction(true, SET_OPEN_UPLOAD));
            } else {
              let getConfirmation = window.confirm("Please, sign in to post?");
              getConfirmation && dispatch(chooseAction(true, SET_OPEN_SIGN_IN));
            }
          }}
        />
      </div>
      <InstagramEmbed
        url="https://www.instagram.com/p/BAuc9JmQodPPZBdR1UiXg6YVR2IJ80yx-PatzE0/"
        clientAccessToken={merge}
        maxWidth={320}
        hideCaption={false}
        containerTagName="div"
        protocol=""
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />
    </div>
  );
}

export default App;
