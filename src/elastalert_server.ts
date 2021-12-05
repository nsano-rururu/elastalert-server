// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'expr... Remove this comment to see the full error message
import express from 'express';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'body... Remove this comment to see the full error message
import bodyParser from 'body-parser';
import Logger from './common/logger';
import config from './common/config';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'path' or its corresponding typ... Remove this comment to see the full error message
import path from 'path';
import FileSystem from './common/file_system';
import { listen } from './common/websocket';
import setupRouter from './routes/route_setup';
import ProcessController from './controllers/process';
import RulesController from './controllers/rules';
import TemplatesController from './controllers/templates';
import FoldersController from './controllers/folders';
import TestController from './controllers/test';
import SilenceController from './controllers/silence';
import ConfigController from './controllers/config';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'cors... Remove this comment to see the full error message
import cors from 'cors';

let logger = new Logger('Server');

export default class ElastalertServer {
  _configController: any;
  _express: any;
  _foldersController: any;
  _processController: any;
  _rulesController: any;
  _runningServer: any;
  _runningTimeouts: any;
  _silenceController: any;
  _templatesController: any;
  _testController: any;
  constructor() {
    this._express = express();
    this._runningTimeouts = [];
    this._processController = null;
    this._rulesController = null;
    this._templatesController = null;
    this._foldersController = null;
    this._configController = null;

    // Set listener on process exit (SIGINT == ^C)
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    process.on('SIGINT', () => {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      process.exit(0);
    });

    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    process.on('exit', () => {
      logger.info('Stopping server');
      this.stop();
      logger.info('Server stopped. Bye!');
    });
  }

  get express() {
    return this._express;
  }

  get processController() {
    return this._processController;
  }

  get rulesController() {
    return this._rulesController;
  }

  get templatesController() {
    return this._templatesController;
  }

  get foldersController() {
    return this._foldersController;
  }

  get testController() {
    return this._testController;
  }

  get silenceController() {
    return this._silenceController;
  }

  get configController() {
    return this._configController;
  }

  start() {
    const self = this;

    // Start the server when the config is loaded
    config.ready(function () {
      try {
        self._express.use(cors());
        self._express.use(bodyParser.json());
        self._express.use(bodyParser.urlencoded({ extended: true }));
        self._setupRouter();
        self._runningServer = self.express.listen(config.get('port'), self._serverController);
        self._express.set('server', self);

        // @ts-expect-error ts-migrate(2339) FIXME: Property '_fileSystemController' does not exist on... Remove this comment to see the full error message
        self._fileSystemController = new FileSystem();
        self._processController = new ProcessController();
        self._processController.start();
        self._processController.onExit(function() {
          // If the elastalert process exits, we should stop the server.
          // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          process.exit(0);
        });

        self._rulesController = new RulesController();
        self._templatesController = new TemplatesController();
        self._foldersController = new FoldersController();
        self._testController = new TestController(self);
        self._silenceController = new SilenceController(self);
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
        self._configController = new ConfigController(self);

        // @ts-expect-error ts-migrate(2339) FIXME: Property '_fileSystemController' does not exist on... Remove this comment to see the full error message
        self._fileSystemController.createDirectoryIfNotExists(self.getDataFolder()).catch(function (error: any) {
          logger.error('Error creating data folder with error:', error);
        });
        
        logger.info('Server listening on port ' + config.get('port'));

        let wss = listen(config.get('wsport'));

        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        wss.on('connection', (ws: any) => {
          ws.on('message', (data: any) => {
            try {
              data = JSON.parse(data);
              if (data.rule) {
                let rule = data.rule;
                let options = data.options;
                self._testController.testRule(rule, options, ws);
              }
            } catch (error) {
              console.log(error);
            }
          });
        });

        logger.info('Websocket listening on port 3333');
      } catch (error) {
        logger.error('Starting server failed with error:', error);
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        process.exit(1);
      }
    });
  }

  stop() {
    this._processController.stop();
    this._runningServer ? this._runningServer.close() : null;
    this._runningTimeouts.forEach((timeout: any) => clearTimeout(timeout));
  }

  getDataFolder() {
    const dataFolderSettings = config.get('dataPath');

    if (dataFolderSettings.relative) {
      return path.join(config.get('elastalertPath'), dataFolderSettings.path);
    } else {
      return dataFolderSettings.path;
    }
  }

  _setupRouter() {
    setupRouter(this._express);
  }

  _serverController() {
    logger.info('Server started');
  }
}
