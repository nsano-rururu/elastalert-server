import RouteLogger from '../../../routes/route_logger';
import {sendRequestError} from '../../../common/errors/utils';

let logger = new RouteLogger('/templates/:id', 'DELETE');

export default function templateDeleteHandler(request: any, response: any) {
  /**
   * @type {ElastalertServer}
   */
  let server = request.app.get('server');
  let path = request.params.id + request.params[0];

  server.templatesController.template(path)
    .then(function (template: any) {
      template.delete()
        .then(function (template: any) {
          response.send(template);
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
