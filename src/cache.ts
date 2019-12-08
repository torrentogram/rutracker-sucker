import cache from 'memory-cache';

const objectIds = new WeakMap();
const getId = (obj: object): string => {
    const existingId = objectIds.get(obj);
    if (!existingId) {
        objectIds.set(obj, ((Math.random() * 1e9) | 0).toString(36));
    }
    return objectIds.get(obj);
};

interface CachedOptions {
    ttl?: number;
    keyPrefix?: string | null;
    instance?: boolean;
}
export const cached = ({
    ttl = 20 * 60 * 1000,
    keyPrefix = null,
    instance = false,
}: CachedOptions = {}) => {
    return (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        const oldFunc = descriptor.value;
        descriptor.value = async function(...args: any) {
            let prefix = keyPrefix ? keyPrefix : propertyKey;
            if (instance) {
                prefix = `${getId(this)}-${prefix}`;
            }
            const cacheKey = `${prefix}(${JSON.stringify(args)})`;
            const cachedResult = cache.get(cacheKey);
            if (cachedResult !== null) {
                console.log(`cache hit: ${cacheKey}`);
                return cachedResult;
            }
            console.log(`cache miss: ${cacheKey}`);
            const result = await oldFunc.apply(this, args);
            cache.put(cacheKey, result, ttl);
            return result;
        };
    };
};
