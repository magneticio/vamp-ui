import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { EventsService } from './events.service';

describe('Events Service', () => {
  beforeEachProviders(() => [EventsService]);

  it('should ...',
      inject([EventsService], (service: EventsService) => {
    expect(service).toBeTruthy();
  }));
});
