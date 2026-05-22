import express from 'express';
import { useAllModules, useModule } from '../../modules';

// Mock all module implementations
jest.mock('../../modules/observability', () => ({
  implementObservability: jest.fn(),
}));
jest.mock('../../modules/scalar/scalar', () => ({
  implementAPIDocumentation: jest.fn(),
}));
jest.mock('../../modules/http', () => ({
  implementHTTP: jest.fn(),
}));

describe('modules/index', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
  });

  describe('useModule', () => {
    it('registers the observability module', () => {
      const { implementObservability } = require('../../modules/observability');
      useModule(app, 'observability');
      expect(implementObservability).toHaveBeenCalledWith(app);
    });

    it('registers the api-documentation module', () => {
      const { implementAPIDocumentation } = require('../../modules/scalar/scalar');
      useModule(app, 'api-documentation');
      expect(implementAPIDocumentation).toHaveBeenCalledWith(app);
    });

    it('registers the http module', () => {
      const { implementHTTP } = require('../../modules/http');
      useModule(app, 'http');
      expect(implementHTTP).toHaveBeenCalledWith(app);
    });

    it('throws an error for unknown module names', () => {
      expect(() => useModule(app, 'unknown')).toThrow(
        'Unknown module: "unknown". Available: observability, api-documentation, http'
      );
    });
  });

  describe('useAllModules', () => {
    it('registers all modules', () => {
      const { implementObservability } = require('../../modules/observability');
      const { implementAPIDocumentation } = require('../../modules/scalar/scalar');
      const { implementHTTP } = require('../../modules/http');

      useAllModules(app);

      expect(implementObservability).toHaveBeenCalledWith(app);
      expect(implementAPIDocumentation).toHaveBeenCalledWith(app);
      expect(implementHTTP).toHaveBeenCalledWith(app);
    });
  });
});
