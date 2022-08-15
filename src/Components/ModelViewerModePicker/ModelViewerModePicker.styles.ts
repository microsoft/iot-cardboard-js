import { FontSizes, FontWeights } from '@fluentui/react';
import {
    IModelViewerModePickerStyles,
    IModelViewerModePickerStyleProps
} from './ModelViewerModePicker.types';

export const classPrefix = 'cb-model-viewer-mode-picker';
const classNames = {
    colorPicker: `${classPrefix}-colorPicker`,
    subHeader: `${classPrefix}-subHeader`
};
export const getStyles = (
    _props: IModelViewerModePickerStyleProps
): IModelViewerModePickerStyles => {
    return {
        colorPicker: [
            classNames.colorPicker,
            {
                height: 45,
                display: 'flex',
                alignItems: 'center'
            }
        ],
        subHeader: [
            classNames.subHeader,
            {
                fontSize: FontSizes.size14,
                fontWeight: FontWeights.semibold,
                margin: 0
            }
        ],
        subComponentStyles: {}
    };
};
