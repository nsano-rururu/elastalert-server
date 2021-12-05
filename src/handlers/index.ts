import RouteLogger from '../routes/route_logger';
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../../package.json'. Consider ... Remove this comment to see the full error message
import npm from '../../package.json';
import config from '../common/config';

let logger = new RouteLogger('/');

export default function indexHandler(request: any, response: any) {
  let info = {
    name: config.get('appName'),
    port: config.get('port'),
    version: npm.version
  };

  response.send(info);
  logger.sendSuccessful();
}
