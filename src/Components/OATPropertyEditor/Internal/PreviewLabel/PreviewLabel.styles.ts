import {
    IPreviewLabelStyleProps,
    IPreviewLabelStyles
} from './PreviewLabel.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-previewlabel`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const PREVIEWLABEL_CLASS_NAMES = classNames;
export const getStyles = (
    props: IPreviewLabelStyleProps
): IPreviewLabelStyles => {
    const { theme } = props;
    return {
        root: [
            classNames.root,
            {
                width: 'fit-content',
                borderRadius: theme.effects.roundedCorner4,
                backgroundColor: theme.palette.neutralLighter
            }
        ],
        subComponentStyles: {
            badgeButton: {
                root: {
                    height: 32
                }
            }
        }
    };
};
