import { ITheme, IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';

export type IModalDeleteProps = {
    resetProject?: () => void;
    onClose?: () => void;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    state?: IOATEditorState;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IModalDeleteStyleProps, IModalDeleteStyles>;
};

export interface IModalDeleteStyleProps {
    theme: ITheme;
}

export interface IModalDeleteStyles {
    modalRow: IStyle;
    modalRowFlexEnd: IStyle;
    modalRowCenterItem: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IModalDeleteSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IModalDeleteSubComponentStyles {}
