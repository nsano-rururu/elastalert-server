// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'fs' or its corresponding type ... Remove this comment to see the full error message
import fs from 'fs';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'fs-e... Remove this comment to see the full error message
import fs_extra from 'fs-extra';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'path' or its corresponding typ... Remove this comment to see the full error message
import { join as joinPath } from 'path';
import readdirp from 'readdirp';

export default class FileSystem {
  constructor() { }

  readDirectoryRecursive(path: any) {
    return new Promise(function (resolve, reject) {
      try {        
        let rules: any = [];
        let stream = readdirp(path, { type: 'all', alwaysStat: true });

        stream
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'on' does not exist on type 'ReaddirpStre... Remove this comment to see the full error message
          .on('warn', function (err: any) {
            reject(err);  
          })
          .on('error', function (err: any) { 
            reject(err);
          })
          .on('data', (entry: any) => {
            let path = entry.path.replace('.yaml', '');
            if (entry.stats.isDirectory()) {
              path += '/';
            }
            rules.push(path);
          }).on('end', () => {
            resolve(rules);
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  readDirectory(path: any) {
    const self = this;
    return new Promise(function (resolve, reject) {
      try {
        fs.readdir(path, function (error: any, elements: any) {
          if (error) {
            reject(error);
          } else {
            let statCount = 0;
            let directoryIndex = self.getEmptyDirectoryIndex();

            if (elements.length == 0) {
              resolve(directoryIndex);
            }

            elements.forEach(function (element: any) {
              fs.stat(joinPath(path, element), function (error: any, stats: any) {
                if (stats.isDirectory()) {
                  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
                  directoryIndex.directories.push(element);
                } else if (stats.isFile()) {
                  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
                  directoryIndex.files.push(element);
                }

                statCount++;
                if (statCount === elements.length) {
                  resolve(directoryIndex);
                }
              });
            });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  directoryExists(path: any) {
    return this._exists(path);
  }

  createDirectoryIfNotExists(pathToFolder: any) {
    let self = this;

    return new Promise(function (resolve, reject) {
      self.directoryExists(pathToFolder).then(function (exists) {
        if (!exists) {
          fs.mkdir(pathToFolder, { recursive: true }, function (error: any) {
            if (error) {
              reject(error);
            } else {
              // @ts-expect-error ts-migrate(2794) FIXME: Expected 1 arguments, but got 0. Did you forget to... Remove this comment to see the full error message
              resolve();
            }
          });
        } else {
          // @ts-expect-error ts-migrate(2794) FIXME: Expected 1 arguments, but got 0. Did you forget to... Remove this comment to see the full error message
          resolve();
        }
      });
    });
  }

  deleteDirectory(path: any) {
    return new Promise(function (resolve, reject) {
      fs_extra.remove(path, function (error: any) {
        // @ts-expect-error ts-migrate(2794) FIXME: Expected 1 arguments, but got 0. Did you forget to... Remove this comment to see the full error message
        error ? reject(error) : resolve();
      });
    });
  }

  fileExists(path: any) {
    return this._exists(path);
  }

  readFile(path: any) {
    return new Promise(function (resolve, reject) {
      fs.readFile(path, 'utf8', function (error: any, content: any) {
        error ? reject(error) : resolve(content);
      });
    });
  }

  writeFile(path: any, content = '') {
    return new Promise(function (resolve, reject) {
      try {
        fs.writeFile(path, content, function (error: any) {
          // @ts-expect-error ts-migrate(2794) FIXME: Expected 1 arguments, but got 0. Did you forget to... Remove this comment to see the full error message
          error ? reject(error) : resolve();
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  deleteFile(path: any) {
    return new Promise(function (resolve, reject) {
      fs.unlink(path, function (error: any) {
        // @ts-expect-error ts-migrate(2794) FIXME: Expected 1 arguments, but got 0. Did you forget to... Remove this comment to see the full error message
        error ? reject(error) : resolve();
      });
    });
  }

  getEmptyDirectoryIndex() {
    return {
      directories: [],
      files: []
    };
  }

  _exists(path: any) {
    return new Promise(function (resolve, reject) {
      try {
        fs.access(path, fs.F_OK, function (error: any) {
          error ? resolve(false) : resolve(true);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}