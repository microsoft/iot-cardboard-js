import {
    IUserDefinedEntityFormStyleProps,
    IUserDefinedEntityFormStyles,
    IUserDefinedEntityFormViewStyleProps,
    IUserDefinedEntityFormViewStyles
} from './UserDefinedEntityForm.types';

export const getFormStyles = (
    _props: IUserDefinedEntityFormStyleProps
): IUserDefinedEntityFormStyles => {
    return {
        root: {},
        subComponentStyles: {
            choiceGroup: {
                flexContainer: {
                    display: 'flex',
                    flexDirection: 'row',
                    '.ms-ChoiceField': {
                        marginTop: 'unset'
                    },
                    '.ms-ChoiceField:not(:first-child)': {
                        marginLeft: 10
                    }
                }
            }
        }
    };
};

export const getViewStyles = (
    _props: IUserDefinedEntityFormViewStyleProps
): IUserDefinedEntityFormViewStyles => {
    return {
        root: {},
        subComponentStyles: {}
    };
};
