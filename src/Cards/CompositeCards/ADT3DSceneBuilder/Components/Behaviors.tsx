import { PrimaryButton } from '@fluentui/react/lib/components/Button/PrimaryButton/PrimaryButton';
import { FontIcon } from '@fluentui/react/lib/components/Icon/FontIcon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IBehavior } from '../../../../Models/Classes/3DVConfig';

interface Props {
    behaviors: Array<IBehavior>;
    onCreateBehaviorClick: () => any;
    onBehaviorClick: (behavior: IBehavior) => any;
}

const SceneBehaviors: React.FC<Props> = ({
    onCreateBehaviorClick,
    onBehaviorClick,
    behaviors
}) => {
    const { t } = useTranslation();

    return (
        <div className="cb-scene-builder-pivot-contents">
            <div className="cb-scene-builder-behavior-list">
                {behaviors.length === 0 ? (
                    <p className="cb-scene-builder-left-panel-text">
                        {t('3dSceneBuilder.noBehaviorsText')}
                    </p>
                ) : (
                    behaviors.map((behavior) => (
                        <div
                            className="cb-scene-builder-left-panel-behavior"
                            key={behavior.id}
                            onClick={() => onBehaviorClick(behavior)}
                        >
                            <FontIcon
                                iconName={'Shapes'}
                                className="cb-behavior-icon"
                            />
                            <span className="cb-scene-builder-behavior-name">
                                {behavior.id}
                            </span>
                        </div>
                    ))
                )}
            </div>
            <PrimaryButton
                className="cb-scene-builder-create-button"
                onClick={() => onCreateBehaviorClick()}
                text={t('3dSceneBuilder.createBehavior')}
            />
        </div>
    );
};

export default SceneBehaviors;
