import '@testing-library/jest-dom/extend-expect';
import 'jest-canvas-mock';
import i18n from './src/i18n';

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

// mock out utilities
const MOCK_GUID = '00000000-1111-2222-3333-444444444444';
jest.mock('./src/Models/Services/Utils', () => {
    const actual = jest.requireActual('./src/Models/Services/Utils');
    actual.createGuid = () => MOCK_GUID;
    return actual;
});

// mock the global window object
globalThis.window = {
    ...globalThis.window,
    location: {
        ...globalThis.window?.location,
        assign: jest.fn(),
        href: 'http://testUrl.com',
        reload: jest.fn(),
        replace: jest.fn()
    } as any
} as Window & typeof globalThis;
