import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
    Stack,
    Label,
    Text,
    IconButton,
    Separator,
    TextField,
    classNamesFunction,
    styled,
    SpinButton
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getPropertyEditorTextFieldStyles } from '../OATPropertyEditor.styles';
import { FormBody } from '../Shared/Constants';
import OATTextFieldDisplayName from '../../../Pages/OATEditorPage/Internal/Components/OATTextFieldDisplayName';
import { deepCopy, getDebugLogger } from '../../../Models/Services/Utils';

import {
    SET_OAT_PROPERTY_MODAL_BODY,
    SET_OAT_PROPERTY_MODAL_OPEN
} from '../../../Models/Constants/ActionTypes';
import { CommandHistoryContext } from '../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { getModelPropertyListItemName, getTargetFromSelection } from '../Utils';
import {
    IPropertiesModelSummaryProps,
    IPropertiesModelSummaryStyleProps,
    IPropertiesModelSummaryStyles
} from './PropertiesModelSummary.types';
import { OAT_INTERFACE_TYPE } from '../../../Models/Constants/Constants';
import {
    buildModelId,
    parseModelId,
    updateModelId
} from '../../../Models/Services/OatUtils';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';
import { getStyles } from './PropertiesModelSummary.styles';
import { useExtendedTheme } from '../../../Models/Hooks/useExtendedTheme';

const debugLogging = true;
const logDebugConsole = getDebugLogger('PropertiesModelSummary', debugLogging);

const getClassNames = classNamesFunction<
    IPropertiesModelSummaryStyleProps,
    IPropertiesModelSummaryStyles
>();

export const PropertiesModelSummary: React.FC<IPropertiesModelSummaryProps> = (
    props
) => {
    const { dispatch, isSupportedModelType, selectedItem, styles } = props;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // data
    const parsedId = parseModelId(selectedItem['@id']);
    const [itemUniqueName, setItemDisplayName] = useState(parsedId.name);
    const [itemPath, setItemPath] = useState(parsedId.path);
    const [itemVersion, setItemVersion] = useState(parsedId.version);

    const [id, setItemId] = useState(
        selectedItem && selectedItem['@id'] ? selectedItem['@id'] : ''
    );
    const [displayNameEditor, setDisplayNameEditor] = useState(false);

    const onIdCommit = useCallback(
        (value: string) => {
            const commit = () => {
                const {
                    models: modelsCopy,
                    positions: modelPositionsCopy
                } = updateModelId(
                    id,
                    value,
                    oatPageState.currentOntologyModels,
                    oatPageState.currentOntologyModelPositions
                );

                oatPageDispatch({
                    type: OatPageContextActionType.SET_CURRENT_MODELS_POSITIONS,
                    payload: { positions: modelPositionsCopy }
                });
                oatPageDispatch({
                    type: OatPageContextActionType.SET_CURRENT_MODELS,
                    payload: { models: modelsCopy }
                });
                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                    payload: {
                        selection:
                            oatPageState.selection &&
                            oatPageState.selection.contentId
                                ? deepCopy(oatPageState.selection)
                                : { modelId: value }
                    }
                });
            };

            const undoCommit = () => {
                oatPageDispatch({
                    type: OatPageContextActionType.SET_CURRENT_MODELS_POSITIONS,
                    payload: {
                        positions: oatPageState.currentOntologyModelPositions
                    }
                });
                oatPageDispatch({
                    type: OatPageContextActionType.SET_CURRENT_MODELS,
                    payload: { models: oatPageState.currentOntologyModels }
                });
                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                    payload: { selection: oatPageState.selection }
                });
            };

            execute(commit, undoCommit);
        },
        [
            execute,
            id,
            oatPageDispatch,
            oatPageState.currentOntologyModelPositions,
            oatPageState.currentOntologyModels,
            oatPageState.selection
        ]
    );

    const onDisplayNameChange = useCallback(
        (value: string) => {
            const commit = () => {
                const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
                const itemReference = getTargetFromSelection(
                    modelsCopy,
                    oatPageState.selection
                );
                if (itemReference) {
                    itemReference.displayName = value;
                    oatPageDispatch({
                        type: OatPageContextActionType.SET_CURRENT_MODELS,
                        payload: { models: modelsCopy }
                    });
                } else {
                    logDebugConsole(
                        'warn',
                        'Could not find the model to update {selection, models}',
                        oatPageState.selection,
                        modelsCopy
                    );
                }
                setItemDisplayName(value);
                setDisplayNameEditor(false);
            };

            const undoCommit = () => {
                oatPageDispatch({
                    type: OatPageContextActionType.SET_CURRENT_MODELS,
                    payload: { models: oatPageState.currentOntologyModels }
                });
            };

            execute(commit, undoCommit);
        },
        [
            execute,
            oatPageDispatch,
            oatPageState.currentOntologyModels,
            oatPageState.selection
        ]
    );

    const onInfoButtonClick = () => {
        dispatch({
            type: SET_OAT_PROPERTY_MODAL_BODY,
            payload: FormBody.rootModel
        });
        dispatch({
            type: SET_OAT_PROPERTY_MODAL_OPEN,
            payload: true
        });
    };

    // side effects
    useEffect(() => {
        setItemDisplayName(
            selectedItem && selectedItem.displayName
                ? getModelPropertyListItemName(selectedItem.displayName)
                : ''
        );
        setItemId(
            selectedItem && selectedItem['@id'] ? selectedItem['@id'] : ''
        );
    }, [selectedItem]);

    useEffect(() => {
        const id = buildModelId(
            parsedId.namespace,
            itemUniqueName,
            Number(itemVersion)
        );
        setItemId(id);
    }, [itemUniqueName, itemVersion, onIdCommit, parsedId.namespace]);

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });
    const textFieldStyles = getPropertyEditorTextFieldStyles();

    return (
        <Stack styles={classNames.subComponentStyles.rootStack}>
            {/* HEADER */}
            <div className={classNames.sectionHeaderContainer}>
                <h3>{`${t('OATPropertyEditor.general')}`}</h3>
                {selectedItem &&
                    selectedItem['@type'] === OAT_INTERFACE_TYPE && (
                        <IconButton
                            iconProps={{ iconName: 'info' }}
                            onClick={onInfoButtonClick}
                            styles={classNames.subComponentStyles.modalIconButton?.()}
                            title={t('OATPropertyEditor.info')}
                        />
                    )}
            </div>

            {/* TYPE SECTION */}
            <div className={classNames.row}>
                <Label id={'oat-property-type'} className={classNames.rowLabel}>
                    {t('type')}
                </Label>
                <TextField
                    aria-labelledby={'oat-property-type'}
                    disabled
                    styles={classNames.subComponentStyles.stringField}
                    value={selectedItem ? selectedItem['@type'].toString() : ''}
                />
            </div>
            <Separator styles={classNames.subComponentStyles.separator} />

            {/* ID SECTION */}
            <div className={classNames.row}>
                <Label id={'oat-item-id'} className={classNames.rowLabel}>
                    {t('OATPropertyEditor.modelId')}
                </Label>
                <TextField
                    aria-labelledby={'oat-item-id'}
                    disabled
                    styles={classNames.subComponentStyles.stringField}
                    value={id}
                />
            </div>
            <div className={classNames.row}>
                <Text id={'oat-property-type'} className={classNames.rowLabel}>
                    {t('OATPropertyEditor.uniqueModelName')}
                </Text>
                <TextField
                    aria-labelledby={'oat-property-type'}
                    onChange={(_ev, value) => onDisplayNameChange(value)}
                    styles={classNames.subComponentStyles.stringField}
                    value={itemUniqueName}
                />
            </div>
            <div className={classNames.row}>
                <Text id={'oat-property-path'} className={classNames.rowLabel}>
                    {t('OATPropertyEditor.path')}
                </Text>
                <TextField
                    aria-labelledby={'oat-property-path'}
                    styles={classNames.subComponentStyles.stringField}
                    onChange={(_ev, value) => setItemPath(value)}
                    value={itemPath}
                />
            </div>
            <div className={classNames.row}>
                <Text
                    id={'oat-property-version'}
                    className={classNames.rowLabel}
                >
                    {t('OATPropertyEditor.version')}
                </Text>
                <SpinButton
                    aria-labelledby={'oat-property-version'}
                    styles={classNames.subComponentStyles.numericField}
                    onChange={(_ev, value) => setItemVersion(value)}
                    value={itemVersion}
                />
            </div>
            <Separator styles={classNames.subComponentStyles.separator} />

            {/* 
d
d
d
d
d
*/}
            {/* <div className={classNames.row}>
                <Text>{t('id')}</Text>
                {!idEditor && selectedItem && (
                    <Text onDoubleClick={() => setIdEditor(true)}>{id}</Text>
                )}
                {idEditor && selectedItem && (
                    <OATTextFieldId
                        placeholder={t('id')}
                        styles={textFieldStyles}
                        disabled={!selectedItem}
                        value={isSupportedModelType && id}
                        model={selectedItem}
                        models={oatPageState.currentOntologyModels}
                        onCommit={onIdCommit}
                        borderless
                        autoFocus
                    />
                )}
            </div> */}
            {isSupportedModelType && (
                <div className={classNames.row}>
                    <Text>{t('OATPropertyEditor.displayName')}</Text>
                    {!displayNameEditor && selectedItem && (
                        <Text onDoubleClick={() => setDisplayNameEditor(true)}>
                            {itemUniqueName !== ''
                                ? itemUniqueName
                                : t('OATPropertyEditor.displayName')}
                        </Text>
                    )}
                    {displayNameEditor && selectedItem && (
                        <OATTextFieldDisplayName
                            styles={textFieldStyles}
                            borderless
                            placeholder={t('OATPropertyEditor.displayName')}
                            disabled={!selectedItem}
                            value={isSupportedModelType && itemUniqueName}
                            onCommit={onDisplayNameChange}
                            model={selectedItem}
                            autoFocus
                        />
                    )}
                </div>
            )}
        </Stack>
    );
};

export default styled<
    IPropertiesModelSummaryProps,
    IPropertiesModelSummaryStyleProps,
    IPropertiesModelSummaryStyles
>(PropertiesModelSummary, getStyles);
