import { IMessageBarStyles } from '@fluentui/react';
import {
    IResourcePickerStyleProps,
    IResourcePickerStyles
} from './ResourcePicker.types';

export const classPrefix = 'cb-resourcepicker';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    props: IResourcePickerStyleProps
): IResourcePickerStyles => {
    return {
        root: [classNames.root],
        comboBoxOptionWrapper: {
            width: '100%',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between'
        },
        comboBoxOptionText: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        labelContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            overflow: 'hidden',
            padding: '5px 0',
            width: '100%'
        },
        label: {
            fontSize: 14,
            fontWeight: 600,
            '&::after': {
                color: props.theme.semanticColors.errorText,
                content: ' *',
                paddingRight: 12
            }
        },
        subComponentStyles: {
            errorMessageBar: {
                root: {
                    maxWidth: '50%',
                    minHeight: 'unset'
                },
                content: {
                    alignItems: 'center'
                },
                dismissal: {
                    padding: 0,
                    width: 10,
                    height: 10
                },
                iconContainer: { margin: 0, padding: '1px 2px 0' },
                text: { margin: 0, paddingLeft: '8px' }
            } as IMessageBarStyles,
            comboBox: { callout: { width: 400 } }
        }
    };
};
