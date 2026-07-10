/**
 * A callback invoked by an {@link EventEmitter}.
 *
 * @typeParam T - Tuple type describing the listener parameters. For example, `[number, string]`.
 *
 * @example
 * ```ts
 * type MyListener = ListenerCallback<[number, string]>;
 * const fn: MyListener = (id, name) => { console.log(id, name); };
 * ```
 */
export type ListenerCallback<T extends unknown[] = unknown[]> = (...data: T) => void;

/**
 * Simple, strongly typed in-memory event emitter.
 *
 * @typeParam T - Tuple type of the arguments passed to listeners. E.g. `[TileInfo]`.
 *
 * @example
 * ```ts
 * const e = new EventEmitter<[number, string]>();
 * e.add((id, name) => console.log(id, name));
 * e.emit(1, 'alice');
 * ```
 */
export class EventEmitter<T extends unknown[] = unknown[]> {
    private listeners: ListenerCallback<T>[] = [];

    /**
     * Register a listener.
     *
     * @param listener - Listener to add.
     */
    private wrapperMap = new Map<ListenerCallback<T>, ListenerCallback<T>>();

    add(listener: ListenerCallback<T>) {
        this.listeners.push(listener);
        // store identity mapping for non-wrapped listeners too (optional)
        this.wrapperMap.set(listener, listener);
    }

    /**
     * Register a listener that will only be called if the predicate returns true.
     *
     * @param predicate - Predicate function to filter.
     * @param listener - Listener to add.
     *
     * @example
     * ```ts
     * const e = new EventEmitter<[number, string]>();
     * e.addFiltered((id, name) => id > 0, (id, name) => console.log(id, name));
     * e.emit(0, 'alice'); // not logged
     * e.emit(1, 'bob'); // logged
     * ```
     */
    addFiltered(predicate: (...data: T) => boolean, listener: ListenerCallback<T>): () => void {
        const wrapper: ListenerCallback<T> = (...data) => {
            if (predicate(...data)) listener(...data);
        };
        this.listeners.push(wrapper);
        this.wrapperMap.set(listener, wrapper);
        return () => {
            this.remove(listener);
        };
    }


    /**
     * Remove a previously registered listener.
     *
     * @param listener - Listener to remove.
     */
    remove(listener: ListenerCallback<T>) {
        const wrapper = this.wrapperMap.get(listener) ?? listener;
        this.listeners = this.listeners.filter((l) => l !== wrapper);
        this.wrapperMap.delete(listener);
    }

    /**
     * Emit an event to all registered listeners.
     *
     * @param data - Spread arguments forwarded to each listener.
     */
    emit(...data: T) {
        this.listeners.forEach((listener) => listener(...data));
    }

    /**
     * Remove all listeners.
     */
    clear() {
        this.listeners.length = 0;
    }
}