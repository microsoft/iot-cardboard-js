import {
    IDataHistoryExplorerModalControlStyleProps,
    IDataHistoryExplorerModalControlStyles
} from './DataHistoryExplorerModalControl.types';
import { CardboardClassNamePrefix } from '../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-datahistoryexplorermodalcontrol`;
const classNames = {
    root: `${classPrefix}-root`
};

export const getStyles = (
    _props: IDataHistoryExplorerModalControlStyleProps
): IDataHistoryExplorerModalControlStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {
            iconButton: {
                rootDisabled: {
                    background: 'transparent'
                }
            }
        }
    };
};
