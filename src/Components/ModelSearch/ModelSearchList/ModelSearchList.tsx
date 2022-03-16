import { PrimaryButton, DefaultButton, Separator } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StandardModelData } from '../../../Models/Classes/AdapterDataClasses/StandardModelData';
import { modelActionType } from '../../../Models/Constants';
import { IUseAdapter } from '../../../Models/Constants/Interfaces';
import './ModelSearchList.scss';

type ModelSearchListProps = {
    items: Array<any>;
    adapterState: IUseAdapter<StandardModelData>;
    primaryActionText?: string;
};

type ModelItemProps = {
    item: any;
    adapterState: IUseAdapter<StandardModelData>;
    primaryActionText?: string;
};

const ModelSearchList = ({
    items,
    adapterState,
    primaryActionText,
}: ModelSearchListProps) => {
    if (!items) {
        return null;
    }

    return (
        <div className={'cb-modelsearchlist-container'}>
            {items.length === 0 && (
                <Separator className={'cb-modelsearchlist-empty'}>
                    No results
                </Separator>
            )}
            {items.map((item, idx) => {
                return (
                    <ModelItem
                        item={item}
                        key={idx}
                        adapterState={adapterState}
                        primaryActionText={primaryActionText}
                    />
                );
            })}
        </div>
    );
};

const ModelItem = ({
    item,
    adapterState,
    primaryActionText,
}: ModelItemProps) => {
    const { t } = useTranslation();

    return (
        <>
            <div className={'cb-msl-model-item'}>
                <div className={'cb-msl-model-item-left'}>
                    <div>
                        <b>{item.dtmi}</b>
                    </div>
                    {item?.displayName && <div>{item.displayName}</div>}
                    {item?.description && (
                        <div>
                            <i>{item.description}</i>
                        </div>
                    )}
                </div>
                <div className={'cb-msl-model-item-right'}>
                    <DefaultButton
                        className={'cb-msl-model-item-preview'}
                        text={t('modelSearch.modelListItemPreview')}
                        onClick={() =>
                            adapterState.callAdapter({
                                dtmi: item.dtmi,
                                actionType: modelActionType.preview,
                            })
                        }
                    />
                    <PrimaryButton
                        text={
                            primaryActionText
                                ? primaryActionText
                                : t('modelSearch.modelListItemAction')
                        }
                        onClick={() =>
                            adapterState.callAdapter({
                                dtmi: item.dtmi,
                                actionType: modelActionType.select,
                            })
                        }
                    />
                </div>
            </div>
            <Separator />
        </>
    );
};

export default ModelSearchList;
