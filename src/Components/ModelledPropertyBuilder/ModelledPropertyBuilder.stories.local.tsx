import { ComponentStory } from '@storybook/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ADT3DSceneAdapter } from '../../Adapters';
import { MsalAuthService } from '../../Models/Services';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import ModelledPropertyBuilder from './ModelledPropertyBuilder';
import {
    ModelledPropertyBuilderProps,
    PropertyExpression,
    ResolvedTwinIdParams
} from './ModelledPropertyBuilder.types';
import useAuthParams from '../../../.storybook/useAuthParams';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { PrimaryButton, TextField } from '@fluentui/react';

const wrapperStyle = { width: '600px', height: '600px', padding: 20 };

export default {
    title: 'Components/ModelledPropertyBuilder',
    component: ModelledPropertyBuilder,
    decorators: [
        getDefaultStoryDecorator<ModelledPropertyBuilderProps>(wrapperStyle)
    ]
};

type ModelledPropertyBuilderStory = ComponentStory<
    typeof ModelledPropertyBuilder
>;

const Template: ModelledPropertyBuilderStory = (args) => {
    const [
        propertyExpression,
        setPropertyExpression
    ] = useState<PropertyExpression>(
        args.propertyExpression ?? { expression: '' }
    );
    const authenticationParameters = useAuthParams();
    const [config, setConfig] = useState<I3DScenesConfig>(null);
    const adapterRef = useRef<ADT3DSceneAdapter>(null);
    const [twinIdText, setTwinIdText] = useState('');
    const [twinIds, setTwinIds] = useState([]);

    useEffect(() => {
        if (authenticationParameters) {
            adapterRef.current = new ADT3DSceneAdapter(
                new MsalAuthService(authenticationParameters.adt.aadParameters),
                authenticationParameters.adt.hostUrl,
                authenticationParameters.storage.blobContainerUrl
            );
            const populateConfig = async () => {
                const configResult = await adapterRef.current.getScenesConfig();
                setConfig(configResult.getData());
            };
            populateConfig();
        }
    }, [authenticationParameters]);

    const twinIdParams: ResolvedTwinIdParams = useMemo(() => {
        const primaryTwinIds = twinIds?.[0] ? [twinIds[0]] : [];
        const aliasedTwinMap = {};
        if (twinIds?.length > 1) {
            twinIds.slice(1).forEach((id) => {
                aliasedTwinMap[`${id}_alias`] = id;
            });
        }

        return {
            primaryTwinIds,
            ...(twinIds?.length > 1 && { aliasedTwinMap })
        };
    }, [twinIds]);

    return !authenticationParameters || !config ? (
        <div></div>
    ) : (
        <div>
            <div
                style={{
                    marginBottom: 20,
                    width: '100%'
                }}
            >
                <TextField
                    label="Comma separated Twin Ids"
                    description="First token treated as primaryTwin, all other tokens treated as twin aliases"
                    placeholder="Enter comma separated Twin Ids"
                    value={twinIdText}
                    onChange={(_event, newValue) => setTwinIdText(newValue)}
                    styles={{ root: { flexGrow: 1 } }}
                />
                <PrimaryButton
                    onClick={() =>
                        setTwinIds(twinIdText.split(',').map((id) => id.trim()))
                    }
                    style={{ marginTop: 16 }}
                >
                    Update properties
                </PrimaryButton>
            </div>
            <ModelledPropertyBuilder
                {...args}
                adapter={adapterRef.current}
                twinIdParams={twinIdParams}
                onChange={(newPropertyExpression: PropertyExpression) =>
                    setPropertyExpression(newPropertyExpression)
                }
                propertyExpression={propertyExpression}
                required
            />
        </div>
    );
};

export const LiveAdtData = Template.bind({});
LiveAdtData.storyName = 'ADT Twin previewer';
