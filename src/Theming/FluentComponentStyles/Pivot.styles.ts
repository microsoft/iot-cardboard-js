import { IPivotStyles, ITheme } from '@fluentui/react';
import { Theme } from '../../Models/Constants/Enums';

export const getPivotStyles = (
    _themeSetting: Theme,
    _theme: ITheme
): Partial<IPivotStyles> => {
    return {
        icon: {
            marginRight: 4
        },
        link: {
            height: '36px'
        }
    };
};
