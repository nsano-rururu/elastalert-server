describe('Build and compilation tests', () => {
  it('should have built lib directory with compiled files', () => {
    const fs = require('fs');
    const path = require('path');
    
    const libDir = path.join(__dirname, '../lib');
    expect(fs.existsSync(libDir)).toBe(true);
  });

  it('should have compiled test controller in lib directory', () => {
    const fs = require('fs');
    const path = require('path');
    
    const testControllerPath = path.join(__dirname, '../lib/controllers/test/index.js');
    expect(fs.existsSync(testControllerPath)).toBe(true);
  });

  it('should have compiled test handlers in lib directory', () => {
    const fs = require('fs');
    const path = require('path');
    
    const testHandlerPath = path.join(__dirname, '../lib/handlers/test/post.js');
    expect(fs.existsSync(testHandlerPath)).toBe(true);
  });

  it('should have compiled test errors in lib directory', () => {
    const fs = require('fs');
    const path = require('path');
    
    const testErrorsPath = path.join(__dirname, '../lib/common/errors/test_request_errors.js');
    expect(fs.existsSync(testErrorsPath)).toBe(true);
  });
});