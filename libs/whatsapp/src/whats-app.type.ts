import WAWebJS from 'whatsapp-web.js';
import {
  BrowserConnectOptions,
  BrowserLaunchArgumentOptions,
  LaunchOptions,
  ConnectOptions,
} from 'puppeteer';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export type WhatsAppEvents = {
  ready: () => void;
  qr: (qrString: string) => void;
  message: (message: WAWebJS.Message) => void;
};

export interface WhatAppModuleConfigOptions {
  puppeteer?: BrowserLaunchArgumentOptions &
    LaunchOptions &
    BrowserConnectOptions &
    ConnectOptions;
  WebCacheOptions?: WAWebJS.WebCacheOptions;
  AuthStrategy?: WAWebJS.AuthStrategy;
}

export interface WhatsAppModuleConfigDBOptions {
  uri: string;
  options: MongooseModuleOptions;
}

export interface WhatsAppModuleConfig {
  DBOptions: WhatsAppModuleConfigDBOptions;
  WAOptions?: WhatAppModuleConfigOptions;
}
