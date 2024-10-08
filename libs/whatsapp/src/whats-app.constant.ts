import { WhatsAppModuleConfig } from '@app/whats-app/whats-app.type';
import path from 'node:path';

export const WhatsAppConstant: WhatsAppModuleConfig = {
  WAOptions: {
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    WebCacheOptions: {
      type: 'local',
      path: path.join(__dirname, './cache'),
    },
  },
  DBOptions: {
    uri: 'mongodb://localhost',
    options: {},
  },
};
