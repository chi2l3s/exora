import { ModuleMetadata, Type } from '@nestjs/common';

export interface ExoraModuleOptions {
  /**
   * Exora API key
   */
  apiKey: string;

  /**
   * Webhook secret for signature verification
   */
  webhookSecret?: string;

  /**
   * Base URL for the Exora API (default: https://api.exora.io)
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds (default: 30000)
   */
  timeout?: number;

  /**
   * Maximum number of retries for failed requests (default: 3)
   */
  maxRetries?: number;

  /**
   * Enable debug logging
   */
  debug?: boolean;
}

export interface ExoraOptionsFactory {
  createExoraOptions(): Promise<ExoraModuleOptions> | ExoraModuleOptions;
}

export interface ExoraModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Factory function to create options
   */
  useFactory?: (...args: unknown[]) => Promise<ExoraModuleOptions> | ExoraModuleOptions;

  /**
   * Dependencies to inject into the factory
   */
  inject?: unknown[];

  /**
   * Class that implements ExoraOptionsFactory
   */
  useClass?: Type<ExoraOptionsFactory>;

  /**
   * Existing provider to use
   */
  useExisting?: Type<ExoraOptionsFactory>;

  /**
   * Make module global
   */
  isGlobal?: boolean;
}
