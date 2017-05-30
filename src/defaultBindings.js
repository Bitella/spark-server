// @flow

import type { Container } from 'constitute';
import type { Settings } from './types';

import { defaultBindings } from 'spark-protocol';
import DeviceClaimsController from './controllers/DeviceClaimsController';
import DevicesController from './controllers/DevicesController';
import EventsController from './controllers/EventsController';
import OauthClientsController from './controllers/OauthClientsController';
import ProductsController from './controllers/ProductsController';
import ProvisioningController from './controllers/ProvisioningController';
import UsersController from './controllers/UsersController';
import WebhooksController from './controllers/WebhooksController';
import WebhookLogger from './lib/WebhookLogger';
import DeviceManager from './managers/DeviceManager';
import WebhookManager from './managers/WebhookManager';
import EventManager from './managers/EventManager';
import DeviceFirmwareFileRepository from './repository/DeviceFirmwareFileRepository';
import TingoDb from './repository/TingoDb';
import DeviceAttributeDatabaseRepository from
  './repository/DeviceAttributeDatabaseRepository';
import UserDatabaseRepository from './repository/UserDatabaseRepository';
import WebhookDatabaseRepository from './repository/WebhookDatabaseRepository';
import settings from './settings';

export default (container: Container, newSettings: Settings) => {
  // Make sure that the spark-server settings match whatever is passed in
  Object.keys(newSettings).forEach((key: string) => {
    settings[key] = newSettings[key];
  });

  // spark protocol container bindings
  defaultBindings(container, newSettings);

  // settings
  container.bindValue('DATABASE_PATH', settings.DB_CONFIG.PATH);
  container.bindValue('DATABASE_OPTIONS', settings.DB_CONFIG.OPTIONS);
  container.bindValue('DEVICE_DIRECTORY', settings.DEVICE_DIRECTORY);
  container.bindValue('FIRMWARE_DIRECTORY', settings.FIRMWARE_DIRECTORY);
  container.bindValue('SERVER_KEY_FILENAME', settings.SERVER_KEY_FILENAME);
  container.bindValue('SERVER_KEYS_DIRECTORY', settings.SERVER_KEYS_DIRECTORY);
  container.bindValue('USERS_DIRECTORY', settings.USERS_DIRECTORY);
  container.bindValue('WEBHOOKS_DIRECTORY', settings.WEBHOOKS_DIRECTORY);
  container.bindValue('USE_CLUSTER', settings.CLUSTERING.USE_CLUSTER);

  container.bindClass(
    'Database',
    TingoDb,
    ['DATABASE_PATH', 'DATABASE_OPTIONS'],
  );

  // lib
  container.bindClass(
    'IWebhookLogger',
    WebhookLogger,
    [],
  );

  // controllers
  container.bindClass(
    'DeviceClaimsController',
    DeviceClaimsController,
    [
      'DeviceManager',
      'ClaimCodeManager',
    ],
  );
  container.bindClass(
    'DevicesController',
    DevicesController,
    ['DeviceManager'],
  );
  container.bindClass(
    'EventsController',
    EventsController,
    ['EventManager'],
  );
  container.bindClass(
    'OauthClientsController',
    OauthClientsController,
    [],
  );
  container.bindClass(
    'ProductsController',
    ProductsController,
    [],
  );
  container.bindClass(
    'ProvisioningController',
    ProvisioningController,
    ['DeviceManager'],
  );
  container.bindClass(
    'UsersController',
    UsersController,
    ['UserRepository'],
  );
  container.bindClass(
    'WebhooksController',
    WebhooksController,
    ['WebhookManager'],
  );

  // managers
  container.bindClass(
    'DeviceManager',
    DeviceManager,
    [
      'DeviceAttributeRepository',
      'DeviceFirmwareRepository',
      'DeviceKeyRepository',
      'DeviceServer',
    ],
  );
  container.bindClass(
    'EventManager',
    EventManager,
    ['EventPublisher'],
  );
  container.bindClass(
    'WebhookManager',
    WebhookManager,
    ['WebhookRepository', 'EventPublisher', 'IWebhookLogger'],
  );

  // Repositories
  container.bindClass(
    'DeviceAttributeRepository',
    DeviceAttributeDatabaseRepository,
    ['Database'],
  );
  container.bindClass(
    'DeviceFirmwareRepository',
    DeviceFirmwareFileRepository,
    ['FIRMWARE_DIRECTORY'],
  );
  container.bindClass(
    'UserRepository',
    UserDatabaseRepository,
    ['Database'],
  );
  container.bindClass(
    'WebhookRepository',
    WebhookDatabaseRepository,
    ['Database'],
  );
};
