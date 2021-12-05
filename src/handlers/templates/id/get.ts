import RouteLogger from '../../../routes/route_logger';
import {sendRequestError} from '../../../common/errors/utils';

let logger = new RouteLogger('/templates/:id');

export default function templateGetHandler(request: any, response: any) {
  /**
   * @type {ElastalertServer}
   */
  let server = request.app.get('server');
  let path = request.params.id + request.params[0];

  server.templatesController.template(path)
    .then(function (template: any) {
      template.get()
        .then(function (template: any) {
          response.send(template);
          logger.sendSuccessful();
        })
        .catch(function (error: any) {
          logger.sendFailed(error);
          sendRequestError(response, error);
        });
    })
    .catch(function (error: any) {
      sendRequestError(response, error);
    });
}
