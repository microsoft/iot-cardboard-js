import '@testing-library/jest-dom/extend-expect';
import 'jest-canvas-mock';
import i18n from './src/i18n';
import crypto from 'crypto';

process.env.isTestMode = 'true'; // set this so we don't log in i18n

jest.mock('./src/i18n.ts', () => ({ t: (key: string) => key }));
jest.mock('react-i18next', () => ({
    // this mock makes sure any components using the useTranslate hook can use it without a warning being shown
    useTranslation: () => {
        return {
            t: (str) => str,
            i18n: i18n
        };
    }
}));

Object.defineProperty(window, 'crypto', {
    value: {
        getRandomValues: (arr: string | never[]) =>
            crypto.randomBytes(arr.length)
    }
});
