// Module
export { ExoraModule } from './exora.module';

// Service
export { ExoraService } from './exora.service';

// Decorators
export {
  ExoraWebhookHandler,
  OnExoraEvent,
  ExoraRawBody,
  ExoraSignature,
} from './decorators';
export type { ExoraEventType } from './decorators/exora-event.decorator';

// Guards
export { ExoraWebhookGuard } from './guards';

// Interceptors
export { ExoraLoggingInterceptor } from './interceptors';

// Interfaces
export type {
  ExoraModuleOptions,
  ExoraModuleAsyncOptions,
  ExoraOptionsFactory,
} from './interfaces';

// Constants
export { EXORA_OPTIONS, EXORA_CLIENT } from './constants';

// Re-export SDK types
export {
  Exora,
  ExoraError,
  AuthenticationError,
  InvalidRequestError,
  NotFoundError,
  RateLimitError,
} from 'exora-sdk';

export type {
  Payment,
  PaymentStatus,
  Invoice,
  InvoiceStatus,
  Customer,
  WebhookEndpoint,
  ApiKey,
} from 'exora-sdk';
