import RequestError from './request_error';

export class RuleNotFoundError extends RequestError {
  constructor(ruleID: any) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
    super('ruleNotFound', `The requested rule with id: '${ruleID}' couldn't be found.`, 404);
  }
}

export class RuleNotReadableError extends RequestError {
  constructor(ruleID: any) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
    super('ruleNotReadable', `The requested rule with id: '${ruleID}' isn't readable by the file system.`, 403);
  }
}

export class RuleNotWritableError extends RequestError {
  constructor(ruleID: any) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
    super('ruleNotWritable', `The requested rule with id: '${ruleID}' isn't writable by the file system.`, 403);
  }
}

export class RulesFolderNotFoundError extends RequestError {
  constructor(path: any) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
    super('rulesFolderNotFound', `The requested folder with path: '${path}' couldn't be found.`, 404);
  }
}

export class RulesFolderNotReadableError extends RequestError {
  constructor(path: any) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
    super('rulesFolderNotReadable', `The requested folder with path: '${path}' isn't readable by the file system.`, 403);
  }
}

export class RulesFolderNotWritableError extends RequestError {
  constructor(path: any) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
    super('rulesFolderNotWritable', `The requested folder with path: '${path}' isn't writable by the file system.`, 403);
  }
}

export class RulesRootFolderNotCreatableError extends RequestError {
  constructor() {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
    super('rulesRootFolderNotCreatable', 'The rules folder wasn\'t found and couldn\'t be created by the file system.', 403);
  }
}
