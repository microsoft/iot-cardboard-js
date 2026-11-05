import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import axios from 'axios';
import SceneView from './SceneView';

jest.mock('@babylonjs/core/Legacy/legacy', () => ({
    ...jest.requireActual<typeof BABYLON>('@babylonjs/core/Legacy/legacy'),
    Engine: jest.fn().mockImplementation(() => ({
        resize: jest.fn(),
        dispose: jest.fn()
    }))
}));

jest.mock('axios');

jest.mock('../IllustrationMessage/IllustrationMessage', () => ({
    __esModule: true,
    default: ({ descriptionText }: { descriptionText: React.ReactNode }) => (
        <div>{descriptionText}</div>
    )
}));

const mockAxios = axios as jest.MockedFunction<typeof axios>;
const originalResizeObserver = window.ResizeObserver;
const loadScene = BABYLON.SceneLoader.Load.bind(BABYLON.SceneLoader);
const errorMessage =
    'scenePageErrorHandling.sceneView.3dAssetLoadingGenericErrorMessage';
let loadSpy: jest.SpyInstance;

beforeAll(() => {
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn()
    }));
});

afterAll(() => {
    window.ResizeObserver = originalResizeObserver;
});

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
    mockAxios.mockResolvedValue({
        data: null,
        status: 200,
        statusText: 'OK',
        headers: { 'last-modified': 'Tue, 03 Nov 2026 00:00:00 GMT' },
        config: {}
    });
    loadSpy = jest.spyOn(BABYLON.SceneLoader, 'Load').mockReturnValue(null);
});

afterEach(() => {
    jest.restoreAllMocks();
});

test.each(['scene.babylon?format=.glb', 'scene.glb.babylon?format=.glb'])(
    'rejects a configuration asset named %s before auth or download',
    async (filename) => {
        const getToken = jest.fn().mockResolvedValue('test-storage-token');
        render(
            <SceneView
                modelUrl={`https://storage.blob.core.windows.net/scenes/${filename}`}
                getToken={getToken}
            />
        );

        expect(await screen.findByText(errorMessage)).toBeInTheDocument();
        expect(getToken).not.toHaveBeenCalled();
        expect(mockAxios).not.toHaveBeenCalled();
        expect(BABYLON.Engine).not.toHaveBeenCalled();
        expect(loadSpy).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith(
            'Error loading model: unsupported 3D asset file extension.'
        );
    }
);

test.each([
    [
        'https://storage.blob.core.windows.net/scenes/model.glb?sig=keep%2Bvalue%2Fmore%3D&path=/native.babylon#camera',
        'https://storage.blob.core.windows.net/scenes/model.glb?sig=keep%2Bvalue%2Fmore%3D&path=%2Fnative.babylon&lastModified=2026-11-03T00%3A00%3A00.000Z',
        '.glb'
    ],
    [
        'https://storage.blob.core.windows.net/scenes/MODEL.GLTF#camera',
        'https://storage.blob.core.windows.net/scenes/MODEL.GLTF?lastModified=2026-11-03T00%3A00%3A00.000Z',
        '.gltf'
    ],
    [
        'https://storage.blob.core.windows.net/scenes/model.glb?lastModified=old&sig=keep%2Bvalue',
        'https://storage.blob.core.windows.net/scenes/model.glb?lastModified=2026-11-03T00%3A00%3A00.000Z&sig=keep%2Bvalue',
        '.glb'
    ]
])(
    'pins the safe loader for %s and preserves its query values',
    async (url, loadedUrl, extension) => {
        render(<SceneView modelUrl={url} />);

        await waitFor(() => expect(loadSpy).toHaveBeenCalledTimes(1));
        const [root, filename, , , , , pluginExtension] = loadSpy.mock.calls[0];
        expect(root + filename).toBe(loadedUrl);
        expect(pluginExtension).toBe(extension);
    }
);

test('fails closed when the glTF loader is unavailable', async () => {
    jest.spyOn(
        BABYLON.SceneLoader,
        'IsPluginForExtensionAvailable'
    ).mockReturnValue(false);
    const getToken = jest.fn().mockResolvedValue('test-storage-token');
    render(
        <SceneView
            modelUrl="https://storage.blob.core.windows.net/scenes/model.glb"
            getToken={getToken}
        />
    );

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    expect(getToken).not.toHaveBeenCalled();
    expect(mockAxios).not.toHaveBeenCalled();
    expect(loadSpy).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
        'Error loading model: the required glTF loader is unavailable.'
    );
});

test('shows a normal loading error when a supported asset fails glTF parsing', async () => {
    render(
        <SceneView modelUrl="https://storage.blob.core.windows.net/scenes/model.glb" />
    );
    await waitFor(() => expect(loadSpy).toHaveBeenCalledTimes(1));

    act(() => {
        const onError = loadSpy.mock.calls[0][5];
        onError(null, 'Invalid glTF', new Error('Invalid glTF'));
    });

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
});

test.each(['glb', 'gltf'])(
    'does not deserialize native Babylon actions in a renamed %s asset',
    async (extension) => {
        const parseActions = jest.spyOn(BABYLON.ActionManager, 'Parse');
        const activatedPlugin = jest.fn();
        const observer = BABYLON.SceneLoader.OnPluginActivatedObservable.add(
            activatedPlugin
        );
        const engine = new BABYLON.NullEngine();
        const nativeScene = JSON.stringify({
            meshes: [],
            actions: { name: 'ActionManager', type: 3, children: [] }
        });
        loadSpy.mockImplementation(
            (
                root,
                _filename,
                _engine,
                onSuccess,
                onProgress,
                onError,
                pluginExtension
            ) =>
                loadScene(
                    root,
                    `data:${nativeScene}`,
                    engine,
                    onSuccess,
                    onProgress,
                    onError,
                    pluginExtension
                )
        );
        const { unmount } = render(
            <SceneView
                modelUrl={`https://storage.blob.core.windows.net/scenes/model.${extension}`}
            />
        );

        try {
            expect(await screen.findByText(errorMessage)).toBeInTheDocument();
            expect(loadSpy).toHaveBeenCalledTimes(1);
            expect(activatedPlugin).toHaveBeenCalledTimes(1);
            expect(activatedPlugin.mock.calls[0][0]).toMatchObject({
                name: 'gltf'
            });
            expect(parseActions).not.toHaveBeenCalled();
        } finally {
            unmount();
            BABYLON.SceneLoader.OnPluginActivatedObservable.remove(observer);
            engine.dispose();
        }
    }
);
