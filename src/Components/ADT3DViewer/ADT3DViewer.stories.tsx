import React, { useState } from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADT3DViewer from './ADT3DViewer';
import MockAdapter from '../../Adapters/MockAdapter';
import mockVConfig from '../../Adapters/__mockData__/3DScenesConfiguration.json';
import { ADT3DAddInEventData, IADT3DAddInProps } from '../../Models/Constants';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { CustomMeshItem } from '../../Models/Classes/SceneView.types';
import { Checkbox, Dropdown, IDropdownOption } from '@fluentui/react';

export default {
    title: '3DV/ADT3DViewer',
    component: ADT3DViewer
};

const mockSceneId = 'f7053e7537048e03be4d1e6f8f93aa8a';

export const Engine = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    const scenesConfig = mockVConfig as I3DScenesConfig;
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ width: '100%', height: '600px' }}>
            <ADT3DViewer
                title="3D Viewer"
                theme={theme}
                locale={locale}
                adapter={new MockAdapter()}
                scenesConfig={scenesConfig}
                pollingInterval={10000}
                sceneId={mockSceneId}
                connectionLineColor="#000"
            />
        </div>
    );
};

export const EngineWithHover = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    const scenesConfig = mockVConfig as I3DScenesConfig;

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ width: '100%', height: '600px' }}>
            <ADT3DViewer
                title="3D Viewer"
                theme={theme}
                locale={locale}
                adapter={new MockAdapter()}
                scenesConfig={scenesConfig}
                showMeshesOnHover={true}
                pollingInterval={10000}
                sceneId={mockSceneId}
                connectionLineColor="#000"
            />
        </div>
    );
};

export const ZoomAndColor = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    const [hoveredIndex, setHoveredIndex] = useState(-1);
    const [clickedIndex, setClickedIndex] = useState(-1);
    const [coloredMeshes, setColoredMeshes] = useState<CustomMeshItem[]>();
    const [zoomedMeshes, setZoomedMeshes] = useState<string[]>();
    const [hideElementsPanel, setHideElementsPanel] = useState(true);

    const scenesConfig = mockVConfig as I3DScenesConfig;
    const scene = scenesConfig.configuration.scenes.find(
        (s) => s.id === mockSceneId
    );
    const [selectedScene, setSelectedScene] = useState(scene);
    if (!scene) {
        throw new Error('Bad scene definition ' + mockSceneId);
    }

    const makeMeshItems = (meshIds: string[]) => {
        const meshItems: CustomMeshItem[] = [];
        for (const id of meshIds) {
            meshItems.push({ meshId: id, color: '#ffff00' });
        }

        return meshItems;
    };

    const onHover = (e, index: number) => {
        e.stopPropagation();
        if (index !== hoveredIndex) {
            setHoveredIndex(index);
            const element = selectedScene.elements[index];
            if (element?.objectIDs) {
                setColoredMeshes(makeMeshItems(element.objectIDs as any));
            } else {
                setColoredMeshes([]);
            }
        }
    };

    const onClick = (e, index: number) => {
        e.stopPropagation();
        if (clickedIndex !== index) {
            setClickedIndex(index);
            const element = selectedScene.elements[index];
            if (element?.objectIDs) {
                setZoomedMeshes(element.objectIDs as any);
            } else {
                setZoomedMeshes([]);
                setColoredMeshes(null);
            }
        } else {
            setZoomedMeshes([]);
            setColoredMeshes(null);
        }
    };

    const options: IDropdownOption[] = [];
    for (const s of mockVConfig.configuration.scenes) {
        options.push({
            key: s.id,
            text: s.displayName,
            data: s,
            selected: s.id === mockSceneId
        });
    }

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ width: '100%', height: '600px', display: 'flex' }}>
            <div
                style={{
                    width: '250px',
                    height: '100%',
                    background: 'white',
                    fontFamily: 'sans-serif',
                    padding: '10px',
                    cursor: 'default',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div style={{ margin: '20px' }}>
                    <Checkbox
                        label="Show elements panel"
                        onChange={() =>
                            setHideElementsPanel(!hideElementsPanel)
                        }
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <Dropdown
                        options={options}
                        onChange={(_e, option) => setSelectedScene(option.data)}
                    />
                </div>
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        cursor: 'default',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    onMouseMove={(e) => onHover(e, -1)}
                    onClick={(e) => onClick(e, -1)}
                >
                    {selectedScene.elements.map((element, index) => (
                        <div
                            key={index}
                            style={{
                                padding: '10px',
                                cursor: 'default',
                                backgroundColor:
                                    hoveredIndex === index ? '#ccc' : ''
                            }}
                            onMouseMove={(e) => onHover(e, index)}
                            onClick={(e) => onClick(e, index)}
                        >
                            {element.displayName}
                        </div>
                    ))}
                </div>
            </div>
            <ADT3DViewer
                title="3D Viewer"
                theme={theme}
                locale={locale}
                adapter={new MockAdapter()}
                scenesConfig={scenesConfig}
                pollingInterval={10000}
                sceneId={selectedScene.id}
                connectionLineColor="#000"
                coloredMeshItems={coloredMeshes}
                zoomToMeshIds={zoomedMeshes}
                hideElementsPanel={hideElementsPanel}
            />
        </div>
    );
};

const addInDivStyle: React.CSSProperties = {
    width: 300,
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    background: 'white',
    border: '1px solid black',
    fontFamily: 'Segoe UI',
    display: 'flex',
    flexDirection: 'column'
};

export const AddIn = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    const scenesConfig = mockVConfig as I3DScenesConfig;
    const [data, setData] = useState<ADT3DAddInEventData>(null);
    const [twinIds, setTwinIds] = useState<string[]>([]);

    const processEvent = (data: ADT3DAddInEventData) => {
        const sceneVisuals = data.sceneVisuals;
        const mesh = data.mesh;
        const sceneVisual = sceneVisuals?.find((sceneVisual) =>
            sceneVisual.element.objectIDs.find((id) => id === mesh?.id)
        );

        const twins: string[] = [];
        if (sceneVisual) {
            for (const twinId in sceneVisual.twins) {
                const twin = sceneVisual.twins[twinId];
                twins.push(twin.$dtId);
            }
        }

        setTwinIds(twins);
        setData(data);
        return false;
    };

    const onSceneLoaded = (data: ADT3DAddInEventData) => {
        return processEvent(data);
    };

    const onMeshHover = (data: ADT3DAddInEventData) => {
        if (!data.mesh) {
            setData(null);
            return false;
        }

        return processEvent(data);
    };

    const onMeshClick = (data: ADT3DAddInEventData) => {
        return processEvent(data);
    };

    const addInProps: IADT3DAddInProps = {
        onSceneLoaded,
        onMeshHover,
        onMeshClick
    };

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            <ADT3DViewer
                title="3D Viewer"
                theme={theme}
                locale={locale}
                adapter={new MockAdapter()}
                scenesConfig={scenesConfig}
                pollingInterval={10000}
                sceneId={mockSceneId}
                connectionLineColor="#000"
                addInProps={addInProps}
            />
            {data && (
                <div style={addInDivStyle}>
                    <div>Event type: {data.eventType}</div>
                    <div>Twins:</div>
                    {twinIds.map((id, index) => (
                        <div key={index}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{id}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const Mock = (_args, { globals: { theme, locale } }) => {
    const scenesConfig = mockVConfig as I3DScenesConfig;

    return (
        <div style={{ width: '100%', height: '600px' }}>
            <ADT3DViewer
                title="3D Viewer (Mock Data)"
                theme={theme}
                locale={locale}
                adapter={new MockAdapter()}
                scenesConfig={scenesConfig}
                pollingInterval={10000}
                sceneId={mockSceneId}
                connectionLineColor="#000"
            />
        </div>
    );
};

export const MockWithHover = (_args, { globals: { theme, locale } }) => {
    const scenesConfig = mockVConfig as I3DScenesConfig;

    return (
        <div style={{ width: '100%', height: '600px' }}>
            <ADT3DViewer
                title="3D Viewer (Mock Data)"
                theme={theme}
                locale={locale}
                adapter={new MockAdapter()}
                scenesConfig={scenesConfig}
                pollingInterval={10000}
                sceneId={mockSceneId}
                showMeshesOnHover={true}
                connectionLineColor="#000"
            />
        </div>
    );
};

export const MockWithSelection = (_args, { globals: { theme, locale } }) => {
    const scenesConfig = mockVConfig as I3DScenesConfig;

    return (
        <div style={{ width: '100%', height: '600px' }}>
            <ADT3DViewer
                title="3D Viewer (Mock Data)"
                theme={theme}
                locale={locale}
                adapter={new MockAdapter()}
                scenesConfig={scenesConfig}
                pollingInterval={10000}
                sceneId={mockSceneId}
                enableMeshSelection={true}
                showHoverOnSelected={true}
                showMeshesOnHover={true}
                connectionLineColor="#000"
            />
        </div>
    );
};
