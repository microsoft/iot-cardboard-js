import { IDropdownStyles, ITheme } from '@fluentui/react';
import { Theme } from '../../Models/Constants/Enums';

export const getDropdownStyles = (
    _themeSetting: Theme,
    _theme: ITheme
): Partial<IDropdownStyles> => {
    return {
        root: {
            selectors: {
                '&.cb-modelcreate-readonly': {
                    selectors: {
                        label: {
                            color: 'var(--cb-color-text-primary)',
                            paddingBottom: 0
                        },
                        '.ms-Dropdown-title': {
                            color: 'var(--cb-color-text-primary)',
                            background: 'transparent'
                        },
                        '.ms-Dropdown-caretDownWrapper': {
                            display: 'none'
                        }
                    }
                }
            }
        }
    };
};
