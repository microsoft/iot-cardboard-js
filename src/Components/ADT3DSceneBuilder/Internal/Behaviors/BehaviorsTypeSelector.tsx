import { Text } from '@fluentui/react';
import React, { useContext, useEffect, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { ADT3DSceneBuilderMode } from '../../../../Models/Constants';
import { CardboardList } from '../../../CardboardList';
import { ICardboardListItem } from '../../../CardboardList/CardboardList.types';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import { SET_ADT_SCENE_BUILDER_MODE } from '../../ADT3DSceneBuilder.types';
import LeftPanelBuilderHeader from '../LeftPanelBuilderHeader';

interface IBehaviorTypeSelectorProps {
    item: string;
}
enum BehaviorType {
    Alert = 'Alert',
    Status = 'Status'
}
interface IBehaviorType {
    name: string;
}
const BehaviorTypeSelector: React.FC<IBehaviorTypeSelectorProps> = ({
    item
}) => {
    const [listItems, setListItems] = useState<
        ICardboardListItem<IBehaviorType>[]
    >([]);
    const { t } = useTranslation();
    const { dispatch } = useContext(SceneBuilderContext);

    const onTypeSelect = (type: BehaviorType) => {
        // TODO: set the selected type in state
        dispatch({
            type: SET_ADT_SCENE_BUILDER_MODE,
            payload: ADT3DSceneBuilderMode.CreateBehavior
        });
    };

    // generate the list of items to show - In Scene
    useEffect(() => {
        const listItems = getListItems(onTypeSelect, t);
        setListItems(listItems);
    }, [onTypeSelect]);

    return (
        <div>
            <LeftPanelBuilderHeader
                headerText={'New behavior'}
                subHeaderText={'Select behavior type'}
                iconName={undefined}
            />
            <CardboardList<IBehaviorType>
                items={listItems}
                listKey={'behaviors-type-selector'}
            />
        </div>
    );
};

function getListItems(
    onSelect: (type: BehaviorType) => void,
    _t: TFunction<string>
): ICardboardListItem<IBehaviorType>[] {
    const statusItem: IBehaviorType = {
        name: 'something'
    };
    const statusListItem: ICardboardListItem<IBehaviorType> = {
        ariaLabel: '',
        iconStartName: 'Ringer',
        item: statusItem,
        textPrimary: 'Status',
        textSecondary: 'A logical expression-based notification',
        onClick: () => onSelect(BehaviorType.Status)
    };
    const alertItem: IBehaviorType = {
        name: 'something'
    };
    const alertListItem: ICardboardListItem<IBehaviorType> = {
        ariaLabel: '',
        iconStartName: 'Info',
        item: alertItem,
        textPrimary: 'Alert',
        textSecondary: 'A visual state of the target elements',
        onClick: () => onSelect(BehaviorType.Alert)
    };
    return [statusListItem, alertListItem];
}

export default BehaviorTypeSelector;
