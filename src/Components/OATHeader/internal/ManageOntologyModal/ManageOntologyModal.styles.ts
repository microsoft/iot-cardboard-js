import {
    IManageOntologyModalStyleProps,
    IManageOntologyModalStyles
} from './ManageOntologyModal.types';

export const classPrefix = 'cb-manageontologymodal';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: IManageOntologyModalStyleProps
): IManageOntologyModalStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {
            modal: {
                subComponentStyles: {
                    modal: {
                        main: {
                            height: 400
                        }
                    }
                }
            }
        }
    };
};
