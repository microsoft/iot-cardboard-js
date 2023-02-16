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
import {
    getTargetFromSelection,
    replaceTargetFromSelection
} from '../../../../Utils';
import { OatPageContextActionType } from '../../../../../../Models/Context/OatPageContext/OatPageContext.types';
import { isDTDLRelationshipReference } from '../../../../../../Models/Services/DtdlUtils';
import { DtdlInterface } from '../../../../../../Models/Constants';
import { parseModels } from '../../../../../../Models/Services/OatPublicUtils';
import { deepCopy } from '../../../../../../Models/Services/Utils';
import Editor from '@monaco-editor/react';

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
    const model = useMemo(
        () =>
            oatPageState.selection &&
            getTargetFromSelection(
                oatPageState.currentOntologyModels,
                oatPageState.selection
            ),
        [oatPageState.currentOntologyModels, oatPageState.selection]
    );
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
            if (
                value.replaceAll('\r\n', '\n') !==
                JSON.stringify(model, null, 2)
            ) {
                setContent(value);
                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_MODIFIED,
                    payload: { isModified: true }
                });
            }
        },
        [model, oatPageDispatch]
    );

    const checkDuplicateId = useCallback(
        (modelValue: DtdlInterface) => {
            if (isDTDLRelationshipReference(modelValue)) {
                const repeatedIdOnRelationship = oatPageState.currentOntologyModels.find(
                    (queryModel) =>
                        queryModel.contents &&
                        queryModel.contents.find(
                            (content) =>
                                content['@id'] === modelValue['@id'] &&
                                content['@id'] !== model['@id'] // Prevent checking for duplicate name to itself
                        )
                );
                return !!repeatedIdOnRelationship;
            } else {
                // Check current value is not used by another model as @id within models
                const repeatedIdModel = oatPageState.currentOntologyModels.find(
                    (queryModel) =>
                        queryModel['@id'] === modelValue['@id'] &&
                        queryModel['@id'] !== model['@id']
                );
                return !!repeatedIdModel;
            }
        },
        [model, oatPageState.currentOntologyModels]
    );

    const onCancelClick = useCallback(() => {
        setContent(JSON.stringify(model, null, 2));
        oatPageDispatch({
            type: OatPageContextActionType.SET_OAT_MODIFIED,
            payload: { isModified: false }
        });
    }, [model, oatPageDispatch]);

    const onSaveClick = useCallback(async () => {
        const isJsonStringValid = (value: string): DtdlInterface | null => {
            try {
                return JSON.parse(value);
            } catch (e) {
                return null;
            }
        };

        const newModel = isJsonStringValid(content);
        const parsingError = await parseModels([
            ...oatPageState.currentOntologyModels,
            newModel
        ]);

        const save = () => {
            const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
            replaceTargetFromSelection(
                modelsCopy,
                oatPageState.selection,
                newModel
            );
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS,
                payload: { models: modelsCopy }
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

        if (!parsingError) {
            if (checkDuplicateId(newModel)) {
                // Dispatch error if duplicate id
                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_ERROR,
                    payload: {
                        title: t('OATPropertyEditor.errorInvalidJSON'),
                        message: t('OATPropertyEditor.errorRepeatedId')
                    }
                });
            } else {
                execute(save, undoSave);
            }
        } else {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_ERROR,
                payload: {
                    title: t('OATPropertyEditor.errorInvalidJSON'),
                    message: parsingError
                }
            });
        }
    }, [
        checkDuplicateId,
        content,
        execute,
        oatPageDispatch,
        oatPageState.currentOntologyModels,
        oatPageState.selection,
        t
    ]);

    // side effects
    useEffect(() => {
        setContent(JSON.stringify(model, null, 2));
    }, [model]);

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
