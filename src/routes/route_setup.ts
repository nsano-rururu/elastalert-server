// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import lodash from 'lodash';
import Logger from '../common/logger';
import routes from './routes';

let logger = new Logger('Router');

export default function setupRouter(express: any) {
  routes.forEach(function (route) {

    if (lodash.isArray(route.method)) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'forEach' does not exist on type 'string ... Remove this comment to see the full error message
      route.method.forEach(function (method: any, index: any) {
        _setupRoute(
          lodash.merge(
            lodash.cloneDeep(route), {
              method: method,
              // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
              handler: route.handler[index]
            }));
      });
    } else {
      _setupRoute(route);
    }
  });

  function _setupRoute(route: any) {
    let methodFunctionName = route.method.toLowerCase();
    express[methodFunctionName]('/' + route.path, route.handler);
    logger.info('Listening for ' + route.method + ' request on /' + route.path + '.');
  }
}
