import { DTDLProperty } from '../../Models/Classes/DTDL';
import { ModelTypes, MultiLanguageSelectionType } from '../../Models/Constants';
import {
    OATCommentLengthLimit,
    OATDescriptionLengthLimit,
    OATDisplayNameLengthLimit,
    OATIdLengthLimit
} from '../../Models/Constants/Constants';

/* Returns property collection attribute name depending on model type */
export const getModelPropertyCollectionName = (type: string) => {
    if (type && type === ModelTypes.relationship) {
        return 'properties';
    }
    return 'contents';
};

export const getModelPropertyListItemName = (name) => {
    if (name && typeof name === 'string') {
        return name;
    } else if (name) {
        return Object.values(name)[0];
    }
    return '';
};

/* Returns property's display name, depending on whether it is a string or a object of localized displayNames */
export const getPropertyDisplayName = (property: DTDLProperty) => {
    return typeof property.name === 'string'
        ? property.name
        : Object.values(property.name)[0];
};

/*  Handles language selection change on forms (DisplayName - Key - Dropdown) */
export const handleMultiLanguageSelectionsDisplayNameKeyChange = (
    value: string,
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

/*  Handles language selection change on forms (DisplayName - Value - Dropdown) */
export const handleMultiLanguageSelectionsDisplayNameValueChange = (
    value: string,
    index: number = null,
    multiLanguageSelectionsDisplayNames: any[],
    multiLanguageSelectionsDisplayName: any,
    setMultiLanguageSelectionsDisplayName: React.Dispatch<
        React.SetStateAction<any>
    >,
    setDisplayNameError: React.Dispatch<React.SetStateAction<any>>
) => {
    if (value.length <= OATDisplayNameLengthLimit) {
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

/*  Handles language selection change on forms (Description - Key - Dropdown) */
export const handleMultiLanguageSelectionsDescriptionKeyChange = (
    value: string,
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

/*  Handles language selection change on forms (Description - Value - TextField) */
export const handleMultiLanguageSelectionsDescriptionValueChange = (
    value: string,
    index: number = null,
    multiLanguageSelectionsDescription: any,
    multiLanguageSelectionsDescriptions: any[],
    setMultiLanguageSelectionsDescription: React.Dispatch<
        React.SetStateAction<any>
    >,
    setDescriptionError: React.Dispatch<React.SetStateAction<any>>
) => {
    if (value.length <= OATDescriptionLengthLimit) {
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

/*  Handles language selection removal on forms */
export const handleMultiLanguageSelectionRemoval = (
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

/* Detect if mouse direction is any other than north.
    North direction: towards property selector, other directions should close property selector.
    Applied to property selector trigger element.
*/
export const shouldClosePropertySelectorOnMouseLeave = (e, boundingBox) =>
    e.clientY >= boundingBox.bottom ||
    e.clientX < boundingBox.left ||
    e.clientX > boundingBox.right;

/* Handle display name change on forms */
export const handleDisplayNameChange = (
    value,
    setDisplayName,
    setDisplayNameError
) => {
    if (value.length <= OATDisplayNameLengthLimit) {
        setDisplayName(value);
        setDisplayNameError(null);
    } else {
        setDisplayNameError(true);
    }
};

/* Handle description change on forms */
export const handleDescriptionChange = (
    value,
    setDescription,
    setDescriptionError
) => {
    if (value.length <= OATDescriptionLengthLimit) {
        setDescription(value);
        setDescriptionError(null);
    } else {
        setDescriptionError(true);
    }
};

/* Handle comment change on forms */
export const handleCommentChange = (value, setComment, setCommentError) => {
    if (value.length <= OATCommentLengthLimit) {
        setComment(value);
        setCommentError(null);
    } else {
        setCommentError(true);
    }
};

/* Handle id change on forms */
export const handleIdChange = (value, setId, setIdError) => {
    if (value.length <= OATIdLengthLimit) {
        setId(value);
        setIdError(null);
    } else {
        setIdError(true);
    }
};
