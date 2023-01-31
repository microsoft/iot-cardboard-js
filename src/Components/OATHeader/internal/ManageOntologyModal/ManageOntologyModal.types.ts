import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { ICardboardModalStyles } from '../../../CardboardModal/CardboardModal.types';

export enum FormMode {
    Create = 'Create',
    Edit = 'Edit'
}

export interface IManageOntologyModalProps {
    isOpen: boolean;
    onClose: () => void;
    ontologyId: string | undefined;

    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IManageOntologyModalStyleProps,
        IManageOntologyModalStyles
    >;
}

export interface IManageOntologyModalStyleProps {
    theme: ITheme;
}
export interface IManageOntologyModalStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IManageOntologyModalSubComponentStyles;
}

export interface IManageOntologyModalSubComponentStyles {
    modal?: Partial<ICardboardModalStyles>;
}
