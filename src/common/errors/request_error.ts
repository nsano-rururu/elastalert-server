export default class RequestError {
  data: any;
  error: any;
  message: any;
  statusCode: any;
  constructor(errorType: any, message = '', statusCode = 500, data: any) {
    this.error = errorType;
    this.message = message;
    this.statusCode = statusCode;

    if (typeof data !== 'undefined') {
      this.data = data;
    }
  }
}
