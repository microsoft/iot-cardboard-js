import { IJSONEditorStyleProps, IJSONEditorStyles } from './JSONEditor.types';
import { CardboardClassNamePrefix } from '../../../../../../Models/Constants/Constants';

export const EDITOR_HEIGHT = `calc(100% - 8px)`;

const classPrefix = `${CardboardClassNamePrefix}-json-editor-tab`;
const classNames = {
    root: `${classPrefix}-root`,
    editor: `${classPrefix}-editor`
};

// export const JSONEDITOR_CLASS_NAMES = classNames;
export const getStyles = (_props: IJSONEditorStyleProps): IJSONEditorStyles => {
    return {
        root: [
            classNames.root,
            { height: '100%', padding: 8, paddingBottom: 16 }
        ],
        editor: [classNames.editor],
        subComponentStyles: {}
    };
};
