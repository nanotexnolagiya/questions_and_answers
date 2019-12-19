function ResponseException(message, status) {
  this.message = message;
  this.status = status;
  
  if ("captureStackTrace" in Error)
    Error.captureStackTrace(this, ResponseException);
  else
    this.stack = (new Error()).stack;
}

ResponseException.prototype = Object.create(Error.prototype);
ResponseException.prototype.name = "ResponseException";
ResponseException.prototype.constructor = ResponseException;

module.exports = ResponseException;