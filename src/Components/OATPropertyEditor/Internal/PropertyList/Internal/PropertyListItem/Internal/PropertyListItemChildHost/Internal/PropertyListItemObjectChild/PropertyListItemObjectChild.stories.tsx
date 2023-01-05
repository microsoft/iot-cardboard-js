import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../../../../../../Models/Services/StoryUtilities';
import PropertyListItemObjectChild from './PropertyListItemObjectChild';
import { IPropertyListItemObjectChildProps } from './PropertyListItemObjectChild.types';
import {
    DTDLObject,
    DTDLObjectField
} from '../../../../../../../../../../Models/Classes/DTDL';
import { OatPageContextProvider } from '../../../../../../../../../../Models/Context/OatPageContext/OatPageContext';
import { getMockFile } from '../../../../../../../../../../Models/Context/OatPageContext/OatPageContext.mock';
import PropertyListItem from '../../../../PropertyListItem';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title:
        'Components - OAT/OATPropertyEditor/PropertyList/PropertyListItem/PropertyListItemChildHost/PropertyListItemObjectChild',
    component: PropertyListItemObjectChild,
    decorators: [
        getDefaultStoryDecorator<IPropertyListItemObjectChildProps>(
            wrapperStyle
        )
    ]
};

type PropertyListItemObjectChildStory = ComponentStory<
    typeof PropertyListItemObjectChild
>;

const Template: PropertyListItemObjectChildStory = (args) => {
    return (
        <OatPageContextProvider
            disableLocalStorage={true}
            initialState={{
                ontologyFiles: [getMockFile(0, '123', '234')]
            }}
        >
            <PropertyListItem
                level={1}
                indexKey={'0'}
                item={{
                    name: 'Reference parent',
                    schema: new DTDLObject([])
                }}
                isFirstItem={false}
                isLastItem={false}
                onReorderItem={() => undefined}
                onUpdateName={() => undefined}
                onUpdateSchema={() => undefined}
                onCopy={() => undefined}
                onRemove={() => undefined}
                styles={{
                    root: {
                        marginLeft: 32 // spacing for the chevron
                    }
                }}
            />
            <PropertyListItemObjectChild {...args} level={1} />
        </OatPageContextProvider>
    );
};

export const Primitive = Template.bind({}) as PropertyListItemObjectChildStory;
Primitive.args = {
    level: 1, // ignored
    item: new DTDLObjectField('field name 1', 'double')
} as IPropertyListItemObjectChildProps;

export const Complex = Template.bind({}) as PropertyListItemObjectChildStory;
Complex.args = {
    level: 1, // ignored
    item: new DTDLObjectField(
        'field name 1',
        new DTDLObject([new DTDLObjectField('field 1', 'double')])
    )
} as IPropertyListItemObjectChildProps;
