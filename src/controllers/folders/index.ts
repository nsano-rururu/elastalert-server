// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'path' or its corresponding typ... Remove this comment to see the full error message
import {join as joinPath } from 'path';
import FileSystem from '../../common/file_system';
import config from '../../common/config';

export default class TemplatesController {
  _fileSystemController: any;
  rulesFolder: any;
  templatesFolder: any;
  constructor() {
    this._fileSystemController = new FileSystem();
    this.templatesFolder = this._getTemplatesFolder();
    this.rulesFolder = this._getRulesFolder();
  }

  create(type: any, path: any) {
    return this._createFolder(type, path);
  }

  delete(type: any, path: any) {
    return this._deleteFolder(type, path);
  }

  _deleteFolder(type: any, path: any) {
    let folder;

    if (type === 'templates') {
      folder = this.templatesFolder;
    }
    else if (type === 'rules') {
      folder = this.rulesFolder;
    }
    else {
      return this._getErrorPromise(new Error(':type should be "rules" or "templates"'));
    }

    const folderPath = joinPath(folder, path);
    return this._fileSystemController.deleteDirectory(folderPath);
  }

  _createFolder(type: any, path: any) {
    let folder;

    if (type === 'templates') {
      folder = this.templatesFolder;
    }
    else if (type === 'rules') {
      folder = this.rulesFolder;
    }
    else {
      return this._getErrorPromise(new Error(':type should be "rules" or "templates"'));
    }

    const folderPath = joinPath(folder, path);
    return this._fileSystemController.createDirectoryIfNotExists(folderPath);
  }

  _getErrorPromise(error: any) {
    return new Promise(function (resolve, reject) {
      reject(error);
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

  _getRulesFolder() {
    const ruleFolderSettings = config.get('rulesPath');

    if (ruleFolderSettings.relative) {
      return joinPath(config.get('elastalertPath'), ruleFolderSettings.path);
    } else {
      return ruleFolderSettings.path;
    }
  }
}