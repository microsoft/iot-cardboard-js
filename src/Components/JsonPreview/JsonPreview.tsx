import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsonLang from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import codeStyle from 'react-syntax-highlighter/dist/esm/styles/hljs/googlecode';
import React, { useEffect, useRef, useState } from 'react';
import './JsonPreview.scss';
import { PrimaryButton, Panel, PanelType, Toggle } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import copy from 'copy-to-clipboard';

SyntaxHighlighter.registerLanguage('json', jsonLang);

type JsonPreviewProps = {
    json: { [key: string]: any };
    isOpen: boolean;
    onDismiss: () => any;
    modalTitle?: string;
};

const JsonPreview = ({
    json,
    isOpen,
    onDismiss,
    modalTitle
}: JsonPreviewProps) => {
    const { t } = useTranslation();
    const formattedString = JSON.stringify(json, null, 2);
    const [isCodeWrapped, setIsCodeWrapped] = useState(true);
    const [copyText, setCopyText] = useState<string>(t('copy'));
    const timeoutRef = useRef(null);

    useEffect(() => {
        setIsCodeWrapped(true);
    }, [isOpen]);

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    const onRenderFooterContent = () => {
        return (
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
                    <PrimaryButton
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
        );
    };

    return (
        <Panel
            isOpen={isOpen}
            isLightDismiss
            onDismiss={onDismiss}
            headerText={modalTitle}
            closeButtonAriaLabel={t('close')}
            onRenderFooterContent={onRenderFooterContent}
            isFooterAtBottom={true}
            type={PanelType.medium}
            className={'cb-json-preview-panel-container'}
            styles={{
                scrollableContent: {
                    overflowY: 'hidden'
                },
                content: {
                    height: '100%',
                    display: 'flex',
                    paddingLeft: '0px',
                    paddingRight: '0px'
                },
                footer: {
                    borderTop: '1px solid var(--cb-color-bg-canvas-inset)'
                }
            }}
        >
            <div className="cb-json-preview-container">
                <SyntaxHighlighter
                    customStyle={{
                        marginTop: '0px',
                        marginRight: '16px',
                        padding: '0px',
                        overflow: 'unset'
                    }}
                    language={'json'}
                    style={codeStyle}
                    showLineNumbers={true}
                    wrapLongLines={isCodeWrapped}
                >
                    {formattedString}
                </SyntaxHighlighter>
            </div>
        </Panel>
    );
};

export default JsonPreview;
