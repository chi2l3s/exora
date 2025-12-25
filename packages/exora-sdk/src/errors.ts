export type ExoraErrorCode =
  | 'authentication_error'
  | 'invalid_request_error'
  | 'rate_limit_error'
  | 'api_error'
  | 'network_error'
  | 'validation_error'
  | 'not_found_error'
  | 'payment_error'
  | 'invoice_error';

export interface ExoraErrorData {
  code: ExoraErrorCode;
  message: string;
  statusCode?: number;
  details?: Record<string, any>;
}

const ERROR_MESSAGES: Record<string, Record<ExoraErrorCode, string>> = {
  en: {
    authentication_error: 'Authentication failed. Please check your API key.',
    invalid_request_error: 'The request was invalid or malformed.',
    rate_limit_error: 'Too many requests. Please slow down.',
    api_error: 'An error occurred while processing your request.',
    network_error: 'A network error occurred. Please check your connection.',
    validation_error: 'Validation failed for the provided data.',
    not_found_error: 'The requested resource was not found.',
    payment_error: 'An error occurred while processing the payment.',
    invoice_error: 'An error occurred while processing the invoice.',
  },
  ru: {
    authentication_error: 'Ошибка аутентификации. Проверьте API ключ.',
    invalid_request_error: 'Некорректный запрос.',
    rate_limit_error: 'Слишком много запросов. Пожалуйста, подождите.',
    api_error: 'Произошла ошибка при обработке запроса.',
    network_error: 'Ошибка сети. Проверьте подключение.',
    validation_error: 'Ошибка валидации данных.',
    not_found_error: 'Запрашиваемый ресурс не найден.',
    payment_error: 'Ошибка при обработке платежа.',
    invoice_error: 'Ошибка при обработке счёта.',
  },
};

export class ExoraError extends Error {
  readonly code: ExoraErrorCode;
  readonly statusCode?: number;
  readonly details?: Record<string, any>;

  constructor(data: ExoraErrorData, locale: string = 'en') {
    const messages = ERROR_MESSAGES[locale] || ERROR_MESSAGES.en;
    const message = data.message || messages[data.code] || messages.api_error;

    super(message);

    this.name = 'ExoraError';
    this.code = data.code;
    this.statusCode = data.statusCode;
    this.details = data.details;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

export class AuthenticationError extends ExoraError {
  constructor(message?: string, locale?: string) {
    super(
      { code: 'authentication_error', message: message || '', statusCode: 401 },
      locale,
    );
    this.name = 'AuthenticationError';
  }
}

export class InvalidRequestError extends ExoraError {
  constructor(message?: string, details?: Record<string, any>, locale?: string) {
    super(
      { code: 'invalid_request_error', message: message || '', statusCode: 400, details },
      locale,
    );
    this.name = 'InvalidRequestError';
  }
}

export class NotFoundError extends ExoraError {
  constructor(message?: string, locale?: string) {
    super(
      { code: 'not_found_error', message: message || '', statusCode: 404 },
      locale,
    );
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends ExoraError {
  constructor(message?: string, locale?: string) {
    super(
      { code: 'rate_limit_error', message: message || '', statusCode: 429 },
      locale,
    );
    this.name = 'RateLimitError';
  }
}

export class PaymentError extends ExoraError {
  constructor(message?: string, details?: Record<string, any>, locale?: string) {
    super(
      { code: 'payment_error', message: message || '', statusCode: 400, details },
      locale,
    );
    this.name = 'PaymentError';
  }
}
