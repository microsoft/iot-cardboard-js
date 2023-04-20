import {
    IChoiceGroupStyles,
    IStyle,
    IStyleFunctionOrObject
} from '@fluentui/react';
import { ICardboardModalStyles } from '../../../../Components/CardboardModal/CardboardModal.types';
import { IExtendedTheme } from '../../../../Theming/Theme.types';
import { IViewEntity, IViewRelationshipType, IViewType } from '../../Models';

export type IFormData =
    | {
          type: 'Existing';
          parentEntity: IViewEntity;
          relationshipType: IViewRelationshipType;
      }
    | {
          type: 'New';
          parentEntity: IViewEntity;
          relationshipType: IViewRelationshipType;
      };

export type IFormMode = 'New' | 'Existing';

// #region Data aware form types
export interface IUserDefinedEntityFormProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IUserDefinedEntityFormStyleProps,
        IUserDefinedEntityFormStyles
    >;
}

export interface IUserDefinedEntityFormStyleProps {
    theme: IExtendedTheme;
}
export interface IUserDefinedEntityFormStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IUserDefinedEntityFormSubComponentStyles;
}

export interface IUserDefinedEntityFormSubComponentStyles {
    modal?: Partial<ICardboardModalStyles>;
    choiceGroup?: IChoiceGroupStyles;
}

// #endregion

// #region View interfaces

export interface IFormChangeArgs {
    isValid: boolean;
    data: IFormData;
}
export interface IUserDefinedEntityFormViewProps {
    formMode: IFormMode;
    existingTypes: IViewType[];
    existingEntities: IViewEntity[];
    existingRelationshipTypes: IViewRelationshipType[];
    onFormChange: (formData: IFormChangeArgs) => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IUserDefinedEntityFormViewStyleProps,
        IUserDefinedEntityFormViewStyles
    >;
}

export interface IUserDefinedEntityFormViewStyleProps {
    theme: IExtendedTheme;
}
export interface IUserDefinedEntityFormViewStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IUserDefinedEntityFormViewSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserDefinedEntityFormViewSubComponentStyles {}

// #endregion
