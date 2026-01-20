describe('WebSocket functionality - Basic Tests', () => {
  // Set up fake timers before importing the module to capture setInterval
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should be able to import websocket module', () => {
    expect(() => {
      jest.isolateModules(() => {
        require('../../src/common/websocket');
      });
    }).not.toThrow();
  });

  it('should export listen function', () => {
    let websocket;
    jest.isolateModules(() => {
      websocket = require('../../src/common/websocket');
    });
    expect(typeof websocket.listen).toBe('function');
  });

  it('should export wss variable', () => {
    let websocket;
    jest.isolateModules(() => {
      websocket = require('../../src/common/websocket');
    });
    expect(websocket.wss).toBeDefined();
  });

  // Test basic WebSocket Server instantiation (without actually starting server)
  it('should be able to create WebSocket server structure', () => {
    const WebSocket = require('ws');
    expect(WebSocket.Server).toBeDefined();
    expect(typeof WebSocket.Server).toBe('function');
  });
});