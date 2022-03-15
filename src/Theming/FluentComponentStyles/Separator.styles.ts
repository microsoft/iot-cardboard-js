import { ISeparatorStyles, ITheme } from '@fluentui/react';
import { Theme } from '../../Models/Constants/Enums';

export const getSeparatorStyles = (
    _themeSetting: Theme,
    theme: ITheme
): Partial<ISeparatorStyles> => {
    return {
        root: {
            '&:before': {
                backgroundColor: theme.palette.neutralLight
            }
        }
    };
};
