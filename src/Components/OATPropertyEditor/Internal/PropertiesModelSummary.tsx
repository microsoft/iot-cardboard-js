import React, {
    useContext,
    useState,
    useCallback,
    useMemo,
    useEffect
} from 'react';
import {
    Stack,
    Text,
    IconButton,
    Separator,
    TextField,
    classNamesFunction,
    styled,
    SpinButton,
    Icon
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { FormBody } from '../Shared/Constants';
import { deepCopy, getDebugLogger } from '../../../Models/Services/Utils';

import {
    SET_OAT_PROPERTY_MODAL_BODY,
    SET_OAT_PROPERTY_MODAL_OPEN
} from '../../../Models/Constants/ActionTypes';
import { CommandHistoryContext } from '../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import {
    IPartialModelId,
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
    isDTDLModel,
    isDTDLRelationship
} from '../../../Models/Services/DtdlUtils';
import { getTargetFromSelection } from '../Utils';

const debugLogging = false;
const logDebugConsole = getDebugLogger('PropertiesModelSummary', debugLogging);

const INVALID_CHARACTERS: string[] = [' ', '-', '_', '.', ';', '<', '>'];

const getClassNames = classNamesFunction<
    IPropertiesModelSummaryStyleProps,
    IPropertiesModelSummaryStyles
>();

export const PropertiesModelSummary: React.FC<IPropertiesModelSummaryProps> = (
    props
) => {
    const { dispatch, selectedItem, styles } = props;
    const isModelSelected = isDTDLModel(selectedItem);
    const isRelationshipSelected = isDTDLRelationship(selectedItem);
    const parsedId = useMemo(() => parseModelId(selectedItem['@id']), [
        selectedItem
    ]);

    // hooks
    const { t } = useTranslation();

    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // state
    const [modelUniqueName, setModelUniqueName] = useState('');
    const [modelPath, setModelPath] = useState('');
    const [modelVersion, setModelVersion] = useState('');

    const [relationshipName, setRelationshipName] = useState('');

    // data
    const itemId = buildModelId({
        namespace: parsedId.namespace,
        modelName: modelUniqueName,
        path: modelPath,
        version: Number(modelVersion)
    });

    // callbacks
    const commitModelIdChange = useCallback(
        (newId: string) => {
            if (newId === selectedItem['@id']) {
                logDebugConsole(
                    'warn',
                    'Aborting model id update, values are the same'
                );
                return;
            }
            const commit = () => {
                const existingId = selectedItem['@id'];
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
            oatPageDispatch,
            oatPageState.currentOntologyModelPositions,
            oatPageState.currentOntologyModels,
            oatPageState.selection,
            selectedItem
        ]
    );
    const commitRelationshipNameChange = useCallback(
        (newValue: string) => {
            const commit = () => {
                const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
                const modelCopy = getTargetFromSelection(
                    modelsCopy,
                    oatPageState.selection
                );
                if (modelCopy && isDTDLRelationship(modelCopy)) {
                    modelCopy.name = newValue;
                    oatPageDispatch({
                        type: OatPageContextActionType.SET_CURRENT_MODELS,
                        payload: { models: modelsCopy }
                    });
                }
                logDebugConsole(
                    'debug',
                    'Committed changes to name. {newValue}',
                    newValue
                );
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
        // generally banned characters
        INVALID_CHARACTERS.forEach((x) => (value = value.replaceAll(x, '')));
        // specially banned for names
        [':'].forEach((x) => (value = value.replaceAll(x, '')));
        setModelUniqueName(value);
    }, []);
    const onChangePath = useCallback((_ev, value: string) => {
        INVALID_CHARACTERS.forEach((x) => (value = value.replaceAll(x, '')));
        setModelPath(value);
    }, []);
    const onChangeRelationshipName = useCallback((_ev, value: string) => {
        // generally banned characters
        INVALID_CHARACTERS.forEach((x) => (value = value.replaceAll(x, '')));
        // specially banned for names
        [':'].forEach((x) => (value = value.replaceAll(x, '')));
        setRelationshipName(value);
    }, []);

    // needed primarly for the version spinner since it behaves differently and you don't have to set focus
    const forceUpdateId = useCallback(
        ({ namespace, modelName, path, version }: IPartialModelId) => {
            const newId = buildModelId({
                namespace: namespace || parsedId.namespace,
                modelName: modelName || modelUniqueName,
                path: path || modelPath,
                version: Number(version || modelVersion)
            });
            commitModelIdChange(newId);
        },
        [
            commitModelIdChange,
            modelPath,
            modelUniqueName,
            modelVersion,
            parsedId.namespace
        ]
    );

    // const onDisplayNameChange = useCallback(
    //     (value: string) => {
    //         const commit = () => {
    //             const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
    //             const itemReference = getTargetFromSelection(
    //                 modelsCopy,
    //                 oatPageState.selection
    //             );
    //             if (itemReference) {
    //                 itemReference.displayName = value;
    //                 oatPageDispatch({
    //                     type: OatPageContextActionType.SET_CURRENT_MODELS,
    //                     payload: { models: modelsCopy }
    //                 });
    //             } else {
    //                 logDebugConsole(
    //                     'warn',
    //                     'Could not find the model to update {selection, models}',
    //                     oatPageState.selection,
    //                     modelsCopy
    //                 );
    //             }
    //             setItemDisplayName(value);
    //             setDisplayName(false);
    //         };

    //         const undoCommit = () => {
    //             oatPageDispatch({
    //                 type: OatPageContextActionType.SET_CURRENT_MODELS,
    //                 payload: { models: oatPageState.currentOntologyModels }
    //             });
    //         };

    //         execute(commit, undoCommit);
    //     },
    //     [
    //         execute,
    //         oatPageDispatch,
    //         oatPageState.currentOntologyModels,
    //         oatPageState.selection
    //     ]
    // );

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
    // when selected item changes, update all the states
    useEffect(() => {
        const parsedId = parseModelId(selectedItem['@id']);
        setModelUniqueName(parsedId.name);
        setModelPath(parsedId.path);
        setModelVersion(parsedId.version);
        setRelationshipName(
            isDTDLRelationship(selectedItem) ? selectedItem.name : ''
        );
    }, [selectedItem]);

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
        <Stack
            styles={classNames.subComponentStyles.rootStack}
            tokens={{ childrenGap: 8 }}
        >
            {/* HEADER */}
            <Stack horizontal className={classNames.sectionHeaderRoot}>
                {(isRelationshipSelected || isModelSelected) && (
                    <Icon
                        aria-label={
                            selectedItem ? selectedItem['@type'].toString() : ''
                        }
                        iconName={
                            isRelationshipSelected
                                ? 'Relationship'
                                : 'CubeShape'
                        }
                        className={classNames.sectionHeaderIcon}
                        title={
                            selectedItem ? selectedItem['@type'].toString() : ''
                        }
                    />
                )}
                {isRelationshipSelected && (
                    <div className={classNames.sectionHeaderContainer}>
                        <h4
                            className={classNames.sectionTitle}
                            title={relationshipName}
                        >
                            {relationshipName}
                        </h4>
                    </div>
                )}
                {isModelSelected && (
                    <>
                        <Stack
                            tokens={{ childrenGap: 4 }}
                            className={classNames.sectionHeaderContainer}
                        >
                            <h4
                                className={classNames.sectionTitle}
                                title={modelUniqueName}
                            >
                                {modelUniqueName}
                            </h4>
                            <span
                                className={classNames.sectionSubtitle}
                                title={itemId}
                            >
                                {itemId}
                            </span>
                        </Stack>
                        <IconButton
                            iconProps={{ iconName: 'info' }}
                            onClick={onInfoButtonClick}
                            styles={classNames.subComponentStyles.modalIconButton?.()}
                            title={t('OATPropertyEditor.info')}
                        />
                    </>
                )}
            </Stack>

            {isRelationshipSelected && (
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
                                commitRelationshipNameChange(relationshipName)
                            }
                            onChange={onChangeRelationshipName}
                            styles={classNames.subComponentStyles.stringField}
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
                            styles={classNames.subComponentStyles.stringField}
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
                            styles={classNames.subComponentStyles.stringField}
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
                        <SpinButton
                            aria-labelledby={'oat-model-version'}
                            onChange={(_ev, value) => {
                                // special handling because this only fires when focus is lost OR when you click the increment/decrement buttons
                                forceUpdateId({ version: value });
                                setModelVersion(value);
                            }}
                            styles={classNames.subComponentStyles.numericField}
                            value={modelVersion}
                        />
                    </div>
                    <Separator
                        styles={classNames.subComponentStyles.separator}
                    />
                </>
            )}
        </Stack>
    );
};

export default styled<
    IPropertiesModelSummaryProps,
    IPropertiesModelSummaryStyleProps,
    IPropertiesModelSummaryStyles
>(PropertiesModelSummary, getStyles);
