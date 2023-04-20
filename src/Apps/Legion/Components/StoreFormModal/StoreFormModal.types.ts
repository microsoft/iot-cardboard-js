import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { ICardboardModalStyles } from '../../../../Components/CardboardModal/CardboardModal.types';
import { IExtendedTheme } from '../../../../Theming/Theme.types';
import { ITargetDatabaseConnection } from '../../Contexts/AppDataContext/AppDataContext.types';

export interface IStoreFormModalProps {
    isOpen: boolean;
    onConfirm: (args: { targetDatabase: ITargetDatabaseConnection }) => void;
    onDismiss: () => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IStoreFormModalStyleProps,
        IStoreFormModalStyles
    >;
}

export interface IStoreFormModalStyleProps {
    theme: IExtendedTheme;
}
export interface IStoreFormModalStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IStoreFormModalSubComponentStyles;
}

export interface IStoreFormModalSubComponentStyles {
    modal?: Partial<ICardboardModalStyles>;
}
