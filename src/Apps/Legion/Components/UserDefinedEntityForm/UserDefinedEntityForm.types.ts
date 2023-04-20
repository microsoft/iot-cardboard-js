import {
    IChoiceGroupStyles,
    IStyle,
    IStyleFunctionOrObject
} from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';
import { IViewEntity, IViewRelationshipType, IViewType } from '../../Models';

export type IFormData =
    | {
          type: 'Existing';
          parentId: string;
          relationshipType: IViewRelationshipType;
      }
    | {
          type: 'New';
          parentName: string;
          parentType: IViewType;
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
