import { DynamicModule, Module } from '@nestjs/common';
import { WhatsAppService } from './whats-app.service';
import { MongooseCoreModule } from '@nestjs/mongoose/dist/mongoose-core.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WhatsAppModuleConfig } from './whats-app.type';
import { merge } from 'lodash';

@Module({})
export class WhatsAppModule {
  static forRoot(config: WhatsAppModuleConfig): DynamicModule {
    const defaultConfig: WhatsAppModuleConfig = {
      DBOptions: {
        uri: 'mongodb://localhost',
        options: {
          noDelay: true,
        },
      },
    };

    const finalConfig = merge(defaultConfig, config);

    return {
      global: true,
      module: MongooseModule,
      imports: [
        MongooseCoreModule.forRoot(
          finalConfig.DBOptions.uri,
          finalConfig.DBOptions.options,
        ),
      ],
      providers: [
        {
          provide: 'CONFIG_WHATSAPP',
          useValue: finalConfig,
        },
        WhatsAppService,
      ],
      exports: [WhatsAppService],
    };
  }
}
