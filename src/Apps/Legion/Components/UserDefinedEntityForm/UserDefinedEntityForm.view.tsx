import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    classNamesFunction,
    Dropdown,
    IDropdownOption,
    Stack,
    styled,
    TextField
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import {
    getDebugLogger,
    sortAscendingOrDescending
} from '../../../../Models/Services/Utils';
import {
    IUserDefinedEntityFormStyleProps,
    IUserDefinedEntityFormStyles,
    IUserDefinedEntityFormViewProps
} from './UserDefinedEntityForm.types';
import CardboardComboBox from '../CardboardComboBox';
import { getViewStyles } from './UserDefinedEntityForm.styles';
import IconPicker from '../../../../Components/Pickers/IconSelectButton/IconPicker';
import ColorPicker from '../../../../Components/Pickers/ColorSelectButton/ColorPicker';
import {
    WIZARD_GRAPH_NODE_COLOR_OPTIONS,
    WIZARD_GRAPH_NODE_ICON_OPTIONS
} from '../../Models/Constants';
import {
    IViewEntity,
    IViewRelationshipType,
    IViewType,
    Kind
} from '../../Models';
import { IReactSelectOption } from '../../Models/Types';
import {
    getNewViewRelationshipType,
    getNewViewType
} from '../../Services/WizardTypes.utils';

const debugLogging = false;
const logDebugConsole = getDebugLogger(
    'UserDefinedEntityFormView',
    debugLogging
);

const getClassNames = classNamesFunction<
    IUserDefinedEntityFormStyleProps,
    IUserDefinedEntityFormStyles
>();

const LOC_KEYS = {
    nameFieldLabel: 'legionApp.UserDefinedEntityForm.Form.nameFieldLabel',
    nameFieldPlaceholder:
        'legionApp.UserDefinedEntityForm.Form.nameFieldPlaceholder',
    parentTypeFieldLabel:
        'legionApp.UserDefinedEntityForm.Form.parentTypeFieldLabel',
    parentTypeFieldPlaceholder:
        'legionApp.UserDefinedEntityForm.Form.parentTypeFieldPlaceholder',
    colorFieldLabel: 'legionApp.UserDefinedEntityForm.Form.colorFieldLabel',
    iconFieldLabel: 'legionApp.UserDefinedEntityForm.Form.iconFieldLabel',
    parentEntityFieldLabel:
        'legionApp.UserDefinedEntityForm.Form.parentEntityFieldLabel',
    parentEntityNameFieldLabel:
        'legionApp.UserDefinedEntityForm.Form.parentEntityNameFieldLabel',
    parentEntityNameFieldPlaceholder:
        'legionApp.UserDefinedEntityForm.Form.parentEntityNameFieldPlaceholder',
    relationshipNameFieldLabel:
        'legionApp.UserDefinedEntityForm.Form.relationshipNameFieldLabel',
    relationshipNameFieldPlaceholder:
        'legionApp.UserDefinedEntityForm.Form.relationshipNameFieldPlaceholder',
    existingEntityFieldPlaceholder:
        'legionApp.UserDefinedEntityForm.Form.existingEntityFieldPlaceholder'
};

const getParentTypeOptions = (types: IViewType[]): IReactSelectOption[] => {
    return (
        types
            ?.map((x) => ({
                value: x.id,
                label: `${x.friendlyName} (${x.kind})`,
                __isNew__: false
            }))
            .sort(sortAscendingOrDescending('label')) ?? []
    );
};

const getExistingEntityOptions = (
    entities: IViewEntity[]
): IDropdownOption<IViewEntity>[] => {
    return (
        entities
            ?.map((x) => ({
                key: x.id,
                text: `${x.friendlyName} (${x.type.kind})`,
                data: x
            }))
            .sort(sortAscendingOrDescending('text')) ?? []
    );
};

const getExistingRelationshipOptions = (
    relationships: IViewRelationshipType[]
): IReactSelectOption[] => {
    return (
        relationships
            ?.map((x) => ({
                value: x.id,
                label: x.name,
                __isNew__: false
            }))
            .sort(sortAscendingOrDescending('label')) ?? []
    );
};

const UserDefinedEntityFormView: React.FC<IUserDefinedEntityFormViewProps> = (
    props
) => {
    const {
        existingEntities,
        existingRelationshipTypes,
        existingTypes,
        formMode,
        onFormChange,
        styles
    } = props;

    // state
    // SHARED STATE
    const [relationshipNameOptions, setRelationshipNameOptions] = useState<
        IReactSelectOption[]
    >(getExistingRelationshipOptions(existingRelationshipTypes));

    // NEW ENTITY STATE
    const [
        selectedParentType,
        setSelectedParentType
    ] = useState<IReactSelectOption | null>(null);
    const [parentTypeOptions, setParentTypeOptions] = useState<
        IReactSelectOption[]
    >(getParentTypeOptions(existingTypes));
    const [isNewParentType, setIsNewParent] = useState<boolean>(false);

    const colorOptions = WIZARD_GRAPH_NODE_COLOR_OPTIONS;
    const iconOptions = WIZARD_GRAPH_NODE_ICON_OPTIONS;
    const [selectedColor, setSelectedColor] = useState<string>(
        colorOptions[0].id
    );
    const [selectedIcon, setSelectedIcon] = useState<string>(iconOptions[0].id);
    const [parentEntityNameValue, setParentEntityNameValue] = useState<string>(
        ''
    );
    const [
        newEntityRelationshipNameValue,
        setNewEntityRelationshipNameValue
    ] = useState<IReactSelectOption>(null);

    // EXISTING ENTITY STATE
    const [
        selectedExistingEntity,
        setSelectedExistingEntity
    ] = useState<IDropdownOption<IViewEntity> | null>(null);
    const [existingEntityOptions, setExistingEntityOptions] = useState<
        IDropdownOption<IViewEntity>[]
    >([]);
    const [
        existingEntityRelationshipNameValue,
        setExistingEntityRelationshipNameValue
    ] = useState<IReactSelectOption>(null);

    // hooks
    const { t } = useTranslation();

    // callbacks
    const onExistingEntityRelationshipChange = useCallback(
        (newValue: IReactSelectOption, _isNew: boolean) => {
            setExistingEntityRelationshipNameValue(newValue);
        },
        []
    );
    const onNewEntityRelationshipChange = useCallback(
        (newValue: IReactSelectOption, _isNew: boolean) => {
            setNewEntityRelationshipNameValue(newValue);
        },
        []
    );
    const onParentTypeChange = useCallback(
        (newValue: IReactSelectOption, isNew: boolean) => {
            setSelectedParentType(newValue);
            setIsNewParent(isNew);
            if (isNew) {
                const selectedType = existingTypes.find(
                    (x) => x.id === newValue.value
                );
                if (selectedType) {
                    setSelectedColor(selectedType.color);
                    setSelectedIcon(selectedType.icon);
                } else {
                    logDebugConsole(
                        'warn',
                        `Could not find a type with id (${newValue.value}). Color and Icon not set`
                    );
                }
            }
        },
        [existingTypes]
    );

    // side effects
    useEffect(() => {
        setParentTypeOptions(getParentTypeOptions(existingTypes));
    }, [existingTypes]);
    useEffect(() => {
        setExistingEntityOptions(getExistingEntityOptions(existingEntities));
    }, [existingEntities]);
    useEffect(() => {
        setRelationshipNameOptions(
            getExistingRelationshipOptions(existingRelationshipTypes)
        );
    }, [existingRelationshipTypes]);

    // notify parent when changes are made whether form is valid
    useEffect(() => {
        if (formMode === 'New') {
            const parentType = selectedParentType?.value;
            const relationshipType =
                existingRelationshipTypes.find(
                    (x) => x.id === newEntityRelationshipNameValue?.value
                ) ??
                getNewViewRelationshipType({
                    name: newEntityRelationshipNameValue?.label
                });
            const isValid =
                !!parentType &&
                !!parentEntityNameValue &&
                !!relationshipType?.name &&
                !!selectedColor &&
                !!selectedIcon;

            onFormChange({
                isValid: isValid,
                data: {
                    type: 'New',
                    parentName: parentEntityNameValue,
                    parentType: getNewViewType({
                        color: selectedColor,
                        friendlyName: parentType,
                        icon: selectedIcon,
                        kind: Kind.UserDefined
                    }),
                    relationshipType: relationshipType
                }
            });
        }
    }, [
        existingRelationshipTypes,
        formMode,
        newEntityRelationshipNameValue?.label,
        newEntityRelationshipNameValue?.value,
        onFormChange,
        parentEntityNameValue,
        selectedColor,
        selectedIcon,
        selectedParentType
    ]);
    useEffect(() => {
        if (formMode === 'Existing') {
            // TODO: make validation more precise??
            const selectedEntityData = selectedExistingEntity?.data;
            const relationshipType =
                existingRelationshipTypes.find(
                    (x) => x.id === existingEntityRelationshipNameValue?.value
                ) ??
                getNewViewRelationshipType({
                    name: existingEntityRelationshipNameValue?.label
                });
            const isValid = !!selectedEntityData && !!relationshipType.name;

            onFormChange({
                isValid: isValid,
                data: {
                    type: 'Existing',
                    parentId: selectedEntityData?.id,
                    relationshipType: relationshipType
                }
            });
        }
    }, [
        existingEntityRelationshipNameValue?.label,
        existingEntityRelationshipNameValue?.value,
        existingRelationshipTypes,
        existingTypes,
        formMode,
        onFormChange,
        selectedExistingEntity
    ]);

    // styles
    const theme = useExtendedTheme();
    const classNames = getClassNames(styles, {
        theme: theme
    });

    // data
    // RENDER NEW ENTITY FORM
    const newEntityForm = useMemo(() => {
        return (
            <>
                <TextField
                    label={t(LOC_KEYS.parentEntityNameFieldLabel)}
                    onChange={(_ev, value) => {
                        setParentEntityNameValue(value);
                    }}
                    placeholder={t(LOC_KEYS.parentEntityNameFieldPlaceholder)}
                    required
                    value={parentEntityNameValue}
                />
                <CardboardComboBox
                    label={t(LOC_KEYS.parentTypeFieldLabel)}
                    onSelectionChange={onParentTypeChange}
                    options={parentTypeOptions}
                    placeholder={t(LOC_KEYS.parentTypeFieldPlaceholder)}
                    selectedItem={selectedParentType}
                />
                {isNewParentType && (
                    <Stack horizontal tokens={{ childrenGap: 8 }}>
                        <IconPicker
                            label={t(LOC_KEYS.iconFieldLabel)}
                            selectedItem={selectedIcon}
                            items={iconOptions}
                            onChangeItem={(item) => {
                                setSelectedIcon(item.id);
                            }}
                        />
                        <ColorPicker
                            label={t(LOC_KEYS.colorFieldLabel)}
                            selectedItem={selectedColor}
                            items={colorOptions}
                            onChangeItem={(item) => {
                                setSelectedColor(item.id);
                            }}
                        />
                    </Stack>
                )}

                <CardboardComboBox
                    label={t(LOC_KEYS.relationshipNameFieldLabel)}
                    onSelectionChange={onNewEntityRelationshipChange}
                    options={relationshipNameOptions}
                    placeholder={t(LOC_KEYS.relationshipNameFieldPlaceholder)}
                    selectedItem={newEntityRelationshipNameValue}
                />
            </>
        );
    }, [
        colorOptions,
        iconOptions,
        isNewParentType,
        newEntityRelationshipNameValue,
        onNewEntityRelationshipChange,
        onParentTypeChange,
        parentEntityNameValue,
        parentTypeOptions,
        relationshipNameOptions,
        selectedColor,
        selectedIcon,
        selectedParentType,
        t
    ]);

    // RENDER EXISTING ENTITY FORM
    const existingForm = useMemo(() => {
        return (
            <>
                <Dropdown
                    label={t(LOC_KEYS.parentEntityFieldLabel)}
                    options={existingEntityOptions}
                    onChange={(_ev, option) => {
                        setSelectedExistingEntity(option);
                    }}
                    placeholder={t(LOC_KEYS.existingEntityFieldPlaceholder)}
                    required
                    selectedKey={selectedExistingEntity?.key}
                />
                <CardboardComboBox
                    label={t(LOC_KEYS.relationshipNameFieldLabel)}
                    onSelectionChange={onExistingEntityRelationshipChange}
                    options={relationshipNameOptions}
                    placeholder={t(LOC_KEYS.relationshipNameFieldPlaceholder)}
                    selectedItem={existingEntityRelationshipNameValue}
                />
            </>
        );
    }, [
        existingEntityOptions,
        existingEntityRelationshipNameValue,
        onExistingEntityRelationshipChange,
        relationshipNameOptions,
        selectedExistingEntity?.key,
        t
    ]);

    logDebugConsole('debug', 'Render', parentTypeOptions, selectedParentType);

    return (
        <Stack className={classNames.root} tokens={{ childrenGap: 8 }}>
            {formMode === 'New' ? newEntityForm : existingForm}
        </Stack>
    );
};

export default styled<
    IUserDefinedEntityFormViewProps,
    IUserDefinedEntityFormStyleProps,
    IUserDefinedEntityFormStyles
>(UserDefinedEntityFormView, getViewStyles);
