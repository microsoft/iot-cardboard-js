import { renderHook, act, cleanup } from '@testing-library/react-hooks';
import { MockAdapter } from '../../../Adapters';
import { defaultAllowedPropertyValueTypes } from '../../../Components/ModelledPropertyBuilder/ModelledPropertyBuilder.types';
import { useFlattenedModelProperties } from '../useFlattenedModelProperties';
import { IModelledPropertyBuilderAdapter } from '../../Constants/Interfaces';
import { PropertyValueType } from '../../Constants';

jest.mock('../../../i18n.ts', () => ({ t: () => 'testTranslation' }));

const getUseFlattenedModelPropertiesParams = (): {
    adapter: IModelledPropertyBuilderAdapter;
    allowedPropertyValueTypes: PropertyValueType[];
} => {
    return {
        adapter: new MockAdapter(),
        allowedPropertyValueTypes: defaultAllowedPropertyValueTypes
    };
};

afterEach(cleanup);

describe('useFlattenedModelProperties tests', () => {
    test('Testing return type', () => {
        const { result } = renderHook(() =>
            useFlattenedModelProperties(getUseFlattenedModelPropertiesParams())
        );
        const current = result.current;

        expect(current.isLoading).toBe(true);
        expect(current.flattenedModelProperties).toBe(null);
    });

    test.skip('Testing loading and data returned', async (done) => {
        const mockAdapter = new MockAdapter({
            networkTimeoutMillis: 1
        });
        const { result, waitForValueToChange } = renderHook(() =>
            useFlattenedModelProperties({
                adapter: mockAdapter,
                allowedPropertyValueTypes: defaultAllowedPropertyValueTypes
            })
        );
        const current = result.current;
        expect(current.isLoading).toBe(true);
        // See why is failing
        await waitForValueToChange(
            () => result.current.flattenedModelProperties
        );
        // expect(mockAdapter.getAllAdtModels).toHaveBeenCalled();
        expect(current.flattenedModelProperties).toBe([]);
        // expect(current.isLoading).toBe(false);
        done();
    });

    test('rendered component with useAdapter hook can safely unmount during adapter data fetch', async (done) => {
        const { unmount } = renderHook(() =>
            useFlattenedModelProperties(getUseFlattenedModelPropertiesParams())
        );
        act(() => {
            unmount();
        });
        done();
    });
});
