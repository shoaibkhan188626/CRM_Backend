exports.catchErrors = (fn) => {
  return function (req, res, next) {
    const resp = fn(req, res, next);
    if (resp instanceof Promise) {
      return resp.catch(next);
    }
    return resp;
  };
};

exports.notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Api url doesn't exist",
  });
};

exports.developmentErrors = (error, req, res, next) => {
  error.stack = error.stack || "";
  const errorDetails = {
    message: error.message,
    status: error.status,
    stackHighlighted: error.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      "<mark>$&</mark>"
    ),
  };
  res.status(500).json({
    success: false,
    message: error.message,
    error: error,
  });
};

exports.productionErrors = (error, req, res, next) => {
  res.status(500).json({
    success: false,
    message: error.message,
    error: error,
  });
};
