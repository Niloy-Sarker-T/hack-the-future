/**
 * @description Higher-order function to handle asynchronous functions as middleware.
 * @param {(req: import("express").Request, res:import("express").Response, next:import("express").NextFunction) => void} requestHandler: The function to be wrapped. It should return a promise.
 * @returns {(req: import("express").Request, res:import("express").Response, next:import("express").NextFunction) => Promise<void>}
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      // console.log("error: ", err);
      next(err);
    });
  };
};

export { asyncHandler };
