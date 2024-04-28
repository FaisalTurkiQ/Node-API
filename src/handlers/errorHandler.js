const errorHandler = (err, req, res, next) => {

  // Default error details
  let message = err.message || 'An unexpected error occurred.';
  let details = 'No additional details available.';
  let code = err.statusCode || 500; // Default to 500 if no specific status code is set

  // Handling MongoDB E11000 duplicate key errors
  if (err.name === 'MongoServerError' && err.code === 11000) {
      code = 400; // Bad Request
      message = 'Duplicate key error';
      details = 'You have attempted to create or update an entry with a value that must be unique, but it already exists in the database.';
      
      // Extract the field(s) causing the duplication
      const field = Object.keys(err.keyValue)[0];
      details += ` The duplicate key error is on the '${field}' field with the value '${err.keyValue[field]}'.`;
  }

  // Use the res.sendError method if it's attached to the response object
  if (res.sendError) {
      res.sendError({
          code,
          message,
          details,
          timestamp: new Date().toISOString(),
          path: req.originalUrl
      }, code);
      console.log(err);

  } else {
      // Fallback to standard Express error handling if sendError is not available
      res.status(code).json({
          status: 'error',
          statusCode: code,
          message: '',
          data: {},
          error: {
              code,
              message,
              details
          },
          requestId: req.id,  // Include this only if you are actually generating request IDs
          timestamp: new Date().toISOString(),
          path: req.originalUrl
      });

  }
};

module.exports = errorHandler;
