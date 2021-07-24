import React, { useEffect, useRef, useState } from 'react';
import { IHierarchyNode } from '../../../../Models/Constants/Interfaces';
import BaseCompositeCard from '../../BaseCompositeCard/Consume/BaseCompositeCard';
import { ADTModelListWithModelDetailsCardProps } from './ADTModelListWithModelDetailsCard.types';
import ADTModelListCard from '../../../ADTModelListCard/Consume/ADTModelListCard';
import ModelCreate from '../../../../Components/ModelCreate/ModelCreate';
import { DTDLModel } from '../../../../Models/Classes/DTDL';
import './ADTModelListWithModelDetailsCard.scss';
import { FormMode } from '../../../../Models/Constants';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import JsonPreview from '../../../../Components/JsonPreview/JsonPreview';
import { downloadText } from '../../../../Models/Services/Utils';

const ADTModelListWithModelDetailsCard: React.FC<ADTModelListWithModelDetailsCardProps> = ({
    adapter,
    theme,
    locale,
    localeStrings,
    adapterAdditionalParameters
}) => {
    const { t } = useTranslation();
    const [selectedModel, setSelectedModel] = useState(undefined);
    const [isModelPreviewOpen, setIsModelPreviewOpen] = useState(false);
    const selectedModelRef = useRef(selectedModel);

    const handleModelClick = (modelNode: IHierarchyNode) => {
        setSelectedModel(DTDLModel.fromObject(modelNode.nodeData.model));
    };

    const handleNewModelClick = () => {
        setSelectedModel(null);
    };

    const onDowloadClick = () => {
        downloadText(
            JSON.stringify(selectedModelRef.current, null, 2),
            `${selectedModelRef.current?.displayName}.json`
        );
    };

    useEffect(() => {
        selectedModelRef.current = selectedModel;
    }, [selectedModel]);

    const commandItems: ICommandBarItemProps[] = React.useMemo(() => {
        return [
            {
                key: 'newItem',
                text: `${t('view')} DTDL`,
                iconProps: { iconName: 'FileCode' },
                onClick: () => {
                    setIsModelPreviewOpen(true);
                }
            },
            {
                key: 'download',
                text: t('download'),
                iconProps: { iconName: 'Download' },
                onClick: onDowloadClick
            }
        ];
    }, []);

    const mockExistingModels = [
        'dtmi;com:example:www:door1;1',
        'dtmi;com:example:www:roof1;1',
        'dtmi;com:example:www:room1;1'
    ];

    return (
        <div className="cb-mbcard-wrapper">
            <BaseCompositeCard
                theme={theme}
                locale={locale}
                localeStrings={localeStrings}
                adapterAdditionalParameters={adapterAdditionalParameters}
            >
                <div className="cb-mbcard-list">
                    <ADTModelListCard
                        theme={theme}
                        locale={locale}
                        adapter={adapter}
                        onModelClick={handleModelClick}
                        onNewModelClick={handleNewModelClick}
                        selectedModelId={selectedModel?.['@id']}
                    />
                </div>
                {selectedModel !== undefined && (
                    <div className="cb-mbcard-form">
                        <CommandBar
                            className={'cb-commandBar'}
                            items={commandItems}
                            ariaLabel="Use left and right arrow keys to navigate between commands"
                        />
                        <ModelCreate
                            key={selectedModel?.['@id']}
                            locale={locale}
                            modelToEdit={selectedModel}
                            existingModelIds={mockExistingModels}
                            onCancel={() => console.log('Cancelling')}
                            onPrimaryAction={(model) => console.log(model)}
                            formControlMode={
                                selectedModel ? FormMode.Readonly : FormMode.New
                            }
                        />
                    </div>
                )}
            </BaseCompositeCard>

            <JsonPreview
                json={selectedModel}
                isOpen={isModelPreviewOpen}
                onDismiss={() => setIsModelPreviewOpen(false)}
                modalTitle={selectedModel?.displayName}
            />
        </div>
    );
};

export default React.memo(ADTModelListWithModelDetailsCard);
