import { Dropdown } from '@fluentui/react';
import produce from 'immer';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ITwinToObjectMapping,
    DatasourceType
} from '../../../../../../Models/Classes/3DVConfig';
import { BehaviorFormContext } from '../BehaviorsForm';

const BehaviorFormElementsTab: React.FC<{
    elements: Array<ITwinToObjectMapping>;
    colorSelectedElements: (
        elementsToColor: Array<ITwinToObjectMapping>
    ) => any;
}> = ({ elements, colorSelectedElements }) => {
    const { t } = useTranslation();
    const { behaviorToEdit, setBehaviorToEdit } = useContext(
        BehaviorFormContext
    );

    return (
        <Dropdown
            label={t('3dSceneBuilder.behaviorElementsDropdownLabel')}
            selectedKey={
                behaviorToEdit?.datasources?.[0]?.mappingIDs?.[0] ?? undefined
            }
            onChange={(_ev, option) => {
                setBehaviorToEdit(
                    produce((draft) => {
                        // v1 datasources set to single TwinToObjectMappingDatasource
                        draft.datasources = [
                            {
                                type: DatasourceType.TwinToObjectMapping,
                                mappingIDs: [option.id], // v1 mappingIDs set to single element
                                messageFilter: '',
                                twinFilterQuery: '',
                                twinFilterSelector: ''
                            }
                        ];
                    })
                );

                // Color selected element mesh in scene
                const selectedElement = elements.find(
                    (el) => el.id === option.id
                );
                selectedElement && colorSelectedElements([selectedElement]);
            }}
            placeholder={t(
                '3dSceneBuilder.behaviorElementsDropdownPlaceholder'
            )}
            options={elements.map((el) => ({
                key: el.id,
                text: el.displayName,
                id: el.id,
                data: el
            }))}
        />
    );
};

export default BehaviorFormElementsTab;
