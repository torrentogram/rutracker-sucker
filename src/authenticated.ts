import { Authenticatable } from './Authenticatable';

export const authenticated = ({ ttl = 20 * 60 * 1000 } = {}) => (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) => {
    const oldFunc = descriptor.value;
    descriptor.value = async function(...args: any) {
        const self = <Authenticatable>this;

        if (
            Date.now() - ttl <= self.lastAuthenticationTime ||
            (await self.isAuthenticated())
        ) {
            return oldFunc.apply(this, args);
        } else {
            console.log('--- Authentication');
            await self.authenticate();
            self.lastAuthenticationTime = Date.now();
            return oldFunc.apply(this, args);
        }
    };
};
