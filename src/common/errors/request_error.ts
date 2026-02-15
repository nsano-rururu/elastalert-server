export default class RequestError {
  error: any;
  message: string;
  statusCode: number;
  data: any;
  
  constructor(errorType, message = '', statusCode = 500, data?) {
    this.error = errorType;
    this.message = message;
    this.statusCode = statusCode;

    if (typeof data !== 'undefined') {
      this.data = data;
    }
  }
}
