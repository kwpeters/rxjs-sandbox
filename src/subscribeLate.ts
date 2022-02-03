import {Observable} from "rxjs";


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
    // Question: When an observable is subscribed to after it has already
    // started emitting values, does that late subscriber see all the values from
    // the beginning of the stream?

    // Answer: Yes.

    const number$ = createCountingObservable(10);

    number$.subscribe(
        (val) =>
        {
            console.log(val);
            if (val === 5)
            {
                console.log("Creating second subscription.");
                number$.subscribe((val2) =>
                {
                    console.log(`subscription 2: ${val2}`);
                });
            }
        },
        (err) =>
        {
            console.log(`Errored: ${err}`);
        },
        () =>
        {
            console.log(`Completed.`);
        }
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
