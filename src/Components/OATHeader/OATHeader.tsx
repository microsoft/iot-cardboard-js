import React, { useContext } from 'react';
import { FontIcon, TextField, ActionButton } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getHeaderStyles } from './OATHeader.styles';
import JSZip from 'jszip';
import { IOATTwinModelNodes } from '../../Models/Constants';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/context/CommandHistoryContext';

type OATHeaderProps = {
    elements: IOATTwinModelNodes[];
};

const OATHeader = ({ elements }: OATHeaderProps) => {
    const { t } = useTranslation();
    const { undo, redo, canUndo, canRedo } = useContext(CommandHistoryContext);
    const headerStyles = getHeaderStyles();

    const downloadModelExportBlob = (blob) => {
        const blobURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', blobURL);
        link.setAttribute('download', 'modelExport.zip');
        link.innerHTML = '';
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    };

    const handleDownloadClick = () => {
        const zip = new JSZip();
        for (const element of elements) {
            let fileName = element['@id'];
            fileName = fileName.replace(/;/g, '-').replace(/:/g, '_');
            zip.file(`${fileName}.json`, JSON.stringify(element));
        }

        zip.generateAsync({ type: 'blob' }).then((content) => {
            downloadModelExportBlob(content);
        });
    };

    return (
        <div className={headerStyles.container}>
            <div className={headerStyles.searchComponent}>
                <div className={headerStyles.logo}>{t('OATHeader.title')}</div>
                <div className={headerStyles.search}>
                    <TextField
                        placeholder={t('OATHeader.searchContent')}
                    ></TextField>
                </div>
                <div className={headerStyles.options}>
                    <FontIcon
                        iconName={'Ringer'}
                        className={headerStyles.optionIcon}
                    />
                    <FontIcon
                        iconName={'Settings'}
                        className={headerStyles.optionIcon}
                    />
                    <FontIcon
                        iconName={'Help'}
                        className={headerStyles.optionIcon}
                    />
                </div>
            </div>
            <div className={headerStyles.menuComponent}>
                <div className="cb-oat-header-model"></div>
                <div className="cb-oat-header-menu">
                    <ActionButton>
                        <FontIcon
                            iconName={'Save'}
                            className={headerStyles.menuIcon}
                        />
                        {t('OATHeader.save')}
                    </ActionButton>
                    <ActionButton>
                        <FontIcon
                            iconName={'Upload'}
                            className={headerStyles.menuIcon}
                        />
                        {t('OATHeader.publish')}
                    </ActionButton>
                    <ActionButton>
                        <FontIcon
                            iconName={'Sync'}
                            className={headerStyles.menuIcon}
                        />
                        {t('OATHeader.sync')}
                    </ActionButton>
                    <ActionButton>
                        <FontIcon
                            iconName={'Import'}
                            className={headerStyles.menuIcon}
                        />
                        {t('OATHeader.import')}
                    </ActionButton>
                    <ActionButton onClick={handleDownloadClick}>
                        <FontIcon
                            iconName={'Export'}
                            className={headerStyles.menuIcon}
                        />
                        {t('OATHeader.export')}
                    </ActionButton>
                    <ActionButton onClick={undo} disabled={!canUndo}>
                        <FontIcon
                            iconName={'Undo'}
                            className={headerStyles.menuIcon}
                        />
                        {t('OATHeader.undo')}
                    </ActionButton>
                    <ActionButton onClick={redo} disabled={!canRedo}>
                        <FontIcon
                            iconName={'Redo'}
                            className={headerStyles.menuIcon}
                        />
                        {t('OATHeader.redo')}
                    </ActionButton>
                </div>
                <div className="cb-oat-header-versioning"></div>
            </div>
        </div>
    );
};

OATHeader.defaultProps = {
    elements: []
};

export default OATHeader;
