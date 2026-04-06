export const notFound = (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
};

export const errorHandler = (error, req, res, next) => {
  console.error(error);
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: error.message || "Something went wrong.",
  });
};
