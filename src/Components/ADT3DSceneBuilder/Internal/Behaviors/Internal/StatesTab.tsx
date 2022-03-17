import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import { BehaviorFormContext } from '../BehaviorsForm';
import {
    Dropdown,
    IDropdownOption,
    IStackTokens,
    Separator,
    Stack,
    Text,
    useTheme
} from '@fluentui/react';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import produce from 'immer';
import { IBehavior } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

const getStatusFromBehavior = (behavior: IBehavior) =>
    behavior.visuals.filter(ViewerConfigUtility.isStatusColorVisual)[0] || null;

const ROOT_LOC = '3dSceneBuilder.behaviorStatusForm';
const LOC_KEYS = {
    propertyDropdownLabel: `${ROOT_LOC}.propertyDropdownLabel`,
    stateItemLabel: `${ROOT_LOC}.stateItemLabel`,
    notice: `${ROOT_LOC}.notice`
};

const StatesTab: React.FC = () => {
    const { t } = useTranslation();
    const { behaviorToEdit, setBehaviorToEdit } = useContext(
        BehaviorFormContext
    );
    const [propertyOptions, setPropertyOptions] = useState<IDropdownOption[]>(
        []
    );
    const { config, sceneId, adapter } = useContext(SceneBuilderContext);

    useEffect(() => {
        adapter
            .getTwinPropertiesForBehaviorWithFullName(
                sceneId,
                config,
                behaviorToEdit
            )
            .then((properties) => {
                if (properties?.length) {
                    setPropertyOptions(
                        buildPropertyDropdownOptions(properties)
                    );
                }
            });
    }, [behaviorToEdit, behaviorToEdit.datasources, config, sceneId]);

    const onPropertyChange = useCallback(
        (_e, option: IDropdownOption) => {
            alert(option);
            setBehaviorToEdit(
                produce((draft) => {
                    // Assuming only 1 status visual per behavior
                    const stateVisual = getStatusFromBehavior(draft);
                    stateVisual.statusValueExpression = option.data;
                })
            );
        },
        [setBehaviorToEdit]
    );

    // we only grab the first Status in the config
    const stateVisual = getStatusFromBehavior(behaviorToEdit);
    const theme = useTheme();
    return (
        <Stack tokens={sectionStackTokens}>
            <Text styles={{ root: { color: theme.palette.neutralSecondary } }}>
                {t(LOC_KEYS.notice)}
            </Text>
            <Dropdown
                options={propertyOptions}
                onChange={onPropertyChange}
                defaultSelectedKey={propertyOptions?.[0]?.key}
                label={t(LOC_KEYS.propertyDropdownLabel)}
                errorMessage={!propertyOptions.length && 'No elements selected'}
            />
            <Separator />
            {/* TO DO: Implement for real */}
            {stateVisual?.statusValueRanges?.map((_x, index) => (
                <div>{t(LOC_KEYS.stateItemLabel, { index: index + 1 })}</div>
            ))}
        </Stack>
    );
};
const sectionStackTokens: IStackTokens = { childrenGap: 12 };
function buildPropertyDropdownOptions(properties: string[]): IDropdownOption[] {
    return properties.map((x) => ({
        key: x,
        data: x,
        text: x
    }));
}

export default StatesTab;
