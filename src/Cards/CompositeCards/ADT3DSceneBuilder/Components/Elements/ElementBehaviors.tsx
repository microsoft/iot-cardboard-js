import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActionButton,
    Callout,
    DirectionalHint,
    FontIcon,
    IconButton,
    SearchBox,
    mergeStyleSets,
    PrimaryButton
} from '@fluentui/react';
import {
    BehaviorActionType,
    IADT3DSceneBuilderElementBehaviorProps
} from '../../ADT3DSceneBuilder.types';
import { Utils } from '../../../../../Models/Services';

const ElementBehaviors: React.FC<IADT3DSceneBuilderElementBehaviorProps> = ({
    behaviorState,
    onBehaviorClick,
    onCreateBehaviorWithElements,
    behaviorStateDispatch
}) => {
    const styles = mergeStyleSets({
        callout: {
            padding: '15px',
            width: '300px',
            background: '#ffffff'
        },
        title: {
            marginBottom: '15px',
            fontWeight: '500'
        },
        resultText: {
            fontSize: '12px',
            marginTop: '5px',
            opacity: '0.6'
        },
        item: {
            alignItems: 'center',
            display: 'flex',
            marginTop: '15px'
        },
        icon: {
            display: 'inline-block',
            fontSize: '16px'
        },
        name: {
            flex: '1',
            fontSize: '14px',
            paddingLeft: '8px'
        }
    });

    const { t } = useTranslation();
    const [searchText, setSearchText] = useState('');
    const [showAddBehavior, setShowAddBehavior] = useState(false);

    return (
        <div>
            <div className="cb-scene-builder-left-panel-element-behaviors">
                {behaviorState.behaviorsOnElement?.length === 0 && (
                    <div className="cb-scene-builder-element-behaviors-text">
                        {t('3dSceneBuilder.noBehaviorsOnElement')}
                    </div>
                )}
                {behaviorState.behaviorsOnElement.map((behavior) => {
                    return (
                        <div
                            id={behavior.id}
                            key={behavior.id}
                            className="cb-scene-builder-element-behavior-item"
                        >
                            <FontIcon
                                iconName={'Ringer'}
                                className="cb-scene-builder-element-behavior-item-icon"
                            />
                            <div className="cb-scene-builder-element-behavior-item-name">
                                {behavior.id}
                            </div>
                            <IconButton
                                title={t('more')}
                                ariaLabel={t('more')}
                                menuIconProps={{
                                    iconName: 'MoreVertical',
                                    style: {
                                        fontWeight: 'bold',
                                        fontSize: 18,
                                        color: 'black'
                                    }
                                }}
                                onMenuClick={() => {
                                    behaviorStateDispatch({
                                        type:
                                            BehaviorActionType.SET_BEHAVIOR_TO_EDIT,
                                        behavior: behavior
                                    });
                                }}
                                menuProps={{
                                    items: [
                                        {
                                            key: 'modify',
                                            text: t(
                                                '3dSceneBuilder.modifyBehavior'
                                            ),
                                            iconProps: { iconName: 'Edit' },
                                            onClick: () =>
                                                onBehaviorClick(behavior)
                                        },
                                        {
                                            key: 'remove',
                                            text: t(
                                                '3dSceneBuilder.removeBehavior'
                                            ),
                                            iconProps: {
                                                iconName: 'Delete'
                                            },
                                            onClick: () =>
                                                behaviorStateDispatch({
                                                    type:
                                                        BehaviorActionType.REMOVE_BEHAVIOR
                                                })
                                        }
                                    ]
                                }}
                            ></IconButton>
                        </div>
                    );
                })}
                <div>
                    <ActionButton
                        id="addBehavior"
                        className="cb-scene-builder-left-panel-add-behavior"
                        style={{ color: '#0b75c8' }}
                        onClick={() => setShowAddBehavior(true)}
                    >
                        {t('3dSceneBuilder.addBehaviorButton')}
                    </ActionButton>
                </div>
            </div>
            {showAddBehavior && (
                <Callout
                    className={styles.callout}
                    target="#addBehavior"
                    isBeakVisible={false}
                    directionalHint={DirectionalHint.bottomLeftEdge}
                    onDismiss={() => {
                        setShowAddBehavior(false);
                        behaviorStateDispatch({
                            type:
                                BehaviorActionType.SET_FILTERED_AVAILABLE_BEHAVIORS,
                            behaviors: behaviorState.availableBehaviors
                        });
                    }}
                >
                    <div>
                        <div className={styles.title}>
                            {t('3dSceneBuilder.addBehavior')}
                        </div>
                        <div>
                            <SearchBox
                                placeholder={t(
                                    '3dSceneBuilder.searchBehaviors'
                                )}
                                onChange={(event, value) => {
                                    setSearchText(value);
                                    behaviorStateDispatch({
                                        type:
                                            BehaviorActionType.SEARCH_AVAILABLE_BEHAVIORS,
                                        value: value
                                    });
                                }}
                            />
                        </div>
                        <div>
                            {behaviorState.filteredAvailableBehaviors
                                ?.length === 0 && (
                                <div className={styles.resultText}>
                                    {t('3dSceneBuilder.noAvailableBehaviors')}
                                </div>
                            )}
                            {behaviorState.filteredAvailableBehaviors.map(
                                (behavior) => {
                                    return (
                                        <div
                                            key={behavior.id}
                                            className={styles.item}
                                        >
                                            <FontIcon
                                                iconName={'Warning'}
                                                className={styles.icon}
                                            />
                                            <div className={styles.name}>
                                                {searchText
                                                    ? Utils.getMarkedHtmlBySearch(
                                                          behavior.id,
                                                          searchText
                                                      )
                                                    : behavior.id}
                                            </div>
                                            <IconButton
                                                iconProps={{
                                                    iconName: 'Add',
                                                    style: {
                                                        fontSize: 18,
                                                        color: 'black'
                                                    }
                                                }}
                                                onClick={() =>
                                                    behaviorStateDispatch({
                                                        type:
                                                            BehaviorActionType.ADD_BEHAVIOR,
                                                        behavior: behavior
                                                    })
                                                }
                                            />
                                        </div>
                                    );
                                }
                            )}
                        </div>
                        <PrimaryButton
                            styles={{
                                root: {
                                    marginTop: '16px'
                                }
                            }}
                            onClick={onCreateBehaviorWithElements}
                        >
                            {t('3dSceneBuilder.createBehavior')}
                        </PrimaryButton>
                    </div>
                </Callout>
            )}
        </div>
    );
};

export default ElementBehaviors;
