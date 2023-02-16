import { IJSONEditorStyleProps, IJSONEditorStyles } from './JSONEditor.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-jsoneditor`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const JSONEDITOR_CLASS_NAMES = classNames;
export const getStyles = (_props: IJSONEditorStyleProps): IJSONEditorStyles => {
    return {
        root: [classNames.root, { height: '100%' }],
        subComponentStyles: {}
    };
};
