import {permutations} from "./depot/arrayHelpers";

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
    permutations([1, 2]);
    return Promise.resolve(0);
}
