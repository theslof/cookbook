import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Vibration} from "@ionic-native/vibration";
import {NativeAudio} from "@ionic-native/native-audio";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {isCordova} from "ionic-angular/platform/platform-utils";
import {Platform} from "ionic-angular";

@Injectable()
export class TimerProvider {
  private timerObserver: any;
  private timerObservable: Observable<Timer>;
  private timer: Timer = {
    id: 0,
    time: 0,
    current: 0,
    asText: '0s',
    uuid: '',
    name: '',
    stepID: -1,
  };

  private static readonly NOTIFICATION_TAG: number = 0;

  constructor(private vibration: Vibration, private audio: NativeAudio,
              private notification: LocalNotifications, private platform: Platform) {
    if (isCordova(this.platform))
      this.audio.preloadSimple('notification', 'assets/sfx/definite.mp3');
    this.timerObservable = Observable.create(observer => {
      this.timerObserver = observer;
    });
  }

  getTimer(): Observable<Timer> {
    return this.timerObservable;
  }

  isRunning(): boolean {
    return (this.timer.current > 0);
  }

  setTimer(uuid: string, name: string, stepID: number, seconds: number) {
    clearInterval(this.timer.id);
    this.timer.uuid = uuid;
    this.timer.name = name;
    this.timer.stepID = stepID;
    this.timer.time = seconds;
    this.timer.current = this.timer.time;
    this.timer.asText = TimerProvider.timeToString(this.timer.current);
    this.timer.id = setInterval(x => {
      this.timer.asText = TimerProvider.timeToString(this.timer.current - 1);
      if (this.timer.current <= 0) {
        if (isCordova(this.platform)) {
          this.vibration.vibrate(1000);
          this.audio.play('notification');
        }
        clearInterval(this.timer.id);
      } else {
        this.timer.current--;
      }
      this.timerObserver.next(this.timer);
    }, 1000);
    if (isCordova(this.platform)) {
      this.notification.cancelAll().then(() => this.notification.schedule({
          id: TimerProvider.NOTIFICATION_TAG,
          title: 'Cookbook',
          text: `Step completed in '${this.timer.name}'`,
          at: new Date(new Date().getTime() + this.timer.time * 1000),
        })
      )
    }
  }

  cancelTimer() {
    clearInterval(this.timer.id);
    this.timer.current = 0;
    this.timer.asText = '0s';
    if (isCordova(this.platform)) {
      this.notification.cancelAll();
    }
  }

  setNotification(title: string, body: string, time: Date) {

  }

  static timeToString(seconds: number): string {
    let hours = (seconds / 3600);
    let minutes = ((seconds % 3600) / 60);
    seconds %= 60;

    return hours >= 1 ? Math.round(hours) + 'h ' : (minutes >= 1 ? Math.round(minutes) + 'm ' : (seconds + 's'));
  }
}

export interface Timer {
  id: number;
  time: number;
  current: number;
  asText: string;
  uuid: string;
  name: string;
  stepID: number;
}
