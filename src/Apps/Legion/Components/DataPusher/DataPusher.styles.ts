import { IDataPusherStyleProps, IDataPusherStyles } from './DataPusher.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-datapusher`;
const classNames = {
    root: `${classPrefix}-root`,
    tableContainer: `${classPrefix}-table-container`
};

// export const DATAPUSHER_CLASS_NAMES = classNames;
export const getStyles = (_props: IDataPusherStyleProps): IDataPusherStyles => {
    return {
        root: [classNames.root],
        tableContainer: [
            classNames.tableContainer,
            { overflow: 'auto', height: 300 }
        ],
        subComponentStyles: {}
    };
};
