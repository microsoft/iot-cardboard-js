import { ITextFieldStyles, ITheme } from '@fluentui/react';
import { Theme } from '../../Models/Constants/Enums';

export const getTextFieldStyles = (
    _themeSetting: Theme,
    _theme: ITheme
): Partial<ITextFieldStyles> => {
    return {
        root: {
            selectors: {
                '&.cb-modelcreate-readonly': {
                    selectors: {
                        label: {
                            color: 'var(--cb-color-text-primary)',
                            paddingBottom: 0
                        },
                        '.ms-TextField-fieldGroup': {
                            border: 'none'
                        },
                        input: {
                            color: 'var(--cb-color-text-primary)',
                            background: 'transparent'
                        },
                        textarea: {
                            color: 'var(--cb-color-text-primary)',
                            background: 'transparent'
                        },
                        '.ms-TextField-description': {
                            display: 'none'
                        }
                    }
                }
            }
        }
    };
};
