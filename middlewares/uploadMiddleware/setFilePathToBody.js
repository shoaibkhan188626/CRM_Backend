module.exports = (fieldName = "filepath") => {
  return (req, res, next) => {
    if (req.file) {
      req.body[fieldName] = req.file.path;
    }
    next();
  };
};
