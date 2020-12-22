import { Avatar, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import firebase from "firebase";
import db from "../firebase";
import "./Posts.css";
import {
  Bookmark,
  BookmarkBorderOutlined,
  ChatBubbleOutlineOutlined,
  DeleteOutlined,
  Favorite,
  FavoriteBorderOutlined,
  SendOutlined,
} from "@material-ui/icons";
import { isToday } from "../utils/index";
import { useDispatch, useSelector } from "react-redux";
import { actionTypes } from "../actions/actionTypes";
import { chooseAction } from "../actions/actions";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import {
  EmailShareButton,
  FacebookShareButton,
  PinterestShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  PinterestIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

export const Posts = ({
  postId,
  username,
  imageUrl,
  caption,
  user,
  timestamp,
}) => {
  const [comments, setComments] = useState([]),
    [comment, setComment] = useState(""),
    dispatch = useDispatch(),
    { SET_OPEN_SIGN_IN } = actionTypes,
    [fav, setFav] = useState(false),
    [favCount, setFavCount] = useState((Math.random() * 5000) | 0),
    [bookmark, setBookmark] = useState("none"),
    [bookmarkStatus, setBookmarkStatus] = useState(false),
    [opacityDisplay, setOpacityDisplay] = useState(0),
    [shareButton, setShareButton] = useState("none"),
    [allComments, setAllComments] = useState(false);
  const { presentUser } = useSelector(({ userReducer }) => {
    let { user } = userReducer;
    return {
      presentUser: user,
    };
  });

  useEffect(() => {
    let unsubscribe;
    if (postId)
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });

    return () => unsubscribe();
  }, [postId]);

  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  const commentView = (comment) => {
    return (
      <div className="post__commentContainer">
        <p key={Math.random() * 1000} className="post__comment">
          <strong>{comment.username}: </strong> {comment.text}
        </p>
        <small>
          {comment.timestamp && isToday(comment.timestamp?.toDate())}
        </small>
      </div>
    );
  };

  const deletePost = (e) => {
    e.preventDefault();
    // Prevent people not signed in from deleting post
    if (user) {
      // prevent other users from deleting user's post
      if (username === presentUser.displayName) {
        const getConfirmation = window.confirm(
          "Are you sure you want to delete?"
        );

        // MONGODB IMPLEMENTATION
        // const delPost = async () => {
        //   await axios.get("/delete").then((res) => {
        //     console.log("Post DELETED");
        //   });
        // };
        getConfirmation &&
          db
            .collection("posts")
            .doc(postId)
            .delete()
            .then(() =>
              console.log(`Document ID: ${postId} successfully deleted!`)
            )
            .catch((error) =>
              console.error("Error removing document: ", error.message)
            );
      } else alert("This is not your post");
    } else {
      const getConfirmation = window.confirm(
        "You're not Signed In. Would you like to sign in?"
      );
      getConfirmation && dispatch(chooseAction(true, SET_OPEN_SIGN_IN));
    }
  };
  const incrementFav = () => {
      setFavCount(favCount + 1);
      !fav && setFav(true);
    },
    decrementFav = () => {
      setFavCount(favCount - 1);
      fav && setFav(false);
    };

  const bookmarkTweak = () => {
    setBookmark("block");
    setOpacityDisplay(1);
    bookmarkStatus ? setBookmarkStatus(false) : setBookmarkStatus(true);
    setTimeout(() => {
      setBookmark("none");
      setOpacityDisplay(0);
    }, 3000);
  };

  return (
    <>
      {username && (
        <div className="post">
          <div className="post__headerContainer">
            <div className="post__header">
              <Zoom>
                <Avatar
                  className="post__avatar"
                  alt={username}
                  src={imageUrl}
                />
              </Zoom>
              <h3>{username}</h3>
            </div>
            <DeleteOutlined
              className="post__headerDelete"
              onClick={deletePost}
            />
          </div>
          <Zoom>
            <img className="post__image" src={imageUrl} alt={caption} />
          </Zoom>
          <div
            className="post__bookmarks"
            style={{ display: bookmark, opacity: opacityDisplay }}
          >
            <div className="post__bookmarkContainer">
              <div className="post__bookmark">
                <Zoom>
                  <Avatar
                    className="post__bookmarkAvatar"
                    alt={username}
                    src={imageUrl}
                  />
                </Zoom>
                <p className="post__bookmarkSaved">Saved 😉</p>
              </div>
              <p className="post__bookmarkCollection">Saved to collection</p>
            </div>
          </div>
          <div
            className="post__shareContainer"
            style={{ display: shareButton }}
          >
            <div className="post__shareGroup">
              <WhatsappShareButton
                className="post__shareIcons"
                url={"http://insta-343f8.web.app/"}
              >
                <WhatsappIcon size={32} round={true} />
              </WhatsappShareButton>
              <FacebookShareButton
                className="post__shareIcons"
                url={"http://insta-343f8.web.app/"}
              >
                <FacebookIcon size={32} round={true} />
              </FacebookShareButton>
              <TelegramShareButton
                className="post__shareIcons"
                url={"http://insta-343f8.web.app/"}
              >
                <TelegramIcon size={32} round={true} />
              </TelegramShareButton>
              <TwitterShareButton url={"http://insta-343f8.web.app/"}>
                <TwitterIcon size={32} round={true} />
              </TwitterShareButton>
              <PinterestShareButton
                className="post__shareIcons"
                url={"http://insta-343f8.web.app/"}
              >
                <PinterestIcon size={32} round={true} />
              </PinterestShareButton>
              <EmailShareButton
                className="post__shareIcons"
                url={"http://insta-343f8.web.app/"}
              >
                <EmailIcon size={32} round={true} />
              </EmailShareButton>
            </div>
          </div>
          <div className="post__icons">
            <div className="post__iconsGrouped">
              {fav ? (
                <Favorite
                  className="post__icon post__iconFav"
                  onClick={decrementFav}
                />
              ) : (
                <FavoriteBorderOutlined
                  className="post__icon"
                  onClick={incrementFav}
                />
              )}

              <ChatBubbleOutlineOutlined
                className={`post__icon ${allComments && "post__allComments"}`}
                onClick={() =>
                  !allComments ? setAllComments(true) : setAllComments(false)
                }
              />
              <SendOutlined
                className={`post__icon ${
                  shareButton === "block" && "post__sendButton"
                }`}
                onClick={() =>
                  shareButton === "none"
                    ? setShareButton("block")
                    : setShareButton("none")
                }
              />
            </div>
            <div className="post__likesCounter">{favCount} likes</div>
            {bookmarkStatus ? (
              <Bookmark
                className="post__icon post__bookmarkStatus"
                onClick={() => setBookmarkStatus(false)}
              />
            ) : (
              <BookmarkBorderOutlined
                className="post__icon"
                onClick={bookmarkTweak}
              />
            )}
          </div>

          <div className="post__content">
            <h4 className="post__contentText">
              <strong>{username}:</strong> {caption}
            </h4>
            <small className="post__contentTime">
              {isToday(timestamp?.toDate())}
            </small>
          </div>

          <div className="post__comments">
            {comments.length > 0 ? (
              <h2 className="post__commentsHeader">Comments</h2>
            ) : (
              console.log(`👨‍🦱${username} 📨${caption}: 🤐 no comment`)
            )}
            {allComments
              ? allComments && comments?.map((comment) => commentView(comment))
              : comments?.slice(0, 3).map((comment) => commentView(comment))}
          </div>
          {comments.length > 3 && (
            <Button
              className="post__commentShowMore"
              onClick={() =>
                !allComments ? setAllComments(true) : setAllComments(false)
              }
            >
              {allComments ? (
                <>Show less comment</>
              ) : (
                <>View all {comments.length} comments</>
              )}
            </Button>
          )}
          <form className="post__commentBox">
            <input
              className="post__input"
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            {user ? (
              <button
                className="post__button"
                disabled={!comment}
                type="submit"
                onClick={postComment}
              >
                Post
              </button>
            ) : (
              <button
                className="post__buttonSignup"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(chooseAction(true, SET_OPEN_SIGN_IN));
                }}
              >
                Login to comment
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default Posts;
