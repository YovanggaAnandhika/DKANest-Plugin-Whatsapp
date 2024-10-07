<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript library Whatsapp

## Project setup

```bash
$ yarn add @dkanest/whatsapp
```

## On Module

```typescript

import { Module } from '@nestjs/common';
import { WhatsAppModule } from '@dkanest/whatsapp';
import { ModuleService } from './module.service';

@Module({
  imports: [
    WhatsAppModule.forRoot(
      `<your host>`,
      {
        noDelay: true,
        auth: {
          username: `<user>`,
          password: `<pass>`,
        },
        dbName: `<db_name>`,
      },
    ),
  ],
  providers: [ModuleService],
})
export class ModuleModule {}


```

## On Service

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { generate } from 'qrcode-terminal';
import { WhatsAppService } from '@dkanest/whatsapp';

@Injectable()
export class ModuleService implements OnModuleInit {
  constructor(private readonly WhatsApp: WhatsAppService) {
    this.WhatsApp.qrcode = (qr) => {
      generate(qr, { small: true });
    };
  }

  onModuleInit() {
    this.WhatsApp.onMessage = (message) => {
      console.log(message.body);
    };
    this.WhatsApp.onReady = () => {
      console.log('engine ready');
    };
  }
}
```