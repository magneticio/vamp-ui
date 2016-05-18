import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject,
} from '@angular/core/testing';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ArtifactsDetailComponent } from './artifacts-detail.component';

describe('Component: ArtifactsDetail', () => {
  let builder: TestComponentBuilder;

  beforeEachProviders(() => [ArtifactsDetailComponent]);
  beforeEach(inject([TestComponentBuilder], function (tcb: TestComponentBuilder) {
    builder = tcb;
  }));

  it('should inject the component', inject([ArtifactsDetailComponent],
      (component: ArtifactsDetailComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should create the component', inject([], () => {
    return builder.createAsync(ArtifactsDetailComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let query = fixture.debugElement.query(By.directive(ArtifactsDetailComponent));
        expect(query).toBeTruthy();
        expect(query.componentInstance).toBeTruthy();
      });
  }));
});

@Component({
  selector: 'test',
  template: `
    <app-artifacts-detail></app-artifacts-detail>
  `,
  directives: [ArtifactsDetailComponent]
})
class ArtifactsDetailComponentTestController {
}

