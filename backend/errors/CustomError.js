class CustomError extends Error {
  constructor(statusCode, message, name) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.name = name;
  }
}

module.exports = CustomError;
