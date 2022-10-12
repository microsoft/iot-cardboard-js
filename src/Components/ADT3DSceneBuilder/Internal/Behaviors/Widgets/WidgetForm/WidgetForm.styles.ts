import {
    memoizeFunction,
    mergeStyleSets,
    FontSizes,
    IStyle,
    Theme,
    IChoiceGroupStyles
} from '@fluentui/react';
import { leftPanelBuilderBlock } from '../../../../../../Resources/Styles/BaseStyles';

const classPrefix = 'widget-form';
const classNames = {
    description: `${classPrefix}-description`,
    innerDescription: `${classPrefix}-inner-description`,
    widgetFormContents: `${classPrefix}-widget-form-contents`,
    rangeBuilderRoot: `${classPrefix}-gauge-widget-range-builder`,
    label: `${classPrefix}-label`,
    choiceGroup: `${classPrefix}-choice-group`,
    stackWithTooltipAndRequired: `${classPrefix}-stack-with-required-label-and-tooltip`
};
export const getWidgetFormStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        description: [
            classNames.description,
            {
                fontSize: FontSizes.size14,
                color: theme.palette.neutralSecondary
            } as IStyle
        ],
        innerDescription: [
            classNames.innerDescription,
            {
                fontSize: FontSizes.size12,
                color: theme.palette.neutralSecondary
            } as IStyle
        ],
        widgetFormContents: [
            classNames.widgetFormContents,
            leftPanelBuilderBlock,
            {
                overflowY: 'auto',
                overflowX: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1
            } as IStyle
        ],
        rangeBuilderRoot: [
            classNames.rangeBuilderRoot,
            {
                paddingTop: 8
            } as IStyle
        ],
        label: [
            classNames.label,
            {
                margin: '4px 0 0',
                padding: 0,
                height: 20
            } as IStyle
        ],
        choiceGroup: [
            classNames.choiceGroup,
            {
                marginTop: 0,
                flexContainer: {
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: 4
                }
            } as Partial<IChoiceGroupStyles>
        ],
        stackWithTooltipAndRequired: [
            classNames.stackWithTooltipAndRequired,
            {
                'label::after': { paddingRight: 0 }
            } as IStyle
        ]
    });
});
