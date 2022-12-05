import React, { CSSProperties } from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../../../../../../Models/Services/StoryUtilities';
import PropertyListItemEnumChild from './PropertyListItemEnumChild';
import { IPropertyListItemEnumChildProps } from './PropertyListItemEnumChild.types';
import { DTDLEnumValue } from '../../../../../../../../../../Models/Classes/DTDL';
import { OatPageContextProvider } from '../../../../../../../../../../Models/Context/OatPageContext/OatPageContext';
import { getMockFile } from '../../../../../../../../../../Models/Context/OatPageContext/OatPageContext.mock';

const wrapperStyle: CSSProperties = {
    width: '300px',
    height: '200px',
    padding: 8,
    overflowY: 'hidden'
};

export default {
    title:
        'Components - OAT/OATPropertyEditor/PropertyList/PropertyListItem/PropertyListItemChildHost/PropertyListItemEnumChild',
    component: PropertyListItemEnumChild,
    decorators: [
        getDefaultStoryDecorator<IPropertyListItemEnumChildProps>(wrapperStyle)
    ]
};

type PropertyListItemEnumChildStory = ComponentStory<
    typeof PropertyListItemEnumChild
>;

const Template: PropertyListItemEnumChildStory = (args) => {
    return (
        <OatPageContextProvider
            disableLocalStorage={true}
            initialState={{
                ontologyFiles: [getMockFile(0, '123', '234')]
            }}
        >
            <PropertyListItemEnumChild {...args} />
        </OatPageContextProvider>
    );
};

export const Integer = Template.bind({}) as PropertyListItemEnumChildStory;
Integer.args = {
    level: 1,
    enumType: 'integer',
    item: new DTDLEnumValue('enum name 1', 2)
} as IPropertyListItemEnumChildProps;

export const String = Template.bind({}) as PropertyListItemEnumChildStory;
String.args = {
    level: 1,
    enumType: 'string',
    item: new DTDLEnumValue('enum name 1', 'my value')
} as IPropertyListItemEnumChildProps;
