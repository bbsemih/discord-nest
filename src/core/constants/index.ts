export const STATUS_CODES = {
  INTERNAL_SERVER_ERROR: 500,
  SUCCESS: 200,
  INCORRECT_URL_PARAMS: 400,
  RESTAURANT_NOT_FOUND: 404,
  QSR_NOT_ACTIVE: 400,
  ORDER_NOT_FOUND: 404,
  PAGER_NOT_FOUND: 404,
  DUPLICATE_REF_ID: 400,
  MISSING_IDEMPOTENCE_KEY: 400,
  REDIS_CACHE_ERROR: 500,
  IDEMPOTENCY_ERROR: 400,
  ORDER_NOT_IN_PENDING_STATE: 400,
  REDIRECTION_IS_NOT_ENABLED: 400,
  REDIRECTION_KEY_IS_NOT_VALID: 400,
  OUT_OF_STOCK: 400,
  DISABLED_MENU_ITEM: 400,
  ONE_OR_MORE_PRODUCTS_ARE_NOT_AVAILABLE: 400,
  INVALID_URL: 400,
  ALREADY_PAID: 400,
  RESTAURANT_NOT_ENABLED: 400,
  TOKEN_NOT_FOUND: 400,
};

export const MESSAGES = {
  SUCCESS: 'SUCCESS',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  INCORRECT_URL_PARAMS: 'INCORRECT_URL_PARAMS',
  DUPLICATE_REF_ID: 'DUPLICATE_REF_ID',
  REDIS_CACHE_ERROR: 'REDIS_CACHE_ERROR',
  IDEMPOTENCY_ERROR: 'IDEMPOTENCY_ERROR',
  NO_PAGER_AVAILABLE: 'NO_PAGER_AVAILABLE',
  REDIRECTION_IS_NOT_ENABLED: 'REDIRECTION_IS_NOT_ENABLED',
  REDIRECTION_KEY_IS_NOT_VALID: 'REDIRECTION_KEY_IS_NOT_VALID',
  INVALID_URL: 'INVALID_URL',
  TOKEN_NOT_FOUND: 'TOKEN_NOT_FOUND',
};
