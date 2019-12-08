import cache from 'memory-cache';

export const cached = ({ ttl = 20 * 60 * 1000, keyPrefix = null } = {}) => {
    return (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        const oldFunc = descriptor.value;
        descriptor.value = async function(...args: any) {
            const prefix = keyPrefix ? keyPrefix : propertyKey;
            const cacheKey = `${prefix}(${JSON.stringify(args)})`;
            const cachedResult = cache.get(cacheKey);
            if (cachedResult !== null) {
                console.log('cache hit');
                return cachedResult;
            }
            console.log('cache miss');
            const result = await oldFunc.apply(this, args);
            cache.put(cacheKey, result, ttl);
            return result;
        };
    };
};
