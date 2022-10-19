import {
    IConditionsCalloutStyleProps,
    IConditionsCalloutStyles
} from './ConditionsCallout.types';

export const classPrefix = 'cb-conditionscallout';
const classNames = {
    root: `${classPrefix}-root`,
    footer: `${classPrefix}-footer`
};
export const getStyles = (
    _props: IConditionsCalloutStyleProps
): IConditionsCalloutStyles => {
    return {
        root: [classNames.root],
        footer: [
            classNames.footer,
            {
                paddingTop: 20
            }
        ],
        subComponentStyles: {
            callout: {
                root: {
                    height: 400,
                    width: 300,
                    padding: 8
                }
            }
        }
    };
};
