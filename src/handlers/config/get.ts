import RouteLogger from '../../routes/route_logger';
// @ts-expect-error ts-migrate(2613) FIXME: Module '"/home/sano/dkwork3/elastalert_praeco/elas... Remove this comment to see the full error message
import sendRequestError from '../../common/errors/utils';

let logger = new RouteLogger('/config');

export default function configGetHandler(request: any, response: any) {
  let server = request.app.get('server');

  server.configController.getConfig()
    .then(function (config: any) {
      response.send(config);
      logger.sendSuccessful();
    })
    .catch(function (error: any) {
      sendRequestError(error);
    });

  logger.sendSuccessful();
}
