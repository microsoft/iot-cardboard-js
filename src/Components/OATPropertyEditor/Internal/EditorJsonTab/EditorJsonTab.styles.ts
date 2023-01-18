import {
    IEditorJsonTabStyleProps,
    IEditorJsonTabStyles
} from './EditorJsonTab.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-editorjsontab`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const EDITORJSONTAB_CLASS_NAMES = classNames;
export const getStyles = (
    _props: IEditorJsonTabStyleProps
): IEditorJsonTabStyles => {
    return {
        root: [
            classNames.root,
            {
                height: '100%'
            }
        ],
        subComponentStyles: {}
    };
};
