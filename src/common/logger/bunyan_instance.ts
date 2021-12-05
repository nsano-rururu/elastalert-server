// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'buny... Remove this comment to see the full error message
import bunyan from 'bunyan';

let logger = bunyan.createLogger({
  name: 'elastalert-server'
});

export default logger;
