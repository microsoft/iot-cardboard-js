import { PrimaryButton } from '@fluentui/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ITwinToObjectMapping } from '../../../../../../Models/Classes/3DVConfig';
import { BehaviorFormContext } from '../BehaviorsForm';

const BehaviorFormElementsTab: React.FC<{
    elements: Array<ITwinToObjectMapping>;
    onManageElements: () => void;
}> = ({ elements, onManageElements }) => {
    const { t } = useTranslation();
    const { behaviorToEdit } = useContext(BehaviorFormContext);

    const selectedElements: ITwinToObjectMapping[] = [];

    behaviorToEdit?.datasources?.[0]?.mappingIDs?.forEach((id) => {
        const selectedElement = elements.find((element) => element?.id === id);
        selectedElements.push(selectedElement);
    });

    return (
        <div>
            <div>
                {selectedElements.map((element) => (
                    <div
                        key={element.id}
                        className="cb-scene-builder-behavior-elements"
                    >
                        {element.displayName}
                    </div>
                ))}
                <PrimaryButton
                    onClick={onManageElements}
                    text={t('3dSceneBuilder.manageTargetElements')}
                />
            </div>
        </div>
    );
};

export default BehaviorFormElementsTab;
