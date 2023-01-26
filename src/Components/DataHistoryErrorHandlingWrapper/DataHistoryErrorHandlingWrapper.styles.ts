import { FontSizes } from '@fluentui/theme';
import {
    IDataHistoryErrorHandlingWrapperStyleProps,
    IDataHistoryErrorHandlingWrapperStyles
} from './DataHistoryErrorHandlingWrapper.types';

export const classPrefix = 'cb-datahistoryerrorhandlingwrapper';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: IDataHistoryErrorHandlingWrapperStyleProps
): IDataHistoryErrorHandlingWrapperStyles => {
    return {
        root: [
            classNames.root,
            {
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden'
            }
        ],
        subComponentStyles: {
            calloutStyles: {
                root: {
                    padding: '16px 20px 20px',
                    maxWidth: 300,
                    fontSize: FontSizes.size12
                }
            },
            calloutText: {
                root: { maxHeight: 100, overflowX: 'hidden', overflowY: 'auto' }
            },
            image: {
                root: { flexShrink: 0 },
                image: { maxWidth: '100%' }
            },
            illustrationMessage: {
                container: { flexGrow: 1, paddingTop: 0, overflow: 'hidden' },
                descriptionContainer: {
                    paddingTop: 12,
                    whiteSpace: 'normal',
                    overflow: 'hidden',
                    span: {
                        width: '100%',
                        display: 'block',
                        overflowY: 'auto'
                    }
                }
            }
        }
    };
};
