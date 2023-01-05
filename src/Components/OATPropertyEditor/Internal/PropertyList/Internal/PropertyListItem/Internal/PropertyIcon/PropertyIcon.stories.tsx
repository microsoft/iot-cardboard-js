import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../../../../Models/Services/StoryUtilities';
import PropertyIcon from './PropertyIcon';
import { IPropertyIconProps } from './PropertyIcon.types';
import { PROPERTY_ICON_DATA } from '../../../../../../../../Models/Constants/OatConstants';
import { Stack, Text } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { DTDLSchema } from '../../../../../../../../Models/Classes/DTDL';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title:
        'Components - OAT/OATPropertyEditor/PropertyList/PropertyListItem/PropertyIcon',
    component: PropertyIcon,
    decorators: [getDefaultStoryDecorator<IPropertyIconProps>(wrapperStyle)]
};

type PropertyIconStory = ComponentStory<typeof PropertyIcon>;

const Template: PropertyIconStory = () => {
    const { t } = useTranslation();
    const items: JSX.Element[] = [];
    // ignore this warning since it's just a test
    PROPERTY_ICON_DATA.forEach((property) => {
        items.push(
            <Stack
                horizontal
                verticalAlign="center"
                tokens={{ childrenGap: 4 }}
            >
                <PropertyIcon schema={property.schema as DTDLSchema} />
                <Text
                    variant="medium"
                    styles={{ root: { fontStyle: 'italic' } }}
                >
                    {t(property.title)}
                </Text>
            </Stack>
        );
    });

    return <>{items.map((x) => x)}</>;
};

export const AllIcons = Template.bind({}) as PropertyIconStory;
