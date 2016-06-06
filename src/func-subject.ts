import * as Rx from './rx-with-dom'

interface FuncSubject<T> {
    (t:T):void;
    events:Rx.Subject<T>;
}

export default function subject<T>() {
    var obs = new Rx.Subject<T>();
    var emit:FuncSubject<T> = function emit(t:T):void {
        obs.onNext(t);
    } as any;
    emit.events = obs;
    return emit;
}