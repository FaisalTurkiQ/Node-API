const responseHandler = (req, res, next) => {
    const defaultResponse = {
      status: 'success',
      statusCode: res.statusCode,
      message: '',
      data: {},
      error: null,
      requestId: req.id,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    };
  
    res.sendData = (data, message = '') => {
      if (data.item || data.items) {
        data.length = data.item ? 1 : data.items.length;
      }
      res.status(res.statusCode || 200).json({ ...defaultResponse, message, data });
    };
  
    res.sendError = (error, statusCode = 500) => {
      res.status(statusCode).json({ ...defaultResponse, status: 'error', error, statusCode });
    };
  
    next();
  };
  
module.exports = responseHandler;
  