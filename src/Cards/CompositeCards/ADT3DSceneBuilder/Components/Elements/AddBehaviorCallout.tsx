import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Callout,
    DirectionalHint,
    FontIcon,
    SearchBox,
    mergeStyleSets,
    PrimaryButton
} from '@fluentui/react';
import { Utils } from '../../../../../Models/Services';
import { IBehavior } from '../../../../../Models/Classes/3DVConfig';
import { IADT3DSceneBuilderAddBehaviorCalloutProps } from '../../ADT3DSceneBuilder.types';

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
        marginTop: '15px',
        cursor: 'pointer'
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

const AddBehaviorCallout: React.FC<IADT3DSceneBuilderAddBehaviorCalloutProps> = ({
    availableBehaviors,
    target,
    id,
    addBehaviorToElement,
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
        <Callout
            className={styles.callout}
            target={`#${target}`}
            isBeakVisible={false}
            directionalHint={DirectionalHint.bottomLeftEdge}
            onDismiss={() => hideCallout()}
        >
            <div>
                <div className={styles.title}>
                    {t('3dSceneBuilder.addBehavior')}
                </div>
                <div>
                    <SearchBox
                        id={id}
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
                            <div
                                key={behavior.id}
                                className={styles.item}
                                onClick={() => addBehaviorToElement(behavior)}
                                onKeyPress={(e) => {
                                    if (e.key === ' ') {
                                        addBehaviorToElement(behavior);
                                    }
                                }}
                                tabIndex={0}
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
                            </div>
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
        </Callout>
    );
};

export default AddBehaviorCallout;
