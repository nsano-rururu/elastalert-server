describe('Test Request Errors - Basic Tests', () => {
  // Simple test that the error classes can be imported and instantiated
  it('should be able to import error classes', () => {
    expect(() => {
      require('../../../src/common/errors/test_request_errors');
    }).not.toThrow();
  });

  it('should be able to create error instances', () => {
    expect(() => {
      const {
        OptionsInvalidError,
        RuleNotSendError,
        BodyNotSendError
      } = require('../../../src/common/errors/test_request_errors');
      
      new OptionsInvalidError(new Error('test'));
      new RuleNotSendError();
      new BodyNotSendError();
    }).not.toThrow();
  });

  it('should have correct error messages', () => {
    const {
      OptionsInvalidError,
      RuleNotSendError,
      BodyNotSendError
    } = require('../../../src/common/errors/test_request_errors');
    
    const optionsError = new OptionsInvalidError(new Error('test'));
    const ruleError = new RuleNotSendError();
    const bodyError = new BodyNotSendError();

    expect(optionsError.message).toBe('Testing: rule failed because the options send were invalid. Error message below.');
    expect(ruleError.message).toBe('Testing: rule failed because no rule was send in the request body.');
    expect(bodyError.message).toBe('Testing: rule failed because no request body was send.');
    
    expect(optionsError.statusCode).toBe(400);
    expect(ruleError.statusCode).toBe(400);
    expect(bodyError.statusCode).toBe(400);
  });
});