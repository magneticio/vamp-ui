import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { NotificationService } from './notifications.service';

describe('Notifications Service', () => {
  beforeEachProviders(() => [NotificationService]);

  it('should ...',
      inject([NotificationService], (service: NotificationService) => {
    expect(service).toBeTruthy();
  }));
});
