import React, { useState } from 'react';
import FormRootModelDetailsContent from './PropertyDetailsEditorModalContent';
import { IModalFormRootModelContentProps } from './FormRootModelDetailsContent.types';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import { OatPageContextProvider } from '../../../../../../Models/Context/OatPageContext/OatPageContext';
import {
    getMockModelItem,
    getMockReference
} from '../../../../../../Models/Context/OatPageContext/OatPageContext.mock';
import { buildModelId } from '../../../../../../Models/Services/OatUtils';
import { DTDLType } from '../../../../../../Models/Classes/DTDL';
import { DtdlRelationship } from '../../../../../../Models/Constants';

const wrapperStyle = { width: '100%', height: '100%', padding: 16 };

export default {
    title: 'Components - OAT/OATPropertyEditor/FormRootModelDetailsContent',
    component: FormRootModelDetailsContent,
    decorators: [
        getDefaultStoryDecorator<IModalFormRootModelContentProps>(wrapperStyle)
    ]
};

type StoryProps = IModalFormRootModelContentProps;

const Template = (args: StoryProps) => {
    const [localDraft, setLocalDraft] = useState(args.selectedItem);
    return (
        <OatPageContextProvider disableLocalStorage={true}>
            {/* Would be a callout or something */}
            <div style={{ width: 600 }}>
                <FormRootModelDetailsContent
                    {...args}
                    selectedItem={localDraft}
                    onUpdateItem={(value) => {
                        console.log('Update. {updatedItem}', value);
                        setLocalDraft(value);
                    }}
                />
            </div>
        </OatPageContextProvider>
    );
};

export const Model = Template.bind({});
Model.args = (() => {
    const modelId1 = buildModelId({
        modelName: 'model' + 5,
        namespace: 'test-namespace',
        path: 'folder1:folder2',
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

export const RelationshipReferenceEmpty = Template.bind({});
RelationshipReferenceEmpty.args = (() => {
    const modelId1 = buildModelId({
        modelName: 'model' + 5,
        namespace: 'test-namespace',
        path: 'folder1:folder2',
        version: 2
    });
    const reference = getMockReference(
        modelId1,
        DTDLType.Relationship
    ) as DtdlRelationship;
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

export const RelationshipReferenceEdit = Template.bind({});
RelationshipReferenceEdit.args = (() => {
    const modelId1 = buildModelId({
        modelName: 'model' + 5,
        namespace: 'test-namespace',
        path: 'folder1:folder2',
        version: 2
    });
    const reference = getMockReference(
        modelId1,
        DTDLType.Relationship
    ) as DtdlRelationship;
    reference.description;
    reference.comment = 'Some comment';
    reference.minMultiplicity = 5;
    reference.maxMultiplicity = 10;
    reference.writable = true;

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

export const RelationshipReferenceEditMultiLang = Template.bind({});
RelationshipReferenceEditMultiLang.args = (() => {
    const modelId1 = buildModelId({
        modelName: 'model' + 5,
        namespace: 'test-namespace',
        path: 'folder1:folder2',
        version: 2
    });
    const reference = getMockReference(
        modelId1,
        DTDLType.Relationship
    ) as DtdlRelationship;
    reference.displayName = {
        cs: 'Czech display',
        de: 'German display',
        en: 'English display'
    };
    reference.description = {
        cs: 'Czech description',
        de: 'German description',
        en: 'English description'
    };
    reference.comment = 'Some comment';
    reference.minMultiplicity = 5;
    reference.maxMultiplicity = 10;
    reference.writable = true;

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

export const ComponentReference = Template.bind({});
ComponentReference.args = (() => {
    const modelId1 = buildModelId({
        modelName: 'model' + 5,
        namespace: 'test-namespace',
        path: 'folder1:folder2',
        version: 2
    });
    const reference = getMockReference(modelId1, DTDLType.Component);

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
