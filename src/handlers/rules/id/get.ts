import RouteLogger from '../../../routes/route_logger';
import {sendRequestError} from '../../../common/errors/utils';

let logger = new RouteLogger('/rules/:id');

export default function ruleGetHandler(request: any, response: any) {
  /**
   * @type {ElastalertServer}
   */
  let server = request.app.get('server');

  let path = request.params.id + request.params[0];
  
  server.rulesController.rule(path)
    .then(function (rule: any) {
      rule.get()
        .then(function (rule: any) {
          response.send(rule);
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
