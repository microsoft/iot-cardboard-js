import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontIcon, PrimaryButton } from '@fluentui/react';
import { TwinToObjectMapping } from '../../../../Models/Classes/3DVConfig';

const SceneElements: React.FC<any> = ({
    elements,
    onCreateElementClick,
    onElementClick,
    onElementEnter,
    onElementLeave
}) => {
    const { t } = useTranslation();

    return (
        <div className="cb-scene-builder-elements">
            <div className="cb-scene-builder-element-list">
                {elements.length === 0 ? (
                    <p className="cb-scene-builder-left-panel-text">
                        {t('3dSceneBuilder.noElementsText')}
                    </p>
                ) : (
                    elements.map((element: TwinToObjectMapping) => (
                        <div
                            className="cb-scene-builder-left-panel-element"
                            key={element.displayName}
                            onClick={() => onElementClick(element)}
                            onMouseEnter={() => onElementEnter(element)}
                            onMouseLeave={onElementLeave}
                        >
                            <FontIcon
                                iconName={'Shapes'}
                                className="cb-element"
                            />
                            <span className="cb-scene-builder-element-name">
                                {element.displayName}
                            </span>
                        </div>
                    ))
                )}
            </div>
            <PrimaryButton
                className="cb-scene-builder-create-element-button"
                onClick={onCreateElementClick}
                text={t('3dSceneBuilder.createElement')}
            />
        </div>
    );
};

export default SceneElements;
