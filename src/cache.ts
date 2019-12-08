import { Cache } from 'memory-cache';

export const cached = () => {
    return (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        const oldFunc = descriptor.value;
        descriptor.value = function(...args: any) {
            console.log(`!!!!!!!!!! ${propertyKey} called !!!!!!!!!!`);
            return oldFunc.apply(this, args);
        };
    };
};
