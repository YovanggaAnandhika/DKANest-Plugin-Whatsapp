import { DynamicModule, Module } from '@nestjs/common';
import { WhatsAppService } from './whats-app.service';
import { MongooseCoreModule } from '@nestjs/mongoose/dist/mongoose-core.module';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

@Module({
  providers: [WhatsAppService],
  exports: [WhatsAppService],
})
export class WhatsAppModule {
  static forRoot(
    uri: string,
    options: MongooseModuleOptions = {},
  ): DynamicModule {
    return {
      module: MongooseModule,
      imports: [MongooseCoreModule.forRoot(uri, options)],
      providers: [WhatsAppService],
      exports: [WhatsAppService],
    };
  }
}
