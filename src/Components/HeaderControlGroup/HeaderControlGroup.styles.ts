import {
    IHeaderControlGroupStyleProps,
    IHeaderControlGroupStyles
} from './HeaderControlGroup.types';

export const classPrefix = 'cb-HeaderControlGroup';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    props: IHeaderControlGroupStyleProps
): IHeaderControlGroupStyles => {
    const { theme } = props;
    return {
        root: [
            classNames.root,
            {
                backgroundColor: theme.semanticColors.buttonBackground,
                border: `1px solid ${theme.palette.neutralLight}`,
                borderRadius: 4
            }
        ],
        subComponentStyles: {
            stack: {
                root: {
                    width: 'fit-content'
                }
            }
        }
    };
};
