import { IDataPusherStyleProps, IDataPusherStyles } from './DataPusher.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-datapusher`;
const classNames = {
    root: `${classPrefix}-root`,
    informationText: `${classPrefix}-information-text`,
    tableContainer: `${classPrefix}-table-container`
};

// export const DATAPUSHER_CLASS_NAMES = classNames;
export const getStyles = (_props: IDataPusherStyleProps): IDataPusherStyles => {
    return {
        root: [classNames.root],
        informationText: [
            classNames.informationText,
            { fontSize: 12, opacity: 0.6 }
        ],
        tableContainer: [
            classNames.tableContainer,
            { overflow: 'auto', height: 300 }
        ],
        subComponentStyles: {
            stack: {
                root: {
                    width: 300
                }
            }
        }
    };
};
