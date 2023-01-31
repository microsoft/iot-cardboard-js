import { CardboardClassNamePrefix } from '../../../../Models/Constants';
import {
    IEditorPropertiesTabStyleProps,
    IEditorPropertiesTabStyles
} from './EditorPropertiesTab.types';

const classPrefix = `${CardboardClassNamePrefix}-editorpropertiestab`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const EDITORPROPERTIESTAB_CLASS_NAMES = classNames;
export const getStyles = (
    _props: IEditorPropertiesTabStyleProps
): IEditorPropertiesTabStyles => {
    return {
        root: [
            classNames.root,
            {
                height: '100%'
            }
        ],
        subComponentStyles: {
            propertyListStack: {
                root: {
                    overflowY: 'auto'
                }
            }
        }
    };
};
