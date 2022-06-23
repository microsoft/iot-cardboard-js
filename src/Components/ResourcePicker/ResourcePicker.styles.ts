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
        subComponentStyles: {}
    };
};
