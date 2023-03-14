import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    IJSONEditorProps,
    IJSONEditorStyleProps,
    IJSONEditorStyles
} from './JSONEditor.types';
import { EDITOR_HEIGHT, getStyles } from './JSONEditor.styles';
import {
    classNamesFunction,
    DefaultButton,
    DialogFooter,
    PrimaryButton,
    Stack,
    styled
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../../../Models/Hooks/useExtendedTheme';
import { useTranslation } from 'react-i18next';
import { useOatPageContext } from '../../../../../../Models/Context/OatPageContext/OatPageContext';
import { CommandHistoryContext } from '../../../../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { APP_BACKGROUND_KRAKEN } from '../../../../../../Models/Constants/StyleConstants';
import { useLibTheme } from '../../../../../../Theming/ThemeProvider';
import { getTargetFromSelection } from '../../../../Utils';
import { OatPageContextActionType } from '../../../../../../Models/Context/OatPageContext/OatPageContext.types';
import { DtdlInterface } from '../../../../../../Models/Constants';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import Editor from '@monaco-editor/react';
import { validateItemChangeBeforeSaving } from '../../../../../../Models/Services/DtdlUtils';
import useTelemetry from '../../../../../../Models/Hooks/useTelemetry';
import {
    AppRegion,
    ComponentName,
    TelemetryEvents
} from '../../../../../../Models/Constants/OatTelemetryConstants';
import { TelemetryTrigger } from '../../../../../../Models/Constants/TelemetryConstants';

const debugLogging = false;
export const logDebugConsole = getDebugLogger('JSONEditor', debugLogging);

const getClassNames = classNamesFunction<
    IJSONEditorStyleProps,
    IJSONEditorStyles
>();

function setEditorTheme(monaco: any) {
    monaco.editor.defineTheme('kraken', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
            'editor.background': APP_BACKGROUND_KRAKEN
        }
    });
}
const editorOptions = {
    minimap: {
        enabled: false
    }
};

const JSONEditor: React.FC<IJSONEditorProps> = (props) => {
    const { selectedTheme, styles } = props;

    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // state
    const editorRef = useRef(null);
    const [content, setContent] = useState<string>(null);

    // hooks
    const { t } = useTranslation();
    const { sendEventTelemetry } = useTelemetry();

    // data
    const selectedItem = useMemo(() => {
        return (
            oatPageState.selection &&
            getTargetFromSelection(
                oatPageState.currentOntologyModels,
                oatPageState.selection
            )
        );
    }, [oatPageState.currentOntologyModels, oatPageState.selection]);
    const libTheme = useLibTheme();
    const themeToUse = libTheme || selectedTheme;
    const editorTheme =
        themeToUse === 'dark' || selectedTheme === 'explorer'
            ? 'vs-dark'
            : themeToUse;

    // callbacks
    const onHandleEditorDidMount = useCallback((editor: any) => {
        editorRef.current = editor;
    }, []);

    const onHandleEditorChange = useCallback(
        (value: string) => {
            setContent(value);
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_MODIFIED,
                payload: { isModified: true }
            });
        },
        [oatPageDispatch]
    );

    const onCancelClick = useCallback(() => {
        setContent(JSON.stringify(selectedItem, null, 2));
        oatPageDispatch({
            type: OatPageContextActionType.SET_OAT_MODIFIED,
            payload: { isModified: false }
        });
        sendEventTelemetry({
            name: TelemetryEvents.dtdlJsonCancelled,
            triggerType: TelemetryTrigger.UserAction,
            appRegion: AppRegion.OAT,
            componentName: ComponentName.OAT
        });
    }, [selectedItem, oatPageDispatch, sendEventTelemetry]);

    const onSaveClick = useCallback(async () => {
        logDebugConsole('debug', '[SAVE] Start {content}', content);
        const saveModel = (model: DtdlInterface) => {
            const save = () => {
                oatPageDispatch({
                    type: OatPageContextActionType.UPDATE_MODEL,
                    payload: { model: model }
                });
                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_MODIFIED,
                    payload: { isModified: false }
                });
                sendEventTelemetry({
                    name: TelemetryEvents.dtdlJsonSuccess,
                    triggerType: TelemetryTrigger.UserAction,
                    appRegion: AppRegion.OAT,
                    componentName: ComponentName.OAT
                });
            };

            const undoSave = () => {
                oatPageDispatch({
                    type: OatPageContextActionType.SET_CURRENT_MODELS,
                    payload: { models: oatPageState.currentOntologyModels }
                });
            };

            execute(save, undoSave);
        };

        const validationResult = await validateItemChangeBeforeSaving({
            content: content,
            originalItem: selectedItem,
            existingModels: oatPageState.currentOntologyModels,
            selectedModelId: oatPageState.selection.modelId
        });

        if (validationResult.isValid === true) {
            logDebugConsole(
                'info',
                '[SAVE] Validation passed. Saving model. {model}',
                validationResult.updatedModel
            );
            saveModel(validationResult.updatedModel);
        } else {
            logDebugConsole(
                'error',
                '[SAVE] Validation failed. {error}',
                validationResult.error
            );
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_ERROR,
                payload: {
                    title: validationResult.error.title,
                    message: validationResult.error.message
                }
            });
        }
    }, [
        content,
        execute,
        oatPageDispatch,
        oatPageState.currentOntologyModels,
        oatPageState.selection.modelId,
        selectedItem,
        sendEventTelemetry
    ]);

    // side effects
    useEffect(() => {
        setContent(JSON.stringify(selectedItem, null, 2));
    }, [selectedItem]);

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    return (
        <Stack className={classNames.root} tokens={{ childrenGap: 8 }}>
            <Editor
                beforeMount={setEditorTheme}
                className={classNames.editor}
                defaultLanguage={'json'}
                height={EDITOR_HEIGHT}
                onChange={onHandleEditorChange}
                onMount={onHandleEditorDidMount}
                options={editorOptions}
                theme={editorTheme}
                value={content}
            />
            <DialogFooter>
                <DefaultButton
                    onClick={onCancelClick}
                    text={t('discard')}
                    disabled={!oatPageState.modified}
                />
                <PrimaryButton
                    onClick={onSaveClick}
                    text={t('save')}
                    disabled={!oatPageState.modified}
                />
            </DialogFooter>
        </Stack>
    );
};

export default styled<
    IJSONEditorProps,
    IJSONEditorStyleProps,
    IJSONEditorStyles
>(JSONEditor, getStyles);
