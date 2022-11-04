import React, { useContext, useState, useCallback, useMemo } from 'react';
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
import { FormBody } from '../Shared/Constants';
import { getDebugLogger } from '../../../Models/Services/Utils';

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
import { OAT_INTERFACE_TYPE } from '../../../Models/Constants/Constants';
import { buildModelId, parseModelId } from '../../../Models/Services/OatUtils';
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
    const { dispatch, selectedItem, styles } = props;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // data
    const parsedId = useMemo(() => parseModelId(selectedItem['@id']), [
        selectedItem
    ]);
    const [itemUniqueName, setItemUniqueName] = useState(parsedId.name);
    const [itemPath, setItemPath] = useState(parsedId.path);
    const [itemVersion, setItemVersion] = useState(parsedId.version);
    const itemId = buildModelId({
        namespace: parsedId.namespace,
        modelName: itemUniqueName,
        path: itemPath,
        version: Number(itemVersion)
    });

    const commitIdChange = useCallback(
        (newId: string) => {
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

    // needed primarly for the version spinner since it behaves differently and you don't have to set focus
    const forceUpdateId = useCallback(
        ({ namespace, modelName, path, version }: IPartialModelId) => {
            const newId = buildModelId({
                namespace: namespace || parsedId.namespace,
                modelName: modelName || itemUniqueName,
                path: path || itemPath,
                version: Number(version || itemVersion)
            });
            commitIdChange(newId);
        },
        [
            commitIdChange,
            itemPath,
            itemUniqueName,
            itemVersion,
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

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    // logDebugConsole('debug', 'Render {item}', selectedItem);
    return (
        <Stack
            styles={classNames.subComponentStyles.rootStack}
            tokens={{ childrenGap: 8 }}
        >
            {/* HEADER */}
            <div className={classNames.sectionHeaderContainer}>
                <Stack tokens={{ childrenGap: 4 }}>
                    <h3 className={classNames.sectionTitle}>
                        {itemUniqueName}
                    </h3>
                    <span className={classNames.sectionSubtitle}>{itemId}</span>
                </Stack>
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
                <Text id={'oat-property-type'} className={classNames.rowLabel}>
                    {t('OATPropertyEditor.uniqueModelName')}
                </Text>
                <TextField
                    aria-labelledby={'oat-property-type'}
                    onBlur={() => commitIdChange(itemId)}
                    onChange={(_ev, value) => setItemUniqueName(value)}
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
                    onBlur={() => commitIdChange(itemId)}
                    onChange={(_ev, value) => setItemPath(value)}
                    styles={classNames.subComponentStyles.stringField}
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
                    onChange={(_ev, value) => {
                        // special handling because this only fires when focus is lost OR when you click the increment/decrement buttons
                        forceUpdateId({ version: value });
                        setItemVersion(value);
                    }}
                    styles={classNames.subComponentStyles.numericField}
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
            {/* {isSupportedModelType && (
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
            )} */}
        </Stack>
    );
};

export default styled<
    IPropertiesModelSummaryProps,
    IPropertiesModelSummaryStyleProps,
    IPropertiesModelSummaryStyles
>(PropertiesModelSummary, getStyles);
