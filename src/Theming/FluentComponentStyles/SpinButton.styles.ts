import { ISpinButtonStyles, ITheme } from '@fluentui/react';
import { Theme } from '../../Models/Constants/Enums';

export const getSpinButtonStyles = (
    _themeSetting: Theme,
    _theme: ITheme,
): Partial<ISpinButtonStyles> => {
    return {
        root: {
            selectors: {
                '&.cb-modelcreate-readonly': {
                    selectors: {
                        label: {
                            color: 'var(--cb-color-text-primary)',
                        },
                        input: {
                            color: 'var(--cb-color-text-primary)',
                            background: 'transparent',
                        },
                        div: {
                            color: 'var(--cb-color-text-primary)',
                            background: 'transparent',
                        },
                        span: {
                            display: 'none',
                        },
                        'div::after': {
                            border: 'none',
                        },
                    },
                },
            },
        },
    };
};
