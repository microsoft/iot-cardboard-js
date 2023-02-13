import React, {
    useContext,
    useState,
    useCallback,
    useEffect,
    useMemo
} from 'react';
import {
    Stack,
    Text,
    Separator,
    TextField,
    classNamesFunction,
    styled
} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { useTranslation } from 'react-i18next';
import { deepCopy, getDebugLogger } from '../../../Models/Services/Utils';

import { CommandHistoryContext } from '../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import {
    IPropertiesModelSummaryProps,
    IPropertiesModelSummaryStyleProps,
    IPropertiesModelSummaryStyles
} from './PropertiesModelSummary.types';
import { buildModelId, parseModelId } from '../../../Models/Services/OatUtils';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';
import { getStyles } from './PropertiesModelSummary.styles';
import { useExtendedTheme } from '../../../Models/Hooks/useExtendedTheme';
import {
    DTMI_VALIDATION_REGEX,
    getDtdlVersionFromContext,
    getModelOrParentContext,
    isDTDLModel,
    isDTDLReference,
    isValidDtmiId,
    isValidDtmiPath,
    isValidModelName,
    isValidModelVersion,
    isValidReferenceName
} from '../../../Models/Services/DtdlUtils';
import { getTargetFromSelection } from '../Utils';
import ModelPropertyHeader from './ModelPropertyHeader/ModelPropertyHeader';
import PropertyDetailsEditorModal from './FormRootModelDetails/PropertyDetailsEditorModal';
import { DtdlInterface, DtdlInterfaceContent } from '../../../Models/Constants';

const debugLogging = false;
const logDebugConsole = getDebugLogger('PropertiesModelSummary', debugLogging);

const getClassNames = classNamesFunction<
    IPropertiesModelSummaryStyleProps,
    IPropertiesModelSummaryStyles
>();

export const PropertiesModelSummary: React.FC<IPropertiesModelSummaryProps> = (
    props
) => {
    const { selectedItem, styles } = props;
    const isModelSelected = isDTDLModel(selectedItem);
    const isReferenceSelected = isDTDLReference(selectedItem);

    // hooks
    const { t } = useTranslation();

    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // state
    const [modelUniqueName, setModelUniqueName] = useState('');
    const [modelPath, setModelPath] = useState('');
    const [modelVersion, setModelVersion] = useState('');
    const [
        isInfoModalOpen,
        { setFalse: setIsInfoModalOpenFalse, setTrue: setIsInfoModalOpenTrue }
    ] = useBoolean(false);

    const [relationshipName, setRelationshipName] = useState('');

    // data
    const itemId = buildModelId({
        modelName: modelUniqueName,
        path: modelPath,
        version: Number(modelVersion)
    });

    const modelContext = useMemo(() => {
        return getModelOrParentContext(
            selectedItem,
            oatPageState.currentOntologyModels,
            oatPageState.selection
        );
    }, [
        oatPageState.currentOntologyModels,
        oatPageState.selection,
        selectedItem
    ]);

    // callbacks
    const initializeIdFields = useCallback(
        (selected: DtdlInterface | DtdlInterfaceContent) => {
            const parsedId = parseModelId(selected?.['@id']);
            setModelUniqueName(parsedId.name);
            setModelPath(parsedId.path);
            setModelVersion(parsedId.version);
            setRelationshipName(
                isDTDLReference(selected) ? selected?.name : ''
            );
        },
        []
    );
    const commitModelIdChange = useCallback(
        (newId: string) => {
            if (newId === selectedItem?.['@id']) {
                logDebugConsole(
                    'warn',
                    'Aborting model id update, values are the same'
                );
                return;
            }
            if (!isValidDtmiId(newId)) {
                console.error(
                    `DTMI (${newId}) is invalid. The id must conform to the format `,
                    DTMI_VALIDATION_REGEX
                );
                initializeIdFields(selectedItem);
                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_ERROR,
                    payload: {
                        title: t(
                            'OATErrors.Validations.InvalidDtmiIdFormatTitle'
                        ),
                        message: t(
                            'OATErrors.Validations.InvalidDtmiIdFormatMessage',
                            { dtmi: newId, regex: DTMI_VALIDATION_REGEX }
                        )
                    }
                });
                return;
            }
            const commit = () => {
                const existingId = selectedItem?.['@id'];
                logDebugConsole(
                    'debug',
                    '[START] Committing changes to id. {existingId, newId, initial models, initial positions}',
                    existingId,
                    newId
                );
                oatPageDispatch({
                    type: OatPageContextActionType.UPDATE_MODEL_ID,
                    payload: {
                        existingId: existingId,
                        newId: newId
                    }
                });
                logDebugConsole('debug', '[END] Committing changes to id.');
            };

            const undoCommit = () => {
                oatPageDispatch({
                    type: OatPageContextActionType.GENERAL_UNDO,
                    payload: {
                        models: oatPageState.currentOntologyModels,
                        positions: oatPageState.currentOntologyModelPositions,
                        selection: oatPageState.selection
                    }
                });
            };

            execute(commit, undoCommit);
        },
        [
            execute,
            initializeIdFields,
            oatPageDispatch,
            oatPageState.currentOntologyModelPositions,
            oatPageState.currentOntologyModels,
            oatPageState.selection,
            selectedItem,
            t
        ]
    );
    const commitReferenceNameChange = useCallback(
        (newValue: string) => {
            const commit = () => {
                const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
                const modelCopy = getTargetFromSelection(
                    modelsCopy,
                    oatPageState.selection
                );
                if (
                    modelCopy &&
                    isDTDLReference(modelCopy) &&
                    isValidReferenceName(newValue, modelCopy['@type'], true)
                ) {
                    modelCopy.name = newValue;
                    oatPageDispatch({
                        type: OatPageContextActionType.SET_CURRENT_MODELS,
                        payload: { models: modelsCopy }
                    });
                    logDebugConsole(
                        'debug',
                        'Committed changes to name. {newValue}',
                        newValue
                    );
                } else {
                    logDebugConsole(
                        'warn',
                        'Did NOT commit changes to name. {newValue, modelToUpdate, isValid}',
                        newValue,
                        modelCopy
                    );
                }
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
    const onChangeUniqueName = useCallback((_ev, value: string) => {
        if (isValidModelName(value.trim(), false)) {
            setModelUniqueName(value.trim());
        }
    }, []);
    const onChangePath = useCallback((_ev, value: string) => {
        if (isValidDtmiPath(value.trim(), false)) {
            setModelPath(value.trim());
        }
    }, []);
    const onChangeVersion = useCallback(
        (_ev, value: string) => {
            if (
                isValidModelVersion(
                    value.trim(),
                    getDtdlVersionFromContext(modelContext),
                    false
                )
            ) {
                setModelVersion(value.trim());
            }
        },
        [modelContext]
    );
    const onChangeRelationshipName = useCallback(
        (_ev, value: string) => {
            if (
                selectedItem &&
                isDTDLReference(selectedItem) &&
                isValidReferenceName(value.trim(), selectedItem['@type'], false)
            ) {
                setRelationshipName(value.trim());
            }
        },
        [selectedItem]
    );

    // side effects
    // when selected item changes, update all the states
    useEffect(() => {
        initializeIdFields(selectedItem);
    }, [initializeIdFields, selectedItem]);

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    logDebugConsole('debug', 'Render {item}', selectedItem);
    if (!selectedItem) {
        console.warn(
            '[PROPERTIES_MODEL_SUMMARY] No selected item provided, aborting render'
        );
        return null;
    }
    return (
        <>
            <Stack
                styles={classNames.subComponentStyles.rootStack}
                tokens={{ childrenGap: 8 }}
            >
                {/* HEADER */}
                <ModelPropertyHeader
                    entityId={itemId}
                    entityName={
                        isModelSelected
                            ? modelUniqueName
                            : isReferenceSelected
                            ? relationshipName
                            : ''
                    }
                    entityType={
                        selectedItem ? selectedItem['@type'].toString() : ''
                    }
                    onInfoButtonClick={setIsInfoModalOpenTrue}
                />

                {isReferenceSelected && (
                    <>
                        {/* NAME SECTION */}
                        <div className={classNames.row}>
                            <Text
                                id={'oat-relationship-name'}
                                className={classNames.rowLabel}
                            >
                                {t('OATPropertyEditor.name')}
                            </Text>
                            <TextField
                                aria-labelledby={'oat-relationship-name'}
                                onBlur={() =>
                                    commitReferenceNameChange(relationshipName)
                                }
                                onChange={onChangeRelationshipName}
                                styles={
                                    classNames.subComponentStyles.stringField
                                }
                                value={relationshipName}
                            />
                        </div>
                    </>
                )}

                {isModelSelected && (
                    <>
                        {/* ID SECTION */}
                        <div className={classNames.row}>
                            <Text
                                id={'oat-model-name'}
                                className={classNames.rowLabel}
                            >
                                {t('OATPropertyEditor.uniqueModelName')}
                            </Text>
                            <TextField
                                aria-labelledby={'oat-model-name'}
                                onBlur={() => commitModelIdChange(itemId)}
                                onChange={onChangeUniqueName}
                                styles={
                                    classNames.subComponentStyles.stringField
                                }
                                value={modelUniqueName}
                            />
                        </div>
                        <div className={classNames.row}>
                            <Text
                                id={'oat-model-path'}
                                className={classNames.rowLabel}
                            >
                                {t('OATPropertyEditor.path')}
                            </Text>
                            <TextField
                                aria-labelledby={'oat-model-path'}
                                onBlur={() => commitModelIdChange(itemId)}
                                onChange={onChangePath}
                                styles={
                                    classNames.subComponentStyles.stringField
                                }
                                value={modelPath}
                            />
                        </div>
                        <div className={classNames.row}>
                            <Text
                                id={'oat-model-version'}
                                className={classNames.rowLabel}
                            >
                                {t('OATPropertyEditor.version')}
                            </Text>
                            <TextField
                                aria-labelledby={'oat-model-path'}
                                onBlur={() => commitModelIdChange(itemId)}
                                onChange={onChangeVersion}
                                styles={
                                    classNames.subComponentStyles.stringField
                                }
                                value={modelVersion}
                            />
                        </div>
                    </>
                )}
            </Stack>

            <Separator styles={classNames.subComponentStyles.separator} />

            <PropertyDetailsEditorModal
                isOpen={isInfoModalOpen}
                selectedItem={selectedItem}
                onClose={setIsInfoModalOpenFalse}
                onSubmit={(data) => {
                    setIsInfoModalOpenFalse();
                    if (isDTDLModel(data)) {
                        oatPageDispatch({
                            type: OatPageContextActionType.UPDATE_MODEL,
                            payload: {
                                model: data
                            }
                        });
                    } else if (isDTDLReference(data)) {
                        oatPageDispatch({
                            type: OatPageContextActionType.UPDATE_REFERENCE,
                            payload: {
                                modelId: oatPageState.selection?.modelId,
                                reference: data
                            }
                        });
                    }
                }}
            />
        </>
    );
};

export default styled<
    IPropertiesModelSummaryProps,
    IPropertiesModelSummaryStyleProps,
    IPropertiesModelSummaryStyles
>(PropertiesModelSummary, getStyles);
