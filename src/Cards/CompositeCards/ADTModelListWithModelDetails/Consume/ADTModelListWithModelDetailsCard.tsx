import React, { useState } from 'react';
import { IHierarchyNode } from '../../../../Models/Constants/Interfaces';
import BaseCompositeCard from '../../BaseCompositeCard/Consume/BaseCompositeCard';
import { ADTModelListWithModelDetailsCardProps } from './ADTModelListWithModelDetailsCard.types';
import ADTModelListCard from '../../../ADTModelListCard/Consume/ADTModelListCard';
import ModelCreate from '../../../../Components/ModelCreate/ModelCreate';
import { DTDLModel } from '../../../../Models/Classes/DTDL';
import './ADTModelListWithModelDetailsCard.scss';
import { FormMode } from '../../../../Models/Constants';

const ADTModelListWithModelDetailsCard: React.FC<ADTModelListWithModelDetailsCardProps> = ({
    adapter,
    theme,
    title,
    locale,
    localeStrings,
    adapterAdditionalParameters
}) => {
    const [selectedModel, setSelectedModel] = useState(null);

    const handleModelClick = (modelNode: IHierarchyNode) => {
        setSelectedModel(DTDLModel.fromObject(modelNode.nodeData.model));
    };

    const mockExistingModels = [
        'dtmi;com:example:www:door1;1',
        'dtmi;com:example:www:roof1;1',
        'dtmi;com:example:www:room1;1'
    ];

    return (
        <BaseCompositeCard
            title={title}
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
            adapterAdditionalParameters={adapterAdditionalParameters}
        >
            <div className="cb-hbcard-model-list">
                <ADTModelListCard
                    title={'Models'}
                    theme={theme}
                    locale={locale}
                    adapter={adapter}
                    onModelClick={handleModelClick}
                />
            </div>
            {selectedModel && (
                <div className="cb-hbcard-model-edit">
                    <ModelCreate
                        key={selectedModel['@id']}
                        locale={locale}
                        modelToEdit={selectedModel}
                        existingModelIds={mockExistingModels}
                        onCancel={() => console.log('Cancelling')}
                        onPrimaryAction={(model) => console.log(model)}
                        formControlMode={FormMode.View}
                    />
                </div>
            )}
        </BaseCompositeCard>
    );
};

export default React.memo(ADTModelListWithModelDetailsCard);
