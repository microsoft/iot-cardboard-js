import { memoizeFunction, mergeStyleSets, Theme } from '@fluentui/react';
import { ICheckboxRendererStyles } from './CheckboxRenderer.types';

export const getStyles = memoizeFunction(
    (theme: Theme): ICheckboxRendererStyles => {
        return mergeStyleSets({
            root: {
                alignItems: 'center',
                border: `1px solid ${theme.palette.black}`,
                borderRadius: 2,
                display: 'flex',
                height: 20,
                justifyContent: 'center',
                width: 20
            },
            isChecked: {
                backgroundColor: theme.palette.themePrimary,
                borderColor: theme.palette.themePrimary
            },
            checkmark: {
                // hard coding as we always want it to be white in all themes
                color: '#FFF'
            }
        });
    }
);
