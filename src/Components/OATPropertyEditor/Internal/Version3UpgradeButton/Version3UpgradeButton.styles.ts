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
    _props: IVersion3UpgradeButtonStyleProps
): IVersion3UpgradeButtonStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
