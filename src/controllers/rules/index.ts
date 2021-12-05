// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'path' or its corresponding typ... Remove this comment to see the full error message
import { join as joinPath, normalize as normalizePath, extname as pathExtension } from 'path';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'fs-e... Remove this comment to see the full error message
import fs from 'fs-extra';
import FileSystem from '../../common/file_system';
import config from '../../common/config';
import Logger from '../../common/logger';
import {
  RuleNotFoundError, RuleNotReadableError, RuleNotWritableError,
  RulesFolderNotFoundError, RulesRootFolderNotCreatableError
} from '../../common/errors/rule_request_errors';

let logger = new Logger('RulesController');

export default class RulesController {
  _fileSystemController: any;
  rulesFolder: any;
  constructor() {
    this._fileSystemController = new FileSystem();
    this.rulesFolder = this._getRulesFolder();
  }

  getRulesAll() {
    const self = this;
    return new Promise(function(resolve, reject) {
      self._fileSystemController.readDirectoryRecursive(self.rulesFolder)
        .then(function(rules: any) {
          resolve(rules);
        })
        .catch(function(error: any) {
          logger.warn(`The requested folder (${self.rulesFolder}) couldn't be found / read by the server. Error:`, error);
          reject(new RulesFolderNotFoundError(self.rulesFolder));
        });
    });
  }

  getRules(path: any) {
    const self = this;
    const fullPath = joinPath(self.rulesFolder, path);
    return new Promise(function(resolve, reject) {
      self._fileSystemController.readDirectory(fullPath)
        .then(function(directoryIndex: any) {

          directoryIndex.rules = directoryIndex.files.filter(function(fileName: any) {
            return pathExtension(fileName).toLowerCase() === '.yaml';
          }).map(function(fileName: any) {
            return fileName.slice(0, -5);
          });

          delete directoryIndex.files;
          resolve(directoryIndex);
        })
        .catch(function(error: any) {

          // Check if the requested folder is the rules root folder
          if (normalizePath(self.rulesFolder) === fullPath) {

            // Try to create the root folder
            fs.mkdir(fullPath, { recursive: true }, function(error: any) {
              if (error) {
                reject(new RulesRootFolderNotCreatableError());
                logger.warn(`The rules root folder (${fullPath}) couldn't be found nor could it be created by the file system.`);
              } else {
                resolve(self._fileSystemController.getEmptyDirectoryIndex());
              }
            });
          } else {
            logger.warn(`The requested folder (${fullPath}) couldn't be found / read by the server. Error:`, error);
            reject(new RulesFolderNotFoundError(path));
          }
        });
    });
  }

  rule(id: any, path: any) {
    const self = this;
    return new Promise(function(resolve, reject) {
      self._findRule(id)
        .then(function(access) {
          resolve({
            get: function() {
              // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
              if (access.read) {
                return self._getRule(id);
              }
              return self._getErrorPromise(new RuleNotReadableError(id));
            },
            edit: function(body: any) {
              // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
              if (access.write) {
                return self._editRule(id, body);
              }
              return self._getErrorPromise(new RuleNotWritableError(id));
            },
            delete: function() {
              // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
              return self._deleteRule(id, path);
            }
          });
        })
        .catch(function() {
          reject(new RuleNotFoundError(id));
        });
    });
  }

  createRule(id: any, content: any) {
    return this._editRule(id, content);
  }

  _findRule(id: any) {
    let fileName = id + '.yaml';
    const self = this;
    return new Promise(function(resolve, reject) {
      self._fileSystemController.fileExists(joinPath(self.rulesFolder, fileName))
        .then(function(exists: any) {
          if (!exists) {
            reject();
          } else {
            //TODO: Get real permissions
            //resolve(permissions);
            resolve({
              read: true,
              write: true
            });
          }
        })
        .catch(function(error: any) {
          reject(error);
        });
    });
  }

  _getRule(id: any) {
    const path = joinPath(this.rulesFolder, id + '.yaml');
    return this._fileSystemController.readFile(path);
  }

  _editRule(id: any, body: any) {
    const path = joinPath(this.rulesFolder, id + '.yaml');
    return this._fileSystemController.writeFile(path, body);
  }

  _deleteRule(id: any) {
    const path = joinPath(this.rulesFolder, id + '.yaml');
    return this._fileSystemController.deleteFile(path);
  }

  _getErrorPromise(error: any) {
    return new Promise(function(resolve, reject) {
      reject(error);
    });
  }

  _getRulesFolder() {
    const ruleFolderSettings = config.get('rulesPath');

    if (ruleFolderSettings.relative) {
      return joinPath(config.get('elastalertPath'), ruleFolderSettings.path);
    } else {
      return ruleFolderSettings.path;
    }
  }
}