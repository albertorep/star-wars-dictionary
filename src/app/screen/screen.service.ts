import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
  private screensize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private respondto!: string;
  private ismobile = false;
  private screenBreakpoints = {
    // Screen breakpoints set according to variables in mixin.scss
    phone: '(max-width: 480px)',
    tablet: '(min-width: 481px) and (max-width: 900px)',
    desktop: '(min-width: 901px)',
  };
  get respondTo(): string {
    return this.respondto;
  }

  set respondTo(screenType: string) {
    this.respondto = screenType;
  }

  get isMobile(): boolean {
    return this.ismobile;
  }

  constructor(private breakpointObserver: BreakpointObserver) {}

  public trackBreakpoints(destroy: Subject<void>): void {
    this.breakpointObserver
      .observe([this.screenBreakpoints.phone, this.screenBreakpoints.tablet, this.screenBreakpoints.desktop])
      .pipe(takeUntil(destroy))
      .subscribe((result) => {
        if (result.matches) {
          this.checkBreakpoints(result);
        }
      });
  }

  /**
   * To observe screen size changes
   *
   * @returns Observable
   */
  screenSize(destroy: Subject<void>): Observable<boolean> {
    return this.screensize.asObservable().pipe(takeUntil(destroy));
  }

  screenSizev2(): Observable<boolean> {
    return this.screensize.asObservable();
  }

  /**
   * propagate change
   *
   * @param value
   */
  setIsMobile(value: boolean): void {
    // eslint-disable-next-line no-underscore-dangle
    this.ismobile = value;
    this.screensize.next(value);
  }

  /**
   * Validate breakpoints and set values
   *
   * @param result
   */
  private checkBreakpoints(result: any): void {
    Object.entries(result.breakpoints).forEach(([key, value]) => {
      if (value) {
        switch (key) {
          case this.screenBreakpoints.phone:
            this.setIsMobile(true);
            this.respondTo = 'phone';
            break;
          case this.screenBreakpoints.tablet:
            this.setIsMobile(true);
            this.respondTo = 'tablet';
            break;
          case this.screenBreakpoints.desktop:
            this.setIsMobile(false);
            this.respondTo = 'desktop';
            break;
        }
      }
    });
  }
}
