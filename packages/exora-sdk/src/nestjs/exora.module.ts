import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ExoraClient } from '../client';
import { ExoraModuleOptions } from '../types';
import { EXORA_OPTIONS } from './exora.constants';

@Module({})
export class ExoraModule {
  static forRoot(options: ExoraModuleOptions): DynamicModule {
    const exoraProvider: Provider = {
      provide: ExoraClient,
      useFactory: () => new ExoraClient(options),
    };

    const optionsProvider: Provider = {
      provide: EXORA_OPTIONS,
      useValue: options,
    };

    return {
      module: ExoraModule,
      global: options.isGlobal ?? true,
      providers: [exoraProvider, optionsProvider],
      exports: [ExoraClient],
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => ExoraModuleOptions | Promise<ExoraModuleOptions>;
    inject?: any[];
    isGlobal?: boolean;
  }): DynamicModule {
    const exoraProvider: Provider = {
      provide: ExoraClient,
      useFactory: async (...args: any[]) => {
        const config = await options.useFactory(...args);
        return new ExoraClient(config);
      },
      inject: options.inject || [],
    };

    return {
      module: ExoraModule,
      global: options.isGlobal ?? true,
      providers: [exoraProvider],
      exports: [ExoraClient],
    };
  }
}
