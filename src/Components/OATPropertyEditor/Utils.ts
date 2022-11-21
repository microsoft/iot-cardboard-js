import { DTDLProperty } from '../../Models/Classes/DTDL';
import {
    DtdlInterface,
    DtdlRelationship,
    MultiLanguageSelectionType
} from '../../Models/Constants';
import {
    DTMIRegex,
    OAT_COMMENT_LENGTH_LIMIT,
    OAT_DESCRIPTION_LENGTH_LIMIT,
    OAT_DISPLAY_NAME_LENGTH_LIMIT,
    OAT_ID_LENGTH_LIMIT,
    OAT_RELATIONSHIP_HANDLE_NAME
} from '../../Models/Constants/Constants';
import { IOATSelection } from '../../Pages/OATEditorPage/OATEditorPage.types';

// Returns property collection attribute name depending on model type
export const getModelPropertyCollectionName = (type: string | string[]) => {
    if (
        type &&
        (type === OAT_RELATIONSHIP_HANDLE_NAME ||
            (Array.isArray(type) &&
                type.includes(OAT_RELATIONSHIP_HANDLE_NAME)))
    ) {
        return 'properties';
    }
    return 'contents';
};

export const getNestedPropertyCollectionName = (type: string | string[]) => {
    return type && type === 'Enum' ? 'enumValues' : 'fields';
};

export const getModelPropertyListItemName = (
    name: string | Record<string, any>
): string => {
    if (name && typeof name === 'string') {
        return name;
    } else if (name) {
        return Object.values(name)[0];
    }
    return '';
};

export const isDisplayNameDefined = (name: string | Record<string, any>) => {
    return (
        (name && typeof name === 'string' && name.length > 0) ||
        (name && Object.values(name)[0].length > 0)
    );
};

export const getDisplayName = (name: string | Record<string, any>) => {
    if (name && typeof name === 'string' && name.length > 0) {
        return name;
    }
    if (name && Object.values(name)[0].length > 0) {
        return Object.values(name)[0];
    }
    return null;
};

// Returns property's display name, depending on whether it is a string or a object of localized displayNames
export const getPropertyDisplayName = (property: DTDLProperty) => {
    return typeof property.name === 'string'
        ? property.name
        : Object.values(property.name)[0];
};

// Handles language selection change on forms (DisplayName - Key - Dropdown)
export const setMultiLanguageSelectionsDisplayNameKey = (
    value: string | number,
    index: number = null,
    multiLanguageSelectionsDisplayName: any,
    setMultiLanguageSelectionsDisplayName: React.Dispatch<
        React.SetStateAction<any>
    >
) => {
    const multiLanguageSelectionsDisplayNamesKeys = Object.keys(
        multiLanguageSelectionsDisplayName
    );
    const key = multiLanguageSelectionsDisplayNamesKeys[index]
        ? multiLanguageSelectionsDisplayNamesKeys[index]
        : value;
    const newMultiLanguageSelectionsDisplayName = {
        ...multiLanguageSelectionsDisplayName,
        [key]: multiLanguageSelectionsDisplayName[value]
            ? multiLanguageSelectionsDisplayName[value]
            : ''
    };

    setMultiLanguageSelectionsDisplayName(
        newMultiLanguageSelectionsDisplayName
    );
};

// Handles language selection change on forms (DisplayName - Value - Dropdown)
export const setMultiLanguageSelectionsDisplayNameValue = (
    value: string,
    index: number = null,
    multiLanguageSelectionsDisplayNames: any[],
    multiLanguageSelectionsDisplayName: any,
    setMultiLanguageSelectionsDisplayName: React.Dispatch<
        React.SetStateAction<any>
    >,
    setDisplayNameError: React.Dispatch<React.SetStateAction<any>>
) => {
    if (value.length <= OAT_DISPLAY_NAME_LENGTH_LIMIT) {
        const newMultiLanguageSelectionsDisplayName = {
            ...multiLanguageSelectionsDisplayName,
            [multiLanguageSelectionsDisplayNames[index].key]: value
        };

        setMultiLanguageSelectionsDisplayName(
            newMultiLanguageSelectionsDisplayName
        );
        setDisplayNameError(null);
    } else {
        setDisplayNameError(true);
    }
};

// Handles language selection change on forms (Description - Key - Dropdown)
export const setMultiLanguageSelectionsDescriptionKey = (
    value: string | number,
    index: number = null,
    multiLanguageSelectionsDescription: any,
    setMultiLanguageSelectionsDescription: React.Dispatch<
        React.SetStateAction<any>
    >
) => {
    const multiLanguageSelectionsDescriptionsKeys = Object.keys(
        multiLanguageSelectionsDescription
    );
    const key = multiLanguageSelectionsDescriptionsKeys[index]
        ? multiLanguageSelectionsDescriptionsKeys[index]
        : value;
    const newMultiLanguageSelectionsDescription = {
        ...multiLanguageSelectionsDescription,
        [key]: multiLanguageSelectionsDescription[value]
            ? multiLanguageSelectionsDescription[value]
            : ''
    };

    setMultiLanguageSelectionsDescription(
        newMultiLanguageSelectionsDescription
    );
};

// Handles language selection change on forms (Description - Value - TextField)
export const validateMultiLanguageSelectionsDescriptionValueChange = (
    value: string,
    index: number = null,
    multiLanguageSelectionsDescription: any,
    multiLanguageSelectionsDescriptions: any[],
    setMultiLanguageSelectionsDescription: React.Dispatch<
        React.SetStateAction<any>
    >,
    setDescriptionError: React.Dispatch<React.SetStateAction<any>>
) => {
    if (value.length <= OAT_DESCRIPTION_LENGTH_LIMIT) {
        const newMultiLanguageSelectionsDescription = {
            ...multiLanguageSelectionsDescription,
            [multiLanguageSelectionsDescriptions[index].key]: value
        };

        setMultiLanguageSelectionsDescription(
            newMultiLanguageSelectionsDescription
        );
        setDescriptionError(null);
    } else {
        setDescriptionError(true);
    }
};

// Handles language selection removal on forms
export const setMultiLanguageSelectionRemoval = (
    index: number,
    type: string,
    multiLanguageSelectionsDisplayName: any,
    multiLanguageSelectionsDisplayNames: any[],
    multiLanguageSelectionsDescription: any,
    multiLanguageSelectionsDescriptions: any[],
    setMultiLanguageSelectionsDisplayName: React.Dispatch<
        React.SetStateAction<any>
    >,
    setMultiLanguageSelectionsDisplayNames: React.Dispatch<
        React.SetStateAction<any>
    >,
    setMultiLanguageSelectionsDescription: React.Dispatch<
        React.SetStateAction<any>
    >,
    setMultiLanguageSelectionsDescriptions: React.Dispatch<
        React.SetStateAction<any>
    >
) => {
    if (type === MultiLanguageSelectionType.displayName) {
        const newMultiLanguageSelectionsDisplayName = multiLanguageSelectionsDisplayName;
        delete newMultiLanguageSelectionsDisplayName[
            multiLanguageSelectionsDisplayNames[index].key
        ];
        setMultiLanguageSelectionsDisplayName(
            newMultiLanguageSelectionsDisplayName
        );

        const newMultiLanguageSelectionsDisplayNames = [
            ...multiLanguageSelectionsDisplayNames
        ];
        newMultiLanguageSelectionsDisplayNames.splice(index, 1);

        setMultiLanguageSelectionsDisplayNames(
            newMultiLanguageSelectionsDisplayNames
        );
    } else {
        const newMultiLanguageSelectionsDescription = multiLanguageSelectionsDescription;
        delete newMultiLanguageSelectionsDescription[
            multiLanguageSelectionsDescriptions[index].key
        ];
        setMultiLanguageSelectionsDescription(
            newMultiLanguageSelectionsDescription
        );

        const newMultiLanguageSelectionsDescriptions = [
            ...multiLanguageSelectionsDescriptions
        ];
        newMultiLanguageSelectionsDescriptions.splice(index, 1);

        setMultiLanguageSelectionsDescriptions(
            newMultiLanguageSelectionsDescriptions
        );
    }
};

// Detects if mouse is below the trigger element
export const shouldClosePropertySelectorOnMouseLeave = (e, boundingBox) =>
    boundingBox && e.clientY >= boundingBox.bottom;

// Handle display name change on forms
export const validateDisplayNameChange = (
    value,
    setDisplayName,
    setDisplayNameError
) => {
    if (value.length <= OAT_DISPLAY_NAME_LENGTH_LIMIT) {
        setDisplayName(value);
        setDisplayNameError(null);
    } else {
        setDisplayNameError(true);
    }
};
export const isValidDisplayName = (value: string) => {
    return value.length <= OAT_DISPLAY_NAME_LENGTH_LIMIT;
};
export const isValidDescription = (value: string) => {
    return value.length <= OAT_DESCRIPTION_LENGTH_LIMIT;
};

// Handle description change on forms
export const validateDescriptionChange = (
    value,
    setDescription,
    setDescriptionError
) => {
    if (value.length <= OAT_DESCRIPTION_LENGTH_LIMIT) {
        setDescription(value);
        setDescriptionError(null);
    } else {
        setDescriptionError(true);
    }
};

// Handle comment change on forms
export const validateCommentChange = (value, setComment, setCommentError) => {
    if (value.length <= OAT_COMMENT_LENGTH_LIMIT) {
        setComment(value);
        setCommentError(null);
    } else {
        setCommentError(true);
    }
};
export const isValidComment = (value: string) => {
    return value.length <= OAT_COMMENT_LENGTH_LIMIT;
};

// Handle id change on forms
export const validateIdChange = (
    value,
    setId,
    setIdErrorLength,
    setIdValidDTMIError,
    setIdWarning?
) => {
    if (value.length <= OAT_ID_LENGTH_LIMIT) {
        setIdErrorLength(null);
        if (DTMIRegex.test(value)) {
            setIdValidDTMIError(null);
            setId(value);
        } else {
            setIdValidDTMIError(true);
        }
    } else {
        setIdErrorLength(true);
    }
    if (setIdWarning) {
        setIdWarning(value.length > 0);
    }
    if (value.length === 0) {
        setIdValidDTMIError(false);
        setIdErrorLength(false);
    }
};

// TODO: move onto the context so we don't have to do this in every component
export const getTargetFromSelection = (
    models: DtdlInterface[],
    selection: IOATSelection
) => {
    // console.log('***Getting target from models', models, selection);
    const model = models.find((m) => m['@id'] === selection.modelId);
    if (!selection.contentId) {
        return model;
    }

    return model.contents.find((c) => c.name === selection.contentId);
};

export const replaceTargetFromSelection = (
    models: DtdlInterface[],
    selection: IOATSelection,
    newModel: DtdlInterface | DtdlRelationship
) => {
    const modelIndex = models.findIndex((m) => m['@id'] === selection.modelId);
    if (modelIndex >= 0) {
        if (!selection.contentId) {
            models[modelIndex] = newModel as DtdlInterface;
            return;
        }

        const contentIndex = models[modelIndex].contents.findIndex(
            (c) => c.name === selection.contentId
        );
        if (contentIndex >= 0) {
            models[modelIndex].contents[
                contentIndex
            ] = newModel as DtdlRelationship;
        }
    }
};
