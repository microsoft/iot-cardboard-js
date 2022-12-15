import React from 'react';
import {
    getDefaultStoryDecorator,
    sleep
} from '../../../../Models/Services/StoryUtilities';
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
    isDTDLReference,
    isDTDLRelationshipReference
} from '../../../../Models/Services/DtdlUtils';
import { getTargetFromSelection } from '../../Utils';
import { getSelectionIdentifier } from '../../../OATGraphViewer/Internal/Utils';
import { userEvent, within } from '@storybook/testing-library';

const wrapperStyle = { width: '500px', height: '1000px', padding: 8 };

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
    const selection = isDTDLReference(args.selectedItem)
        ? {
              modelId: selectedItem['@id'],
              contentId: getSelectionIdentifier(args.selectedItem)
          }
        : { modelId: selectedItem['@id'] };

    return (
        <OatPageContextProvider
            disableLocalStorage={true}
            initialState={{
                ontologyFiles: [file],
                currentOntologyId: 'something',
                selection: selection
            }}
        >
            <TemplateContents />
        </OatPageContextProvider>
    );
};
const TemplateContents = () => {
    const { oatPageState } = useOatPageContext();
    const selectionTarget =
        oatPageState.selection &&
        getTargetFromSelection(
            oatPageState.currentOntologyModels,
            oatPageState.selection
        );
    const selectedItem = isDTDLRelationshipReference(selectionTarget)
        ? DTDLRelationship.fromObject(selectionTarget)
        : DTDLModel.fromObject(selectionTarget);

    return selectionTarget ? (
        <PropertyList
            selectedItem={selectedItem}
            properties={selectedItem.properties}
            parentModelId={selectionTarget['@id']}
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
        getMockProperty({
            type: 'Object',
            complexity: 'complex',
            discriminator: 1
        }),
        getMockProperty({
            type: 'Object',
            complexity: 'simple',
            discriminator: 2
        }),
        getMockProperty({
            type: 'Enum',
            enumType: 'integer',
            discriminator: 1
        }),
        getMockProperty({
            type: 'Map',
            valueType: 'Primitive',
            discriminator: 1
        }),
        getMockProperty({
            type: 'Map',
            valueType: 'Complex',
            discriminator: 2
        }),
        getMockProperty({
            type: 'Array',
            itemSchema: 'double',
            discriminator: 1
        }),
        getMockProperty({
            type: 'Array',
            itemSchema: new DTDLObject('', [
                new DTDLObjectField('field 1', 'double'),
                new DTDLObjectField('field 2', 'date')
            ]),
            discriminator: 2
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
            ),
            discriminator: 3
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
        }),
        getMockProperty({
            type: 'Object',
            complexity: 'simple',
            discriminator: 1
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

export const OpenMenu = Template.bind({});
OpenMenu.args = SimpleModel.args as StoryArgs;
OpenMenu.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tab = await canvas.findByTestId(
        'context-menu-property-list-0-moreMenu'
    );
    userEvent.click(tab);
    await sleep(10);
};
