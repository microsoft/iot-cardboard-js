import React from 'react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getHeaderStyles } from './OATHeader.styles';
import JSZip from 'jszip';
import { IOATTwinModelNodes } from '../../Models/Constants';

type OATHeaderProps = {
    elements: IOATTwinModelNodes[];
};

const OATHeader = ({ elements }: OATHeaderProps) => {
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

    const items: ICommandBarItemProps[] = [
        {
            key: 'Save',
            text: t('OATHeader.save'),
            iconProps: { iconName: 'Save' }
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
            iconProps: { iconName: 'Import' }
        },
        {
            key: 'Export',
            text: t('OATHeader.export'),
            iconProps: { iconName: 'Export' },
            onClick: () => handleDownloadClick()
        }
    ];

    return (
        <div className={headerStyles.container}>
            <div className={headerStyles.menuComponent}>
                <div className="cb-oat-header-model"></div>
                <div className="cb-oat-header-menu">
                    <CommandBar items={items} />
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
