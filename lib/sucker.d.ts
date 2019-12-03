import ExtendableError from 'es6-error';
export interface SearchResult {
    title: string;
    topicId: number;
    forumName: string;
    seeds: number;
    size: number;
}
export declare class AuthenticationError extends ExtendableError {
    message: string;
}
export declare class RutrackerSucker {
    private readonly login;
    private readonly password;
    private baseURL;
    private http;
    private cookieJar;
    constructor(login: string, password: string);
    private parseLoggedInUser;
    isAuthenticated(): Promise<boolean>;
    authenticate(): Promise<void>;
    search(q: string): Promise<Array<SearchResult>>;
}
