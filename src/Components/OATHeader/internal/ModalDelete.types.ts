import { ITheme, IStyleFunctionOrObject } from '@fluentui/react';
import { ISharedModalStyleProps, ISharedModalStyles } from './Shared.types';

export type IModalDeleteProps = {
    resetProject?: () => void;
    onClose?: () => void;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IModalDeleteStyleProps, IModalDeleteStyles>;
};

export interface IModalDeleteStyleProps extends ISharedModalStyleProps {
    theme: ITheme;
}

export interface IModalDeleteStyles extends ISharedModalStyles {
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IModalDeleteSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IModalDeleteSubComponentStyles {}
