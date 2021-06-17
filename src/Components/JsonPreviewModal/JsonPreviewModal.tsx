import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsonLang from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import codeStyle from 'react-syntax-highlighter/dist/esm/styles/hljs/googlecode';
import React, { useEffect, useRef, useState } from 'react';
import './JsonPreviewModal.scss';
import {
    DefaultButton,
    FontWeights,
    getTheme,
    IButtonStyles,
    IconButton,
    mergeStyleSets,
    Modal,
    Toggle
} from '@fluentui/react';
import { useGuid } from '../../Models/Hooks';
import { useTranslation } from 'react-i18next';
import copy from 'copy-to-clipboard';

SyntaxHighlighter.registerLanguage('json', jsonLang);

type JsonPreviewModalProps = {
    json: { [key: string]: any };
    isOpen: boolean;
    onDismiss: () => any;
    modalTitle?: string;
};

const theme = getTheme();

const iconButtonStyles: Partial<IButtonStyles> = {
    root: {
        color: theme.palette.neutralPrimary,
        marginLeft: 'auto',
        marginTop: '4px',
        marginRight: '2px'
    },
    rootHovered: {
        color: theme.palette.neutralDark
    }
};

const contentStyles = mergeStyleSets({
    header: [
        theme.fonts.xLarge,
        {
            flex: '1 1 auto',
            borderTop: `4px solid ${theme.palette.themePrimary}`,
            color: theme.palette.neutralPrimary,
            display: 'flex',
            alignItems: 'center',
            fontWeight: FontWeights.semibold,
            padding: '12px 12px 14px 20px',
            height: '40px'
        }
    ]
});

const JsonPreviewModal = ({
    json,
    isOpen,
    onDismiss,
    modalTitle
}: JsonPreviewModalProps) => {
    const { t } = useTranslation();
    const formattedString = JSON.stringify(json, null, 2);
    const [isCodeWrapped, setIsCodeWrapped] = useState(true);
    const [copyText, setCopyText] = useState<string>(t('copy'));
    const timeoutRef = useRef(null);
    const titleId = useGuid();

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    return (
        <Modal
            titleAriaId={titleId}
            isOpen={isOpen}
            onDismiss={onDismiss}
            isBlocking={false}
            containerClassName={'cb-json-preview-modal-container'}
            scrollableContentClassName={
                'cb-json-preview-modal-scrollable-content'
            }
        >
            <div className={contentStyles.header}>
                <span id={titleId} className={'cb-json-preview-modal-title'}>
                    {modalTitle}
                </span>
                <IconButton
                    styles={iconButtonStyles}
                    iconProps={{
                        iconName: 'Cancel'
                    }}
                    ariaLabel="Close popup modal"
                    onClick={onDismiss}
                />
            </div>

            <div className="cb-json-preview-container">
                <SyntaxHighlighter
                    customStyle={{
                        marginTop: '0px'
                    }}
                    lineNumberStyle={{}}
                    language={'json'}
                    style={codeStyle}
                    showLineNumbers={true}
                    wrapLongLines={isCodeWrapped}
                >
                    {formattedString}
                </SyntaxHighlighter>
            </div>
            <div className={'cb-json-preview-modal-footer-container'}>
                <div className={'cb-json-preview-modal-footer-tools'}>
                    <Toggle
                        label={t('wrapText')}
                        defaultChecked
                        onText={t('on')}
                        offText={t('off')}
                        onChange={(_, checked) => setIsCodeWrapped(checked)}
                    />
                </div>
                <div className={'cb-json-preview-modal-footer-actions'}>
                    <DefaultButton
                        className="cb-footer-copy-json-button"
                        text={copyText}
                        disabled={copyText === t('copied')}
                        onClick={() => {
                            setCopyText(t('copied'));
                            timeoutRef.current = setTimeout(
                                () => setCopyText(t('copy')),
                                1500
                            );
                            copy(formattedString);
                        }}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default JsonPreviewModal;
