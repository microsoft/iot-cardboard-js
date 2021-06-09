import { PrimaryButton, Separator } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import './ModelSearchList.scss';

type Props = {
    items: Array<any>;
};

const ModelSearchList = ({ items }: Props) => {
    if (!items) {
        return null;
    }

    return (
        <div className="cb-modelsearchlist-container">
            {items.length === 0 && (
                <Separator className="cb-modelsearchlist-empty">
                    No results
                </Separator>
            )}
            {items.map((item, idx) => {
                return <ModelItem item={item} key={idx} />;
            })}
        </div>
    );
};

const ModelItem = ({ item }) => {
    const { t } = useTranslation();
    return (
        <>
            <div className="cb-msl-model-item">
                <div className="cb-msl-model-item-left">
                    <div>
                        <b>{item.name}</b>
                    </div>
                    <div>
                        <i>{item.path}</i>
                    </div>
                    <div>
                        <a href={item.html_url} target="_blank">
                            {t('modelSearch.githubLink')}
                        </a>
                    </div>
                </div>
                <div className="cb-msl-model-item-right">
                    <PrimaryButton
                        text={t('modelSearch.modelListItemAction')}
                        onClick={() => null}
                    />
                </div>
            </div>
            <Separator />
        </>
    );
};

export default ModelSearchList;
