import React from 'react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import PropertyList from './PropertyList';
import { IPropertyListProps } from './PropertyList.types';
import {
    OatPageContextProvider,
    useOatPageContext
} from '../../../../Models/Context/OatPageContext/OatPageContext';
import { getMockFile } from '../../../../Models/Context/OatPageContext/OatPageContext.mock';
import { getMockProperty } from '../../../../Models/Services/OatTestUtils';
import {
    DTDLEnum,
    DTDLModel,
    DTDLObject,
    DTDLObjectField,
    DTDLProperty,
    DTDLRelationship
} from '../../../../Models/Classes/DTDL';
import { DtdlInterface, DtdlRelationship } from '../../../../Models/Constants';
import {
    isDTDLModel,
    isDTDLReference
} from '../../../../Models/Services/DtdlUtils';
import { getTargetFromSelection } from '../../Utils';
import { getSelectionIdentifier } from '../../../OATGraphViewer/Internal/Utils';

const wrapperStyle = { width: '100%', height: '1000px', padding: 8 };

export default {
    title: 'Components - OAT/OATPropertyEditor/PropertyList',
    component: PropertyList,
    decorators: [getDefaultStoryDecorator<IPropertyListProps>(wrapperStyle)]
};

type StoryArgs = {
    selectedItem: DtdlInterface | DtdlRelationship;
};

const getMockOntology = (selectedItem: DtdlInterface | DtdlRelationship) => {
    const file = getMockFile(0, '123', '234');
    if (isDTDLModel(selectedItem)) {
        // add the model to the front
        file.data.models.unshift(selectedItem as DTDLModel);
    } else {
        file.data.models[0].contents.unshift(selectedItem);
    }
    return file;
};

const getMockModel = (properties: DTDLProperty[]) => {
    return new DTDLModel(
        'test id 1',
        'test model 1 display',
        'description',
        '',
        properties
    );
};

const getMockRelationship = (properties: DTDLProperty[]) => {
    return new DTDLRelationship(
        '',
        'test relationship 1',
        '',
        '',
        '',
        true,
        properties
    );
};

const Template = (args: StoryArgs) => {
    const file = getMockOntology(args.selectedItem);
    const selectedItem = file.data.models[0];

    return (
        <OatPageContextProvider
            disableLocalStorage={true}
            initialState={{
                ontologyFiles: [file],
                currentOntologyId: 'something',
                selection: isDTDLReference(selectedItem)
                    ? {
                          modelId: selectedItem['@id'],
                          contentId: getSelectionIdentifier(selectedItem)
                      }
                    : { modelId: selectedItem['@id'] }
            }}
        >
            <TemplateContents />
        </OatPageContextProvider>
    );
};
const TemplateContents = () => {
    const { oatPageState } = useOatPageContext();
    const selectedItem =
        oatPageState.selection &&
        DTDLModel.fromObject(
            getTargetFromSelection(
                oatPageState.currentOntologyModels,
                oatPageState.selection
            )
        );
    return selectedItem ? (
        <PropertyList
            selectedItem={selectedItem}
            properties={selectedItem.properties}
            parentModelId={selectedItem['@id']}
        />
    ) : (
        <>No selected item to render</>
    );
};

export const ComplexModel = Template.bind({});
ComplexModel.args = {
    selectedItem: getMockModel([
        getMockProperty({ type: 'date' }),
        getMockProperty({ type: 'double' }),
        getMockProperty({ type: 'duration' }),
        getMockProperty({ type: 'Object' }),
        getMockProperty({ type: 'Object' }),
        getMockProperty({ type: 'Enum', enumType: 'integer' }),
        getMockProperty({ type: 'Map', valueType: 'Primitive' }),
        getMockProperty({ type: 'Map', valueType: 'Complex' }),
        getMockProperty({ type: 'Array', itemSchema: 'double' }),
        getMockProperty({
            type: 'Array',
            itemSchema: new DTDLObject('', [
                new DTDLObjectField('field 1', 'double'),
                new DTDLObjectField('field 2', 'date')
            ])
        }),
        getMockProperty({
            type: 'Array',
            itemSchema: new DTDLEnum(
                [
                    {
                        '@id': 'test id 1',
                        name: 'test item 1',
                        enumValue: 'value 1'
                    },
                    {
                        '@id': 'test id 2',
                        name: 'test item 2',
                        enumValue: 'value 2'
                    },
                    {
                        '@id': 'test id 3',
                        name: 'test item 3',
                        enumValue: 'value 3'
                    }
                ],
                'string'
            )
        })
    ])
} as StoryArgs;

export const SimpleModel = Template.bind({});
SimpleModel.args = {
    selectedItem: getMockModel([
        getMockProperty({ type: 'Enum', enumType: 'integer' }),
        (() => {
            const property = getMockProperty({
                type: 'Enum',
                enumType: 'string'
            });
            property.name = 'test string Enum';
            return property;
        })(),
        getMockProperty({
            type: 'Array',
            itemSchema: new DTDLObject('', [
                new DTDLObjectField('field 1', 'double'),
                new DTDLObjectField('field 2', 'date')
            ])
        })
    ])
} as StoryArgs;

export const Relationship = Template.bind({});
Relationship.args = {
    selectedItem: getMockRelationship([
        getMockProperty({ type: 'Enum', enumType: 'integer' }),
        getMockProperty({
            type: 'Array',
            itemSchema: new DTDLObject('', [
                new DTDLObjectField('field 1', 'double'),
                new DTDLObjectField('field 2', 'date')
            ])
        })
    ])
} as StoryArgs;
