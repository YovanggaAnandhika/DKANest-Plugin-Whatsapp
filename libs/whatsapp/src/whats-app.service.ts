import WAWebJS, { Client, RemoteAuth, Store } from 'whatsapp-web.js';
import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import MongoStore from '@dkanest/mongostore';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import * as path from 'node:path';
import TypedEmitter from 'typed-emitter';
import { WhatsAppEvents, WhatsAppModuleConfig } from './whats-app.type';
import { EventEmitter } from 'events';
import * as process from 'node:process';
import * as fs from 'node:fs';
import { merge } from 'lodash';
@Injectable()
export class WhatsAppService implements OnModuleInit {
  get register(): TypedEmitter<WhatsAppEvents> {
    return this._register;
  }

  set register(value: TypedEmitter<WhatsAppEvents>) {
    this._register = value;
  }
  get client(): WAWebJS.Client {
    return this._client;
  }

  private set client(value: WAWebJS.Client) {
    this._client = value;
  }

  private get store(): WAWebJS.Store {
    return this._store;
  }

  private set store(value: WAWebJS.Store) {
    this._store = value;
  }

  private _client: Client;
  private _store: Store;

  private _register = new EventEmitter() as TypedEmitter<WhatsAppEvents>;

  private logger = new Logger(WhatsAppService.name);
  constructor(
    @InjectConnection() connection: Connection,
    @Inject('CONFIG_WHATSAPP') private config: WhatsAppModuleConfig,
  ) {
    /** get store mongo DB **/
    this.store = new MongoStore({ connection: connection });

    const defaultConfig: WhatsAppModuleConfig = {
      WAOptions: {
        puppeteer: {
          headless: true,
          executablePath: fs.existsSync('/usr/bin/chromium-browser')
            ? '/usr/bin/chromium-browser'
            : undefined,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
        WebCacheOptions: {
          type: 'local',
          path: path.join(process.cwd(), './.whatsapp/cache'),
        },
        AuthStrategy: new RemoteAuth({
          store: this.store,
          dataPath: path.join(process.cwd(), './.whatsapp/data'),
          backupSyncIntervalMs: 60000,
        }),
      },
    };

    const finalConfig = merge(defaultConfig, this.config);

    this.client = new Client(finalConfig.WAOptions);

    this.client.on('qr', (qr) => {
      this.register.emit('qr', qr);
    });
    this.client.on('ready', () => {
      this.register.emit('ready');
    });
  }

  async onModuleInit() {
    this.client.on('message', (data) => {
      this.register.emit('message', data);
    });
    await this.client
      .initialize()
      .then((res) => {
        this.logger.log(res);
      })
      .catch((error) => {
        this.logger.error(error);
      });
  }
}
