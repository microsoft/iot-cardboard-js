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
import {
    DtdlInterface,
    DtdlInterfaceContent
} from '../../../../../../Models/Constants';
import { parseModels } from '../../../../../../Models/Services/OatPublicUtils';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import Editor from '@monaco-editor/react';
import {
    isDTDLModel,
    isDTDLReference
} from '../../../../../../Models/Services/DtdlUtils';
import {
    getModelById,
    getModelIndexById,
    getReferenceIndexByName
} from '../../../../../../Models/Context/OatPageContext/OatPageContextUtils';
import { ensureIsArray } from '../../../../../../Models/Services/OatUtils';

const debugLogging = true;
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
    }, [selectedItem, oatPageDispatch]);

    const onSaveClick = useCallback(async () => {
        logDebugConsole('debug', '[SAVE] Start {content}', content);
        const isJsonStringValid = (
            value: string
        ): DtdlInterface | DtdlInterfaceContent | null => {
            try {
                return JSON.parse(value);
            } catch (e) {
                return null;
            }
        };
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
            };

            const undoSave = () => {
                oatPageDispatch({
                    type: OatPageContextActionType.SET_CURRENT_MODELS,
                    payload: { models: oatPageState.currentOntologyModels }
                });
            };

            if (parsingError) {
                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_ERROR,
                    payload: {
                        title: t('OATPropertyEditor.errorInvalidJSON'),
                        message: parsingError
                    }
                });
            } else {
                execute(save, undoSave);
            }
        };

        const updatedItem = isJsonStringValid(content);
        if (!updatedItem) {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_ERROR,
                payload: {
                    title: t('OATPropertyEditor.errorInvalidJSON'),
                    message: t('OATPropertyEditor.errorInvalidJSONMessage')
                }
            });
            return;
        }
        let updatedModel: DtdlInterface;
        const originalModelId = oatPageState.selection.modelId;
        if (isDTDLModel(updatedItem)) {
            // bind the updated model
            updatedModel = updatedItem;
        } else if (isDTDLReference(selectedItem)) {
            // get the model and update the reference on the model
            updatedModel = getModelById(
                oatPageState.currentOntologyModels,
                originalModelId
            );
            const contents = ensureIsArray(updatedModel.contents);
            const index = getReferenceIndexByName(
                updatedModel,
                selectedItem.name // use the original name in case they change it in the update
            );
            contents[index] = updatedItem;
            updatedModel.contents = contents;
        }

        // validate the updated collection is valid
        const models = oatPageState.currentOntologyModels;
        const modelIndex = getModelIndexById(models, originalModelId);
        models[modelIndex] = updatedModel;
        const parsingError = await parseModels(models);

        if (parsingError) {
            logDebugConsole(
                'error',
                '[SAVE] Validation failed. {error}',
                parsingError
            );
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_ERROR,
                payload: {
                    title: t('OATPropertyEditor.errorInvalidJSON'),
                    message: parsingError
                }
            });
        } else {
            logDebugConsole(
                'info',
                '[SAVE] Validation passed. Saving model. {model}',
                updatedModel
            );
            saveModel(updatedModel);
        }
    }, [
        content,
        execute,
        oatPageDispatch,
        oatPageState.currentOntologyModels,
        oatPageState.selection.modelId,
        selectedItem,
        t
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
