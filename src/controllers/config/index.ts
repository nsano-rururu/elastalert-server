// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'path' or its corresponding typ... Remove this comment to see the full error message
import { join as joinPath } from 'path';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'js-y... Remove this comment to see the full error message
import yaml from 'js-yaml';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'fs' or its corresponding type ... Remove this comment to see the full error message
import fs from 'fs';
import Logger from '../../common/logger';
import FileSystem from '../../common/file_system';
import config from '../../common/config';

let logger = new Logger('ConfigController');

export default class ConfigController {
  _fileSystemController: any;
  constructor() {
    this._fileSystemController = new FileSystem();
  }

  getConfig() {
    let yamlConfig = this._getConfig();

    return new Promise(function(resolve) {
      let doc = yaml.load(yamlConfig);
      resolve({
        runEvery: doc.run_every,
        bufferTime: doc.buffer_time
      });
    }).catch((error) => {
      logger.error('Failed to getConfig error:', error);
    });
  }

  _getConfig() {
    const path = joinPath(config.get('elastalertPath'), 'config.yaml');
    return fs.readFileSync(path);
  }
}
