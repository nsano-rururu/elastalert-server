import ElastalertServer from './elastalert_server';

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
if (process.env.SENTRY_DSN !== undefined) {
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  var Raven = require('raven');
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  Raven.config(process.env.SENTRY_DSN, {
    captureUnhandledRejections: true
  }).install();
  console.log('Sentry logging enabled for Elastalert');

  Raven.context(function() {
    let server = new ElastalertServer();
    server.start();
  });
} else {
  let server = new ElastalertServer();
  server.start();
}
