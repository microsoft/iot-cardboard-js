import React, { useEffect, useState } from 'react';
import BaseCompositeCard from '../../CompositeCards/BaseCompositeCard/Consume/BaseCompositeCard';
import { SceneListCardProps } from './SceneListCard.types';
import './SceneListCard.scss';
import { useAdapter } from '../../../Models/Hooks';
import { useTranslation } from 'react-i18next';
import {
    SelectionMode,
    DetailsListLayoutMode,
    DetailsRow,
    ActionButton,
    IDetailsListProps,
    DetailsList,
    IColumn,
    IconButton,
    IIconProps
} from '@fluentui/react';
import { FormMode } from '../../../Models/Constants/Enums';
import { Text } from '@fluentui/react/lib/Text';

const editIcon: IIconProps = { iconName: 'Edit' };
const deleteIcon: IIconProps = { iconName: 'Delete' };

const SceneListCard: React.FC<SceneListCardProps> = ({
    adapter,
    title,
    theme,
    locale,
    localeStrings,
    editSceneListCardClick,
    addNewSceneListCardClick,
    deleteSceneListCardClick,
    formControlMode = FormMode.Edit
}) => {
    const scenes = useAdapter({
        adapterMethod: () =>
            adapter.getADTTwinsByModelId({
                modelId: 'dtmi:com:visualontology:scene;1'
            }),
        refetchDependencies: [adapter]
    });

    const [sceneList, setSceneList] = useState([]);

    useEffect(() => {
        if (!scenes.adapterResult.hasNoData()) {
            setSceneList(scenes.adapterResult.getData().value);
        } else {
            setSceneList([]);
        }
    }, [scenes?.adapterResult]);

    const { t } = useTranslation();

    const renderListRow: IDetailsListProps['onRenderRow'] = (props) => (
        <div
            onClick={() => {
                editSceneListCardClick(
                    props.item,
                    props.itemIndex,
                    formControlMode
                );
            }}
        >
            <DetailsRow
                styles={{
                    cell: {
                        display: 'flex',
                        alignItems: 'center'
                    }
                }}
                className={`cb-elementslist-row ${
                    formControlMode === FormMode.Readonly
                        ? 'cb-readonly-row'
                        : ''
                }`}
                {...props}
            />
        </div>
    );

    function renderItemColumn(item: any, itemIndex: number, column: IColumn) {
        const fieldContent = item[column.fieldName] as string;
        switch (column.key) {
            case 'scene-action':
                return (
                    <>
                        <IconButton
                            iconProps={editIcon}
                            title={t('edit')}
                            ariaLabel={t('edit')}
                            onClick={(event) => {
                                event.stopPropagation();
                                editSceneListCardClick(item, itemIndex);
                            }}
                        />
                        <IconButton
                            iconProps={deleteIcon}
                            title={t('delete')}
                            ariaLabel={t('delete')}
                            onClick={(event) => {
                                event.stopPropagation();
                                deleteSceneListCardClick(itemIndex);
                            }}
                        />
                    </>
                );
            default:
                return <span>{fieldContent}</span>;
        }
    }

    return (
        <div className="cb-scenes-list-card-wrapper">
            <BaseCompositeCard
                theme={theme}
                title={title}
                locale={locale}
                localeStrings={localeStrings}
            >
                {sceneList.length > 0 ? (
                    <>
                        <div className="cb-scenes-list-action-buttons">
                            <ActionButton
                                iconProps={{ iconName: 'Add' }}
                                onClick={() => {
                                    if (addNewSceneListCardClick) {
                                        addNewSceneListCardClick();
                                    }
                                }}
                            >
                                {t('addNew')}
                            </ActionButton>
                        </div>

                        <div className="cb-scenes-list">
                            <DetailsList
                                selectionMode={SelectionMode.none}
                                items={sceneList}
                                columns={[
                                    {
                                        key: 'scene-name',
                                        name: t('sceneName'),
                                        minWidth: 100,
                                        onRender: (item) => (
                                            <span>
                                                {item.$dtId?.en ?? item.$dtId}
                                            </span>
                                        )
                                    },
                                    {
                                        key: 'scene-model',
                                        name: t('sceneModel'),
                                        minWidth: 100,
                                        onRender: (item) => (
                                            <span>
                                                {item.$metadata?.$model}
                                            </span>
                                        )
                                    },
                                    {
                                        key: 'scene-latitude',
                                        name: t('sceneLatitude'),
                                        minWidth: 100,
                                        onRender: (item) => item['latitude']
                                    },
                                    {
                                        key: 'scene-longitude',
                                        name: t('sceneLongitude'),
                                        minWidth: 100,
                                        onRender: (item) => item['longitude']
                                    },
                                    {
                                        key: 'scene-action',
                                        name: t('sceneAction'),
                                        fieldName: 'action',
                                        minWidth: 100
                                    }
                                ]}
                                setKey="set"
                                layoutMode={DetailsListLayoutMode.justified}
                                onRenderRow={renderListRow}
                                onRenderItemColumn={renderItemColumn}
                                onItemInvoked={(item, itemIndex) => {
                                    if (formControlMode === FormMode.Edit) {
                                        editSceneListCardClick(item, itemIndex);
                                    }
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <div className="cb-scenes-list-empty">
                        <Text>{t('noScenes')}</Text>
                        <ActionButton
                            onClick={() => {
                                if (addNewSceneListCardClick) {
                                    addNewSceneListCardClick();
                                }
                            }}
                        >
                            {t('addScene')}
                        </ActionButton>
                    </div>
                )}
            </BaseCompositeCard>
        </div>
    );
};

export default SceneListCard;
