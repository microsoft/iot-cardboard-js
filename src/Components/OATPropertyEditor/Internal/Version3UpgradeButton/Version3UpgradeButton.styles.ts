import {
    IVersion3UpgradeButtonStyleProps,
    IVersion3UpgradeButtonStyles
} from './Version3UpgradeButton.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-version3upgradebutton`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const VERSION3UPGRADEBUTTON_CLASS_NAMES = classNames;
export const getStyles = (
    props: IVersion3UpgradeButtonStyleProps
): IVersion3UpgradeButtonStyles => {
    const { theme } = props;
    return {
        root: [classNames.root],
        subComponentStyles: {
            button: {
                root: {
                    height: 32,
                    width: 'fit-content',
                    borderRadius: theme.effects.roundedCorner4,
                    backgroundColor: theme.palette.neutralLighter
                }
            }
        }
    };
};
