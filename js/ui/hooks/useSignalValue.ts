import { useEffect, useState } from 'react';

export function useSignalValue<T>(signal: {
    value: T;
    subscribe: (callback: (value: T) => void) => () => void;
}) {
    const [value, setValue] = useState(signal.value);

    useEffect(() => {
        return signal.subscribe(setValue);
    }, [signal]);

    return value;
}
