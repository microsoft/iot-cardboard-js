import { FontSizes } from '@fluentui/react';
import {
    IAlertIconStylePreviewProps,
    IAlertIconPreviewStyles
} from './AlertIconPreview.types';

const classPrefix = 'alert-icon-preview';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    props: IAlertIconStylePreviewProps
): IAlertIconPreviewStyles => {
    const { theme } = props;
    return {
        root: [
            classNames.root,
            {
                alignItems: 'center',
                border: `1px solid ${theme.semanticColors.inputBorder}`,
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'center',
                height: 60,
                width: 60
            }
        ],
        subComponentStyles: {
            alertIcon: {
                root: {
                    fontSize: FontSizes.size20,
                    height: 42,
                    width: 42
                }
            }
        }
    };
};
