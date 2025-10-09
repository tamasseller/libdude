
type Diff<T, U> = T extends U ? never : T;

export function coalesce<I, T, U>(input: I[], t: abstract new (...args: any[]) => T, join: (ts: T[]) => U[]): (U | Diff<I, T>)[]
{
    const end: T[] = []
    const out: (U | Diff<I, T>)[] = []

    for(const i of input)
    {
        if(i instanceof t)
        {
            end.push(i)
        }
        else
        {
            if(end.length)
            {
                out.push(...join(end))
                end.length = 0;
            }

            out.push(i as Diff<I, T>)
        }
    }

    if(end.length) out.push(...join(end))

    return out
}