import WAWebJS, { Client, RemoteAuth, Store } from 'whatsapp-web.js';
import { Injectable, OnModuleInit } from '@nestjs/common';
import MongoStore from '@dkanest/mongostore';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import * as path from 'node:path';
import TypedEmitter from 'typed-emitter';
import { WhatsAppEvents } from './whats-app.type';
import { EventEmitter } from 'events';

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

  constructor(@InjectConnection() connection: Connection) {
    /** get store mongo DB **/
    this.store = new MongoStore({ connection: connection });
    this.client = new Client({
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
      webVersionCache: {
        type: 'local',
        path: path.join(process.cwd(), './.whatsapp/cache'),
      },
      authStrategy: new RemoteAuth({
        store: this.store,
        dataPath: path.join(process.cwd(), './.whatsapp/data'),
        backupSyncIntervalMs: 60000,
      }),
    });
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
    await this.client.initialize();
  }
}
