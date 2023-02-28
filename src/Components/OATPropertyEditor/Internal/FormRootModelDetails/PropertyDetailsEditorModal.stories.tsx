import React from 'react';
import PropertyDetailsEditorModal from './PropertyDetailsEditorModal';
import { IModalFormRootModelProps } from './PropertyDetailsEditorModal.types';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import { OatPageContextProvider } from '../../../../Models/Context/OatPageContext/OatPageContext';
import {
    getMockModelItem,
    getMockReference
} from '../../../../Models/Context/OatPageContext/OatPageContext.mock';
import { buildModelId } from '../../../../Models/Services/OatUtils';
import { DtdlRelationship } from '../../../..';
import { DTDLType } from '../../../../Models/Classes/DTDL';

const wrapperStyle = { width: '100%', height: '100%', padding: 16 };

export default {
    title: 'Components - OAT/OATPropertyEditor/PropertyDetailsEditorModal',
    component: PropertyDetailsEditorModal,
    decorators: [
        getDefaultStoryDecorator<IModalFormRootModelProps>(wrapperStyle)
    ]
};

type StoryProps = IModalFormRootModelProps;

const Template = (args: StoryProps) => {
    return (
        <OatPageContextProvider disableLocalStorage={true}>
            {/* Would be a callout or something */}
            <div style={{ width: 600 }}>
                <PropertyDetailsEditorModal
                    isOpen={true}
                    onClose={() => console.log('Close modal')}
                    onSubmit={(value) =>
                        console.log('Submit. {updatedItem}', value)
                    }
                    {...args}
                />
            </div>
        </OatPageContextProvider>
    );
};

export const ModelModal = Template.bind({});
ModelModal.args = (() => {
    const modelId1 = buildModelId({
        modelName: 'model' + 5,
        path: 'test-namespace:folder1:folder2',
        version: 2
    });
    const model = getMockModelItem(modelId1);
    return {
        selectedItem: model,
        stateModels: [model],
        stateSelection: {
            modelId: model['@id']
        }
    } as Partial<StoryProps>;
})();

export const RelationshipModal = Template.bind({});
RelationshipModal.args = (() => {
    const modelId1 = buildModelId({
        modelName: 'model' + 5,
        path: 'test-namespace:folder1:folder2',
        version: 2
    });
    const reference = getMockReference(
        modelId1,
        DTDLType.Relationship
    ) as DtdlRelationship;
    reference.minMultiplicity = undefined;
    reference.maxMultiplicity = undefined;
    reference.name = 'Reference 1';
    const model = getMockModelItem(modelId1);
    model.contents.push(reference);
    return {
        selectedItem: reference,
        stateModels: [model],
        stateSelection: {
            modelId: modelId1,
            contentId: reference.name
        }
    } as Partial<StoryProps>;
})();
