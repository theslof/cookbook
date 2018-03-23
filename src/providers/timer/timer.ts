import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Vibration} from "@ionic-native/vibration";
import {NativeAudio} from "@ionic-native/native-audio";

@Injectable()
export class TimerProvider {
  timerObserver: any;
  timerObservable: Observable<Timer>;
  timer: Timer = {
    id: 0,
    time: 0,
    current: 0,
    asText: '0s',
    recipeID: -1,
    stepID: -1,
  };

  constructor(private vibration: Vibration, private audio: NativeAudio) {
    this.audio.preloadSimple('notification', 'assets/sfx/definite.mp3');
    this.timerObservable = Observable.create(observer => {
      this.timerObserver = observer;
    });
  }

  getTimer(): Observable<Timer>{
    return this.timerObservable;
  }

  isRunning(): boolean {
    return (this.timer.current > 0);
  }

  setTimer(recipeID: number, stepID: number, seconds: number) {
    clearInterval(this.timer.id);
    this.timer.recipeID = recipeID;
    this.timer.stepID = stepID;
    this.timer.time = seconds;
    this.timer.current = this.timer.time;
    this.timer.asText = TimerProvider.timeToString(this.timer.current);
    this.timer.id = setInterval(x => {
      this.timer.asText = TimerProvider.timeToString(this.timer.current - 1);
      if (this.timer.current <= 0) {
        this.vibration.vibrate(1000);
        this.audio.play('notification');
        clearInterval(this.timer.id);
      } else {
        this.timer.current--;
      }
      this.timerObserver.next(this.timer);
    }, 1000);
  }

  cancelTimer() {
    clearInterval(this.timer.id);
    this.timer.current = 0;
    this.timer.asText = '0s';
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
  recipeID: number;
  stepID: number;
}
