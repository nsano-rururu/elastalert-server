import RouteLogger from '../../../routes/route_logger';
import {sendRequestError} from '../../../common/errors/utils';

let logger = new RouteLogger('/rules/:id', 'POST');

export default function rulePostHandler(request: any, response: any) {
  /**
   * @type {ElastalertServer}
   */
  let server = request.app.get('server');
  let body = request.body ? request.body.yaml : undefined;
  let path = request.params.id + request.params[0];

  server.rulesController.rule(path)
    .then(function (rule: any) {
      rule.edit(body)
        .then(function () {
          response.send({
            created: true,
            id: path
          });
          logger.sendSuccessful();
        })
        .catch(function (error: any) {
          logger.sendFailed(error);
          sendRequestError(response, error);
        });
    })
    .catch(function (error: any) {
      if (error.error === 'ruleNotFound') {
        server.rulesController.createRule(path, body)
          .then(function () {
            logger.sendSuccessful();
            response.send({
              created: true,
              id: path
            });
          })
          .catch(function (error: any) {
            logger.sendFailed(error);
            sendRequestError(response, error);
          });
      } else {
        logger.sendFailed(error);
        sendRequestError(response, error);
      }
    });
}
