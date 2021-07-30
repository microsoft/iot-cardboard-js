import { ITheme, IToggleStyles } from '@fluentui/react';
import { Theme } from '../../Models/Constants/Enums';

export const getToggleStyles = (
    _themeSetting: Theme,
    _theme: ITheme
): Partial<IToggleStyles> => {
    return {
        root: {
            selectors: {
                '&.cb-modelcreate-readonly': {
                    selectors: {
                        label: {
                            color: 'var(--cb-color-text-primary)'
                        },
                        button: {
                            display: 'none'
                        }
                    }
                }
            }
        }
    };
};
