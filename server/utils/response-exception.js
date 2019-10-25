function ResponseException(message, status) {
  this.message = message;
  this.status = status
  // Use V8's native method if available, otherwise fallback
  if ("captureStackTrace" in Error)
      Error.captureStackTrace(this, ResponseException);
  else
      this.stack = (new Error()).stack;
}

ResponseException.prototype = Object.create(Error.prototype);
ResponseException.prototype.name = "ResponseException";
ResponseException.prototype.constructor = ResponseException;

module.exports = ResponseException;