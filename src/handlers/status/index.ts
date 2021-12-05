import {Status} from '../../common/status';

export default function statusHandler(request: any, response: any) {
  /**
   * @type {ElastalertServer}
   */
  var server = request.app.get('server');
  var status = server.processController.status;

  response.send({
    status: Status(status)
  });
}
