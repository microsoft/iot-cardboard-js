import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DirectionalHint,
    FontIcon,
    SearchBox,
    mergeStyleSets,
    PrimaryButton,
    ActionButton,
    FocusTrapCallout
} from '@fluentui/react';
import { Utils } from '../../../../Models/Services';
import { IBehavior } from '../../../../Models/Classes/3DVConfig';
import { IADT3DSceneBuilderAddBehaviorCalloutProps } from '../../ADT3DSceneBuilder.types';

const styles = mergeStyleSets({
    callout: {
        padding: '15px',
        width: '300px',
        background: '#ffffff'
    },
    title: {
        marginTop: '0px'
    },
    resultText: {
        fontSize: '12px',
        marginTop: '5px',
        opacity: '0.6'
    },
    item: {
        alignItems: 'center',
        display: 'flex',
        marginTop: '15px',
        width: '100%',
        height: 'auto'
    },
    icon: {
        display: 'inline-block',
        fontSize: '16px'
    },
    name: {
        flex: '1',
        fontSize: '14px',
        paddingLeft: '8px',
        textAlign: 'start'
    }
});

const AddBehaviorCallout: React.FC<IADT3DSceneBuilderAddBehaviorCalloutProps> = ({
    availableBehaviors,
    calloutTarget,
    calloutId,
    onAddBehavior,
    onCreateBehaviorWithElements,
    hideCallout
}) => {
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState('');
    const [
        filteredAvailableBehaviors,
        setFilteredAvailableBehaviors
    ] = useState<Array<IBehavior>>([]);

    useEffect(() => {
        setFilteredAvailableBehaviors(availableBehaviors);
    }, [availableBehaviors]);

    const searchBehaviors = (searchTerm: string) => {
        setFilteredAvailableBehaviors(
            availableBehaviors.filter((behavior) =>
                behavior.id.toLowerCase().includes(searchTerm)
            )
        );
    };

    return (
        <FocusTrapCallout
            className={styles.callout}
            target={`#${calloutTarget}`}
            isBeakVisible={false}
            directionalHint={DirectionalHint.bottomLeftEdge}
            onDismiss={hideCallout}
        >
            <div>
                <h4 className={styles.title}>
                    {t('3dSceneBuilder.addBehavior')}
                </h4>
                <div>
                    <SearchBox
                        id={calloutId}
                        placeholder={t('3dSceneBuilder.searchBehaviors')}
                        onChange={(event, value) => {
                            setSearchText(value);
                            searchBehaviors(value);
                        }}
                    />
                </div>
                <div>
                    {filteredAvailableBehaviors?.length === 0 && (
                        <div className={styles.resultText}>
                            {t('3dSceneBuilder.noAvailableBehaviors')}
                        </div>
                    )}
                    {filteredAvailableBehaviors.map((behavior) => {
                        return (
                            <ActionButton
                                key={behavior.id}
                                className={styles.item}
                                onClick={() => onAddBehavior(behavior)}
                                tabIndex={0}
                                styles={{
                                    flexContainer: {
                                        width: '100%'
                                    }
                                }}
                                style={{
                                    color: 'var(--cb-color-text-primary)'
                                }}
                            >
                                <FontIcon
                                    iconName={'Ringer'}
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
                                <FontIcon
                                    iconName="Add"
                                    className={styles.icon}
                                />
                            </ActionButton>
                        );
                    })}
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
        </FocusTrapCallout>
    );
};

export default AddBehaviorCallout;
