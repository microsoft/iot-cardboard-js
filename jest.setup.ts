import '@testing-library/jest-dom/extend-expect';
import 'jest-canvas-mock';

jest.mock('./src/i18n.ts', () => ({ t: (key: string) => key }));
process.env.isTestMode = 'true'; // set this so we don't log in i18n
