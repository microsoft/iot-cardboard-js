import { CardboardClassNamePrefix } from '../..';
import {
    getControlBackgroundColor,
    PANEL_VERTICAL_SPACING,
    PROPERTY_EDITOR_WIDTH,
    PROPERTY_EDITOR_WIDTH_EXPANDED
} from '../../Models/Constants/OatStyleConstants';
import { IOatPropertyEditorTabKey } from '../../Pages/OATEditorPage/Internal/Classes/OatTypes';
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
    const { selectedTab, theme } = props;
    return {
        root: [
            classNames.root,
            {
                backgroundColor: getControlBackgroundColor(theme),
                borderRadius: theme.effects.roundedCorner2,
                boxShadow: theme.effects.elevation16,
                display: 'flex',
                flexDirection: 'row',
                height: `calc(100vh - ${PANEL_VERTICAL_SPACING}px)`,
                justifyContent: 'center',
                padding: 16,
                position: 'relative',
                width:
                    selectedTab === IOatPropertyEditorTabKey.DTDL
                        ? PROPERTY_EDITOR_WIDTH_EXPANDED
                        : PROPERTY_EDITOR_WIDTH
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
                    height: `calc(100% - ${OatEditorPivotHeaderHeight + 8}px)` // add the padding
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
        previewLabelContainer: [
            {
                position: 'absolute',
                right: 24,
                top: 18, // 16 container padding + 2 inner padding
                zIndex: 1000
            }
        ],
        subComponentStyles: {
            illustrationMessage: {
                container: {
                    alignItems: 'unset'
                },
                subComponentStyles: {
                    image: {
                        root: {
                            display: 'flex',
                            justifyContent: 'center'
                        }
                    }
                }
            }
        }
    };
};
