module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Enforce specific commit types
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation changes
        'style', // Code style changes (formatting, etc)
        'refactor', // Code refactoring
        'perf', // Performance improvements
        'test', // Adding or updating tests
        'chore', // Maintenance tasks
        'ci', // CI/CD changes
        'build', // Build system changes
        'revert', // Reverting changes
      ],
    ],
    // Subject must not be empty
    'subject-empty': [2, 'never'],
    // Subject must be in sentence case (lowercase, no period at end)
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    // Subject must not end with period
    'subject-full-stop': [2, 'never', '.'],
    // Subject must be at least 10 characters long
    'subject-min-length': [2, 'always', 10],
    // Subject must be at most 100 characters long
    'subject-max-length': [2, 'always', 100],
    // Type must be lowercase
    'type-case': [2, 'always', 'lower-case'],
    // Type must not be empty
    'type-empty': [2, 'never'],
    // Scope must be lowercase if provided
    'scope-case': [2, 'always', 'lower-case'],
    // Scope enum (optional but recommended)
    'scope-enum': [
      2,
      'always',
      [
        'api', // API changes
        'auth', // Authentication
        'config', // Configuration
        'deps', // Dependencies
        'docker', // Docker related
        'docs', // Documentation
        'logger', // Logging
        'middleware', // Middleware
        'routes', // Routes
        'server', // Server
        'test', // Tests
        'types', // TypeScript types
        'utils', // Utilities
      ],
    ],
    // Disable body line length enforcement
    'body-max-line-length': [0, 'always'],
    // Disable footer line length enforcement
    'footer-max-line-length': [0, 'always'],
    // Disable footer minimum length enforcement
    'footer-min-length': [0, 'always'],
    // No leading whitespace
    'header-max-length': [2, 'always', 100],
  },
};
