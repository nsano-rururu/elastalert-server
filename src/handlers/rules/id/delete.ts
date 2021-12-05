import RouteLogger from '../../../routes/route_logger';
import {sendRequestError} from '../../../common/errors/utils';

let logger = new RouteLogger('/rules/:id', 'DELETE');

export default function ruleDeleteHandler(request: any, response: any) {
  /**
   * @type {ElastalertServer}
   */
  let server = request.app.get('server');
  let path = request.params.id + request.params[0];

  server.rulesController.rule(path)
    .then(function (rule: any) {
      rule.delete()
        .then(function (rule: any) {
          response.send(rule);
          // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ deleted: boolean; id: any; }' ... Remove this comment to see the full error message
          logger.sendSuccessful({
            deleted: true,
            id: request.params.id
          });
        })
        .catch(function (error: any) {
          logger.sendFailed(error);
          sendRequestError(response, error);
        });
    })
    .catch(function (error: any) {
      logger.sendFailed(error);
      sendRequestError(response, error);
    });
}
