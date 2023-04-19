import { ICardboardComboBoxSelectStyleProps } from './CardboardComboBox.types';
import { IStyle, memoizeFunction, mergeStyleSets } from '@fluentui/react';

export const getStyles = memoizeFunction(
    (props: ICardboardComboBoxSelectStyleProps) => {
        const { isDescriptionError, theme } = props;
        return mergeStyleSets({
            label: {
                marginLeft: 4
            },
            description: [
                isDescriptionError
                    ? {
                          color: theme.semanticColors.errorText
                      }
                    : {
                          color: theme.semanticColors.inputBorder
                      },
                {
                    marginTop: '5px !important', // 5 is what Fluent has so going with it
                    marginLeft: 4
                }
            ] as IStyle[]
        });
    }
);
