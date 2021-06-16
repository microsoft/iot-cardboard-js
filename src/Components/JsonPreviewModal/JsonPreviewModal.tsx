import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsonLang from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import codeStyle from 'react-syntax-highlighter/dist/esm/styles/hljs/googlecode';
import React from 'react';
import './JsonPreviewModal.scss';
import {
    DefaultButton,
    FontWeights,
    getTheme,
    IButtonStyles,
    IconButton,
    mergeStyleSets,
    Modal
} from '@fluentui/react';
import { useGuid } from '../../Models/Hooks';
import { useTranslation } from 'react-i18next';

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
            padding: '12px 12px 14px 24px',
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
    const titleId = useGuid();

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
                >
                    {formattedString}
                </SyntaxHighlighter>
            </div>
            <div className={'cb-json-preview-modal-footer'}>
                <DefaultButton
                    className="cb-footer-copy-json-button"
                    text={t('copy')}
                    onClick={() => null}
                />
            </div>
        </Modal>
    );
};

export default JsonPreviewModal;
