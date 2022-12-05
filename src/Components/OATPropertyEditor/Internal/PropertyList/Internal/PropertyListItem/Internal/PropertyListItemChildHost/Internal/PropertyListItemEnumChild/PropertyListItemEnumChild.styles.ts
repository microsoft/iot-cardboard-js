import {
    IPropertyListItemEnumChildStyleProps,
    IPropertyListItemEnumChildStyles
} from './PropertyListItemEnumChild.types';
import { CardboardClassNamePrefix } from '../../../../../../../../../../Models/Constants/Constants';
import { getIndentation } from '../../../../PropertyListItemUtilites';

export const classPrefix = `${CardboardClassNamePrefix}-propertylistitemenumchild`;
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    props: IPropertyListItemEnumChildStyleProps
): IPropertyListItemEnumChildStyles => {
    const { level, theme } = props;
    const indentation = getIndentation(level, false);
    return {
        root: [
            classNames.root,
            {
                alignItems: 'center',
                marginLeft: `${indentation}px`,
                marginTop: 4
            }
        ],
        container: [
            {
                display: 'flex'
                // justifyContent: 'space-between',
                // width: '100%'
            }
        ],
        name: [
            {
                borderRight: `1px solid ${theme.palette.neutralLighter}`,
                paddingRight: 8
            }
        ],
        value: [],
        subComponentStyles: {
            icon: {
                root: {
                    border: '1px solid white',
                    borderRadius: theme.effects.roundedCorner4,
                    marginRight: 4
                }
            }
        }
    };
};
