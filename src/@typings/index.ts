import {type Response} from 'got';
import {type VervalPd} from '@/index.js';

export type CookieInstance = {
  load: <T>() => Promise<T>;
  store: <Value>(value: Value) => Promise<boolean> | boolean;
};

export type Credentials = {
  email: string;
  password: string;
};

export type MethodScraper<Result, Args> = <App extends VervalPd>(app: App, responseBefore?: Response, args?: Args) => Promise<Result>;

export type VervalConfig = {
  baseUrl?: string;
  cookieInstance: CookieInstance;
};

export type VervalFetchedData = {
  sekolahId: string;
};

export * as StudentTypes from './student.js';
