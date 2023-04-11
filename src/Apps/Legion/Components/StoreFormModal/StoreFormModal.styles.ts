import {
    IStoreFormModalStyleProps,
    IStoreFormModalStyles
} from './StoreFormModal.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-StoreFormModal`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const StoreFormModal_CLASS_NAMES = classNames;
export const getStyles = (
    _props: IStoreFormModalStyleProps
): IStoreFormModalStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {
            modal: {
                subComponentStyles: {
                    modal: {
                        main: {
                            maxWidth: 500,
                            height: 300
                        }
                    }
                },
                content: {
                    overflowX: 'hidden'
                }
            }
        }
    };
};
