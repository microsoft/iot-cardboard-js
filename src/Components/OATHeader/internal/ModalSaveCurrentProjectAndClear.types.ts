import { IStyleFunctionOrObject, ITheme, IStyle } from '@fluentui/react';
import { IOATEditorState } from '../../../Pages/OATEditorPage/OATEditorPage.types';

export type IModalSaveCurrentProjectAndClearProps = {
    resetProject?: () => void;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    onClose?: () => void;
    state?: IOATEditorState;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IModalSaveCurrentProjectAndClearStyleProps,
        IModalSaveCurrentProjectAndClearStyles
    >;
};

export interface IModalSaveCurrentProjectAndClearStyleProps {
    theme: ITheme;
}

export interface IModalSaveCurrentProjectAndClearStyles {
    modalRow: IStyle;
    modalRowFlexEnd: IStyle;
    modalRowCenterItem: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IModalSaveCurrentProjectAndClearSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IModalSaveCurrentProjectAndClearSubComponentStyles {}
