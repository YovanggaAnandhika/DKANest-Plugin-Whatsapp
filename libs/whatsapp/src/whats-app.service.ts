import WAWebJS, { Client, Message, RemoteAuth, Store } from 'whatsapp-web.js';
import { Injectable, OnModuleInit } from '@nestjs/common';
import MongoStore from '@dkanest/mongostore';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import * as path from 'node:path';

@Injectable()
export class WhatsAppService implements OnModuleInit {
  get onMessage(): (message: WAWebJS.Message) => void {
    return this._onMessage;
  }

  set onMessage(value: (message: WAWebJS.Message) => void) {
    this._onMessage = value;
  }
  get onReady(): () => void {
    return this._onReady;
  }

  set onReady(value: () => void) {
    this._onReady = value;
  }
  get qrcode(): (qr: string) => void {
    return this._qrcode;
  }

  set qrcode(value: (qr: string) => void) {
    this._qrcode = value;
  }
  /**
   * @description greeter setter
   */
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
  private _qrcode: (qr: string) => void;
  private _onReady: () => void;
  private _onMessage: (message: Message) => void;

  constructor(@InjectConnection() connection: Connection) {
    /** get store mongo DB **/
    this.store = new MongoStore({ connection: connection });
    this.client = new Client({
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
      webVersionCache: {
        type: 'local',
        path: path.join(__dirname, './cache'),
      },
      authStrategy: new RemoteAuth({
        store: this.store,
        dataPath: path.join(__dirname, './data'),
        backupSyncIntervalMs: 60000,
      }),
    });
    this.client.on('qr', (qr) => {
      this.qrcode(qr);
    });
    this.client.on('ready', () => {
      this.onReady();
    });
  }

  async onModuleInit() {
    this.client.on('message', (data) => {
      this.onMessage(data);
    });
    await this.client.initialize();
  }
}
