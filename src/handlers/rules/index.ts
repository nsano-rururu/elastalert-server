import RouteLogger from '../../routes/route_logger';
// @ts-expect-error ts-migrate(2613) FIXME: Module '"/home/sano/dkwork3/elastalert_praeco/elas... Remove this comment to see the full error message
import sendRequestError from '../../common/errors/utils';

let logger = new RouteLogger('/rules');

export default function rulesHandler(request: any, response: any) {
  /**
   * @type {ElastalertServer}
   */
  let server = request.app.get('server');

  let path = request.query.path || '';

  if (typeof request.query.all !== 'undefined') {
    server.rulesController.getRulesAll()
      .then(function (rules: any) {
        response.send(rules);
        logger.sendSuccessful();
      })
      .catch(function (error: any) {
        sendRequestError(error);
      });
  }
  else {
    server.rulesController.getRules(path)
      .then(function (rules: any) {
        response.send(rules);
        logger.sendSuccessful();
      })
      .catch(function (error: any) {
        sendRequestError(error);
      });
  }
}
