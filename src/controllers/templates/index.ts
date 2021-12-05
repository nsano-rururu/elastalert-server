// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'path' or its corresponding typ... Remove this comment to see the full error message
import {join as joinPath, normalize as normalizePath, extname as pathExtension} from 'path';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'fs-e... Remove this comment to see the full error message
import fs from 'fs-extra';
import FileSystem from '../../common/file_system';
import config from '../../common/config';
import Logger from '../../common/logger';
import {TemplateNotFoundError, TemplateNotReadableError, TemplateNotWritableError,
  TemplatesFolderNotFoundError, TemplatesRootFolderNotCreatableError} from '../../common/errors/template_request_errors';

let logger = new Logger('TemplatesController');

export default class TemplatesController {
  _fileSystemController: any;
  templatesFolder: any;
  constructor() {
    this._fileSystemController = new FileSystem();
    this.templatesFolder = this._getTemplatesFolder();
  }

  getTemplatesAll() {
    const self = this;
    return new Promise(function(resolve, reject) {
      self._fileSystemController.readDirectoryRecursive(self.templatesFolder)
        .then(function(templates: any) {
          resolve(templates);
        })
        .catch(function(error: any) {
          logger.warn(`The requested folder (${self.templatesFolder}) couldn't be found / read by the server. Error:`, error);
          reject(new TemplatesFolderNotFoundError(self.templatesFolder));
        });
    });
  }

  getTemplates(path: any) {
    const self = this;
    const fullPath = joinPath(self.templatesFolder, path);
    return new Promise(function (resolve, reject) {
      self._fileSystemController.readDirectory(fullPath)
        .then(function (directoryIndex: any) {

          directoryIndex.templates = directoryIndex.files.filter(function (fileName: any) {
            return pathExtension(fileName).toLowerCase() === '.yaml';
          }).map(function (fileName: any) {
            return fileName.slice(0, -5);
          });

          delete directoryIndex.files;
          resolve(directoryIndex);
        })
        .catch(function (error: any) {

          // Check if the requested folder is the templates root folder
          if (normalizePath(self.templatesFolder) === fullPath) {

            // Try to create the root folder
            fs.mkdir(fullPath, { recursive: true }, function (error: any) {
              if (error) {
                reject(new TemplatesRootFolderNotCreatableError());
                logger.warn(`The templates root folder (${fullPath}) couldn't be found nor could it be created by the file system.`);
              } else {
                resolve(self._fileSystemController.getEmptyDirectoryIndex());
              }
            });
          } else {
            logger.warn(`The requested folder (${fullPath}) couldn't be found / read by the server. Error:`, error);
            reject(new TemplatesFolderNotFoundError(path));
          }
        });
    });
  }

  template(id: any) {
    const self = this;
    return new Promise(function (resolve, reject) {
      self._findTemplate(id)
        .then(function (access) {
          console.log('template resolved');
          resolve({
            get: function () {
              // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
              if (access.read) {
                return self._getTemplate(id);
              }
              return self._getErrorPromise(new TemplateNotReadableError(id));
            },
            edit: function (body: any) {
              // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
              if (access.write) {
                return self._editTemplate(id, body);
              }
              return self._getErrorPromise(new TemplateNotWritableError(id));
            },
            delete: function () {
              return self._deleteTemplate(id);
            }
          });
        })
        .catch(function () {
          console.log('catched');
          reject(new TemplateNotFoundError(id));
        });
    });
  }

  createTemplate(id: any, content: any) {
    return this._editTemplate(id, content);
  }

  _findTemplate(id: any) {
    let fileName = id + '.yaml';
    const self = this;
    return new Promise(function (resolve, reject) {
      self._fileSystemController.fileExists(joinPath(self.templatesFolder, fileName))
        .then(function (exists: any) {
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
        .catch(function (error: any) {
          reject(error);
        });
    });
  }

  _getTemplate(id: any) {
    const path = joinPath(this.templatesFolder, id + '.yaml');
    return this._fileSystemController.readFile(path);
  }

  _editTemplate(id: any, body: any) {
    const path = joinPath(this.templatesFolder, id + '.yaml');
    return this._fileSystemController.writeFile(path, body);
  }

  _deleteTemplate(id: any) {
    const path = joinPath(this.templatesFolder, id + '.yaml');
    return this._fileSystemController.deleteFile(path);
  }

  _getErrorPromise(error: any) {
    return new Promise(function (resolve, reject) {
      reject(error);
    }).catch((error) => {
      logger.error('Failed to _getErrorPromise error:', error);
    });
  }

  _getTemplatesFolder() {
    const templateFolderSettings = config.get('templatesPath');

    if (templateFolderSettings.relative) {
      return joinPath(config.get('elastalertPath'), templateFolderSettings.path);
    } else {
      return templateFolderSettings.path;
    }
  }
}
