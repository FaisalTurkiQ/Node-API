function createResponse(statusCode, message, details, req, success = false, data = null, item = 0, token = null) {
  let response = {
      status: success ? 'success' : 'error',
      statusCode: statusCode,
      message: message,
      requestId: req.id,
      timestamp: new Date().toISOString(),
      path: req.path
  };

  if (success) {
      const responseData = {};
      responseData[item == 1 ? "item" : "items"] = data;
      response.data = responseData;
      if (token) {
          response.token = token;
      }
  } else {
      response.error = {
          details: details
      };
  }

  return response;
}
  
  module.exports = createResponse;
  