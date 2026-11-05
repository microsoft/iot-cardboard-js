import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import BlobDropdown from './BlobDropdown';
import { BlobDropdownProps } from './BlobDropdown.types';
import { IStorageBlob } from '../../Models/Constants/Interfaces';

const mockAdapterResult = {
    hasNoData: () => false,
    result: { data: [] as Array<IStorageBlob> }
};

jest.mock('../../Models/Hooks/useAdapter', () => ({
    __esModule: true,
    default: () => ({
        adapterResult: mockAdapterResult,
        isLoading: false
    })
}));

jest.mock('../BaseComponent/BaseComponent', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => children ?? null
}));

const fileTypes = ['glb', 'gltf'];
const adapter = {} as BlobDropdownProps['adapter'];

beforeEach(() => {
    mockAdapterResult.result.data = [];
});

const renderDropdown = (onChange = jest.fn()) =>
    render(
        <BlobDropdown
            adapter={adapter}
            fileTypes={fileTypes}
            hasLabel={false}
            onChange={onChange}
        />
    );

test('rejects a native Babylon URL disguised by its query string', async () => {
    const onChange = jest.fn();
    renderDropdown(onChange);
    const input = screen.getByRole('combobox');

    fireEvent.focus(input);
    fireEvent.input(input, {
        target: {
            value:
                'https://storage.blob.core.windows.net/scenes/scene.babylon?format=.glb'
        }
    });
    fireEvent.blur(input);

    expect(
        await screen.findByText('blobDropdown.invalidBlobUrlPath')
    ).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
});

test.each(['https', 'http'])(
    'preserves the query when accepting an %s model URL',
    async (protocol) => {
        const onChange = jest.fn();
        renderDropdown(onChange);
        const input = screen.getByRole('combobox');

        fireEvent.focus(input);
        fireEvent.input(input, {
            target: {
                value: `${protocol}://storage.blob.core.windows.net/scenes/model.glb?sig=keep%2Bvalue`
            }
        });
        fireEvent.blur(input);

        await waitFor(() =>
            expect(onChange).toHaveBeenCalledWith(
                'https://storage.blob.core.windows.net/scenes/model.glb?sig=keep%2Bvalue'
            )
        );
        expect(
            screen.queryByText('blobDropdown.invalidBlobUrlPath')
        ).not.toBeInTheDocument();
    }
);

test('offers only listed blobs with a supported pathname extension', async () => {
    mockAdapterResult.result.data = [
        {
            Name: 'model.part.glb',
            Path: 'https://storage.blob.core.windows.net/scenes/model.part.glb',
            Properties: { 'Content-Length': 42 }
        },
        {
            Name: 'hidden.glb.babylon',
            Path:
                'https://storage.blob.core.windows.net/scenes/hidden.glb.babylon',
            Properties: {}
        },
        {
            Name: 'query.babylon',
            Path:
                'https://storage.blob.core.windows.net/scenes/query.babylon?format=.glb',
            Properties: {}
        }
    ];
    const onChange = jest.fn();
    renderDropdown(onChange);

    fireEvent.keyDown(screen.getByRole('combobox'), {
        key: 'ArrowDown',
        keyCode: 40,
        which: 40,
        altKey: true
    });
    const option = await screen.findByText('model.part.glb');
    expect(screen.queryByText('hidden.glb.babylon')).not.toBeInTheDocument();
    expect(screen.queryByText('query.babylon')).not.toBeInTheDocument();

    fireEvent.click(option);
    expect(onChange).toHaveBeenCalledWith(
        'https://storage.blob.core.windows.net/scenes/model.part.glb'
    );
});
