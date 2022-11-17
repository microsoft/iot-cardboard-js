import React from 'react';
import { ComponentStory } from '@storybook/react';
import FormRootModelDetails from './FormRootModelDetails';
import { IModalFormRootModelProps } from './FormRootModelDetails.types';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import { OatPageContextProvider } from '../../../../Models/Context/OatPageContext/OatPageContext';
import { CommandHistoryContextProvider } from '../../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { getMockModelItem } from '../../../../Models/Context/OatPageContext/OatPageContext.mock';
import { buildModelId } from '../../../../Models/Services/OatUtils';

const wrapperStyle = { width: '100%', height: '600px', padding: 16 };

export default {
    title: 'Components - OAT/OATPropertyEditor/FormRootModelDetails',
    component: FormRootModelDetails,
    decorators: [
        getDefaultStoryDecorator<IModalFormRootModelProps>(wrapperStyle)
    ]
};

type FormRootModelDetailsStory = ComponentStory<typeof FormRootModelDetails>;

const Template: FormRootModelDetailsStory = (args) => {
    const modelId1 = buildModelId({
        modelName: 'model' + 5,
        namespace: 'test-namespace',
        path: 'folder1:folder2',
        version: 2
    });
    const model = getMockModelItem(modelId1);
    return (
        <OatPageContextProvider>
            <CommandHistoryContextProvider>
                {/* Would be a callout or something */}
                <div style={{ width: 500 }}>
                    <FormRootModelDetails
                        languages={[]}
                        onClose={() => console.log('Close modal')}
                        selectedItem={model}
                        {...args}
                    />
                </div>
            </CommandHistoryContextProvider>
        </OatPageContextProvider>
    );
};

export const Base = Template.bind({}) as FormRootModelDetailsStory;
Base.args = {} as IModalFormRootModelProps;
