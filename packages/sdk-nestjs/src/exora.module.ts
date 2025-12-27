import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import { Exora } from 'exora-sdk';

import { EXORA_CLIENT, EXORA_OPTIONS } from './constants';
import { ExoraService } from './exora.service';
import { ExoraWebhookGuard } from './guards/webhook-signature.guard';
import type {
  ExoraModuleAsyncOptions,
  ExoraModuleOptions,
  ExoraOptionsFactory,
} from './interfaces';

/**
 * ExoraModule provides integration with the Exora payment platform.
 *
 * @example
 * Synchronous configuration:
 * ```typescript
 * @Module({
 *   imports: [
 *     ExoraModule.forRoot({
 *       apiKey: 'exora_live_xxx',
 *       webhookSecret: 'whsec_xxx',
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 *
 * @example
 * Asynchronous configuration:
 * ```typescript
 * @Module({
 *   imports: [
 *     ExoraModule.forRootAsync({
 *       imports: [ConfigModule],
 *       useFactory: (config: ConfigService) => ({
 *         apiKey: config.get('EXORA_API_KEY'),
 *         webhookSecret: config.get('EXORA_WEBHOOK_SECRET'),
 *       }),
 *       inject: [ConfigService],
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
@Global()
@Module({})
export class ExoraModule {
  /**
   * Configure the module with static options
   */
  static forRoot(options: ExoraModuleOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: EXORA_OPTIONS,
      useValue: options,
    };

    const clientProvider: Provider = {
      provide: EXORA_CLIENT,
      useFactory: () => {
        return new Exora({
          apiKey: options.apiKey,
          baseUrl: options.baseUrl,
          timeout: options.timeout,
          maxRetries: options.maxRetries,
        });
      },
    };

    return {
      module: ExoraModule,
      providers: [
        optionsProvider,
        clientProvider,
        ExoraService,
        ExoraWebhookGuard,
      ],
      exports: [ExoraService, EXORA_OPTIONS, EXORA_CLIENT],
    };
  }

  /**
   * Configure the module with async options
   */
  static forRootAsync(options: ExoraModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);

    const clientProvider: Provider = {
      provide: EXORA_CLIENT,
      useFactory: (opts: ExoraModuleOptions) => {
        return new Exora({
          apiKey: opts.apiKey,
          baseUrl: opts.baseUrl,
          timeout: opts.timeout,
          maxRetries: opts.maxRetries,
        });
      },
      inject: [EXORA_OPTIONS],
    };

    return {
      module: ExoraModule,
      imports: options.imports || [],
      providers: [
        ...asyncProviders,
        clientProvider,
        ExoraService,
        ExoraWebhookGuard,
      ],
      exports: [ExoraService, EXORA_OPTIONS, EXORA_CLIENT],
      global: options.isGlobal,
    };
  }

  private static createAsyncProviders(
    options: ExoraModuleAsyncOptions,
  ): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: EXORA_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ];
    }

    const useClass = options.useClass as Type<ExoraOptionsFactory>;
    const useExisting = options.useExisting as Type<ExoraOptionsFactory>;

    if (useClass) {
      return [
        {
          provide: EXORA_OPTIONS,
          useFactory: async (optionsFactory: ExoraOptionsFactory) =>
            optionsFactory.createExoraOptions(),
          inject: [useClass],
        },
        {
          provide: useClass,
          useClass,
        },
      ];
    }

    if (useExisting) {
      return [
        {
          provide: EXORA_OPTIONS,
          useFactory: async (optionsFactory: ExoraOptionsFactory) =>
            optionsFactory.createExoraOptions(),
          inject: [useExisting],
        },
      ];
    }

    return [];
  }
}
