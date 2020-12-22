const chooseAction = (data, actionType) => {
  const setActionTo = (payload) => {
    return (dispatch, getState) =>
      dispatch({ type: actionType, [payload]: data });
  };

  switch (actionType) {
    // POST ACTION
    case "SET_POSTS":
      return setActionTo("posts");
    // USER ACTIONS
    case "SET_USER":
      return setActionTo("user");
    case "SET_USERNAME":
      return setActionTo("username");
    case "SET_EMAIL":
      return setActionTo("email");
    case "SET_PASSWORD":
      return setActionTo("password");
    // MODAL ACTIONS
    case "SET_OPEN":
      return setActionTo("open");
    case "SET_OPEN_SIGN_IN":
      return setActionTo("openSignIn");
    case "SET_SCROLL":
      return setActionTo("hideOnScroll");
    case "SET_OPEN_UPLOAD":
      return setActionTo("openUpload");
    default:
      break;
  }
};

export { chooseAction };
