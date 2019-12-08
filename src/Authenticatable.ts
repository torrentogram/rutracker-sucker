export interface Authenticatable {
    authenticate(): Promise<void>;
    isAuthenticated(): Promise<boolean>;
    lastAuthenticationTime: number;
}
