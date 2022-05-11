import React from 'react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getHeaderStyles } from './OATHeader.styles';
import JSZip from 'jszip';
import { IOATTwinModelNodes, OATDataStorageKey } from '../../Models/Constants';
import { downloadText } from '../../Models/Services/Utils';

type OATHeaderProps = {
    elements: IOATTwinModelNodes[];
    onImportClick: () => any;
};

const OATHeader = ({ elements, onImportClick }: OATHeaderProps) => {
    const { t } = useTranslation();
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

    const handleExportClick = () => {
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

    const handleSaveClick = () => {
        const editorData = localStorage.getItem(OATDataStorageKey);
        if (editorData) {
            downloadText(editorData, 'project.config');
        }
    };

    const items: ICommandBarItemProps[] = [
        {
            key: 'Save',
            text: t('OATHeader.save'),
            iconProps: { iconName: 'Save' },
            onClick: () => handleSaveClick()
        },
        {
            key: 'Upload',
            text: t('OATHeader.publish'),
            iconProps: { iconName: 'Upload' }
        },
        {
            key: 'Sync',
            text: t('OATHeader.sync'),
            iconProps: { iconName: 'Sync' }
        },
        {
            key: 'Import',
            text: t('OATHeader.import'),
            iconProps: { iconName: 'Import' },
            onClick: () => onImportClick()
        },
        {
            key: 'Export',
            text: t('OATHeader.export'),
            iconProps: { iconName: 'Export' },
            onClick: () => handleExportClick()
        }
    ];

    return (
        <div className={headerStyles.container}>
            <div className={headerStyles.menuComponent}>
                <div className="cb-oat-header-model"></div>
                <div className="cb-oat-header-menu">
<<<<<<< HEAD
                    <CommandBar items={items} />
=======
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
                    <ActionButton onClick={onImportClick}>
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
>>>>>>> origin/zarmada/oat-development
                </div>
                <div className="cb-oat-header-versioning"></div>
            </div>
        </div>
    );
};

OATHeader.defaultProps = {
    elements: [],
    onImportClick: () => null
};

export default OATHeader;
