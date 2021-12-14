export const displayError = (error, onError) => {
  if (error.message) {
    onError(error.message);
  } else if (error.data && error.data.message) {
    onError(error.data.message);
  } else {
    onError("Unknown error");
  }
};
