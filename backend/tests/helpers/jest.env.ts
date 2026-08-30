/**
 * Loaded by Jest via setupFiles — runs before any test module.
 * Sets NODE_ENV=test so services (email, logger, etc.) skip real
 * external calls during testing.
 */
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_for_tests_only_32chars';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_for_tests_only_32ch';
process.env.BREVO_API_KEY = ''; // ensure email is always mocked in tests
