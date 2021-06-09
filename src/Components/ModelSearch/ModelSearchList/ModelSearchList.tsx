import { Separator } from '@fluentui/react';
import React from 'react';
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
    return (
        <div className="cb-msl-model-item">
            <div>
                <b>{item.name}</b>
            </div>
            <div>
                <i>{item.path}</i>
            </div>
            <div>
                <a href={item.html_url} target="_blank">
                    GitHub Link
                </a>
            </div>
            <Separator />
        </div>
    );
};

export default ModelSearchList;
