import {Observable} from "rxjs";
import {getTimerPromise} from "./depot/promiseHelpers";

if (require.main === module) {
    main()
    .then((exitCode) => {
        if (exitCode !== 0) {
            process.exit(exitCode);
        }
    })
    .catch((err) => {
        console.error(JSON.stringify(err, undefined, 4));
        process.exit(-1);
    });
}


function main(): Promise<number> {

    const number$ = new Observable<number>((subscriber) => {
        getTimerPromise(500, 1)
        .then((val) => {
            subscriber.next(val);
            subscriber.complete();
        })
        .catch((err) => {
            subscriber.error(err);
        });
    });

    number$.subscribe(
        (val) => { console.log(`Emitted value: ${val}.`); },
        (err) => { console.log(`Errored: ${err}`); },
        () => { console.log(`Completed.`); }
    );

    return Promise.resolve(0);
}
