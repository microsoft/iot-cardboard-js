import { CardboardClassNamePrefix } from '../..';
import {
    getControlBackgroundColor,
    PROPERTY_EDITOR_VERTICAL_SPACING,
    PROPERTY_EDITOR_WIDTH
} from '../../Models/Constants/OatStyleConstants';
import { IEditorStyleProps, IEditorStyles } from './Editor.types';

export const OatEditorPivotHeaderHeight = 36;

const classPrefix = `${CardboardClassNamePrefix}-Editor`;
const classNames = {
    root: `${classPrefix}-root`,
    modal: `${classPrefix}-modal`,
    pivot: `${classPrefix}-pivot`,
    pivotItem: `${classPrefix}-pivotItem`
};

// export const Editor_CLASS_NAMES = classNames;
export const getStyles = (props: IEditorStyleProps): IEditorStyles => {
    const { theme } = props;
    return {
        root: [
            classNames.root,
            {
                backgroundColor: getControlBackgroundColor(theme),
                borderRadius: theme.effects.roundedCorner2,
                display: 'flex',
                flexDirection: 'row',
                height: `calc(100vh - ${PROPERTY_EDITOR_VERTICAL_SPACING}px)`,
                padding: 16,
                width: PROPERTY_EDITOR_WIDTH,
                justifyContent: 'center'
            }
        ],
        modal: [
            classNames.modal,
            {
                border: `1px solid ${theme.semanticColors.variantBorder}`,
                borderRadius: '2px',
                padding: '15px 25px',
                minWidth: '600px'
            }
        ],
        pivot: [
            classNames.pivot,
            {
                width: '100%',
                '[role="tabpanel"]': {
                    height: `calc(100% - ${OatEditorPivotHeaderHeight}px)`
                },
                overflowX: 'hidden',
                zIndex: '201'
            }
        ],
        pivotItem: [
            classNames.pivotItem,
            {
                height: '100%',
                backgroundColor: 'transparent'
            }
        ],
        subComponentStyles: {}
    };
};
