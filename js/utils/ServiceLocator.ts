export type ServiceFactory<T> = () => T;

export class ServiceLocator {
    private readonly services = new Map<symbol, unknown>();
    private readonly factories = new Map<symbol, ServiceFactory<unknown>>();

    registerSingleton<T>(key: symbol, instance: T): void {
        this.services.set(key, instance);
    }

    registerTransient<T>(key: symbol, factory: ServiceFactory<T>): void {
        this.factories.set(key, factory);
    }

    get<T>(key: symbol): T {
        const factory = this.factories.get(key);

        if (factory) {
            return factory() as T;
        }

        const service = this.services.get(key);

        if (!service) {
            throw new Error(`Service not registered`);
        }

        return service as T;
    }
}

export const serviceLocator = new ServiceLocator();
