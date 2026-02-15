import Logger from '../common/logger';

export default class RouteLogger extends Logger {
  _handler: string;
  _method: string;
  
  constructor(handler = '', method = 'GET') {
    super('Routes');
    this._handler = handler;
    this._method = method;
  }

  sendSuccessful(data: any = false) {
    this.info('Successfully handled ' + this._method + ' request for \'' + this._handler + '\'' + (data ? (' with data: \n\n' + data) : '.'));
  }

  sendFailed(error) {
    this.error('Request for \'' + this._handler + '\' failed with error: \n\n', error);
  }
}
