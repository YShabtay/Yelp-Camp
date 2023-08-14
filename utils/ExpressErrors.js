// utils/ExpressErrors.js

class ExpressError extends Error {
    constructor(message, statusCode) {
      super();
      this.message = message;
      this.statusCode = statusCode;
    }
  }
  
  module.exports = ExpressError;
  