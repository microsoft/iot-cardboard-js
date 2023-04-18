import { ICarboardCreatableSelectStyleProps } from './CarboardCreatableSelect.types';
import { IStyle, memoizeFunction, mergeStyleSets } from '@fluentui/react';

export const getStyles = memoizeFunction(
    (props: ICarboardCreatableSelectStyleProps) => {
        const { isDescriptionError, theme } = props;
        return mergeStyleSets({
            label: {
                marginLeft: 4
            },
            description: [
                isDescriptionError && {
                    color: theme.semanticColors.errorText
                },
                {
                    marginTop: '5px !important', // 5 is what Fluent has so going with it
                    marginLeft: 4
                }
            ] as IStyle[]
        });
    }
);
