import {
    IPropertyIconStyleProps,
    IPropertyIconStyles
} from './PropertyIcon.types';
import { CardboardClassNamePrefix } from '../../../../../../../../Models/Constants/Constants';

export const classPrefix = `${CardboardClassNamePrefix}-property-icon`;
const classNames = {
    root: `${classPrefix}-root`,
    iconCustom: `${classPrefix}-icon-custom`,
    iconFluent: `${classPrefix}-icon-fluent`
};
export const getStyles = (
    props: IPropertyIconStyleProps
): IPropertyIconStyles => {
    const { theme } = props;
    return {
        root: [
            classNames.root,
            {
                display: 'flex',
                alignItems: 'center'
            }
        ],
        customIcon: [
            classNames.iconCustom,
            {
                path: {
                    fill: theme.semanticColors.bodyText
                },
                circle: {
                    stroke: theme.semanticColors.bodyText
                },
                line: {
                    stroke: theme.semanticColors.bodyText
                },
                rect: {
                    stroke: theme.semanticColors.bodyText
                }
            }
        ],
        fluentIcon: [classNames.iconFluent, { padding: 6 }],
        subComponentStyles: {}
    };
};
