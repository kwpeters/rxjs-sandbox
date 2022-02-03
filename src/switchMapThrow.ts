import {Observable, of} from "rxjs";
import {switchMap} from "rxjs/operators";

if (require.main === module)
{
    main()
    .then((exitCode) =>
    {
        if (exitCode !== 0)
        {
            process.exit(exitCode);
        }
    })

    .catch((err) =>
    {
        console.error(JSON.stringify(err, undefined, 4));
        process.exit(-1);
    });
}


function main(): Promise<number>
{
    // Question:  switchMap() is supposed to return an "inner" observable.  What
    // happens if it throws instead?  Will the thrown object error the stream?

    // Answer: Yes, the thrown object errors the stream.

    const number$ = createCountingObservable(10)
    .pipe(switchMap((val) =>
    {
        // The following is not logged after the stream errors.
        console.log(`... processing ${val}...`);
        if (val === 6)
        {
            throw new Error("Value of 6 has triggered an error.");
        }
        else
        {
            return of(val);
        }
    }));

    number$.subscribe(
        (val) => { console.log(`Emitted value: ${val}.`); },
        (err) => { console.log(`Errored: ${err}`); },
        () => { console.log(`Completed.`); }
    );

    return Promise.resolve(0);
}


function createCountingObservable(iterations: number, period = 1000): Observable<number>
{
    return new Observable<number>((subscriber) =>
    {
        let iterationsDone = 0;
        const timeoutHandler = () =>
        {
            iterationsDone++;
            subscriber.next(iterationsDone);
            if (iterationsDone < iterations)
            {
                setTimeout(timeoutHandler, period);
            }
            else {
                subscriber.complete();
            }
        };

        setTimeout(timeoutHandler, period);
    });
}
