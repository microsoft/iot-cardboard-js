import React from 'react';
import { ActionButton } from '@fluentui/react/lib/Button';
import { 
    DetailsList, 
    DetailsListLayoutMode, 
    SelectionMode,
    DetailsRow,
    IDetailsListProps } from '@fluentui/react/lib/DetailsList';
import { Text } from '@fluentui/react/lib/Text';
import { IIconProps } from '@fluentui/react/lib/Icon';
import { Stack } from '@fluentui/react/lib/Stack';

const addIcon: IIconProps = { iconName: 'Add' };

interface ElementsListProps {
    t: (str: string) => string;
    noElementLabelKey: string;
    addElementLabelKey: string;
    elements: any[];
    handleNewElement: () => void;
    handleEditElement: (element: any, index: number) => void;
}

const ElementsList: React.FC<ElementsListProps> = ({ 
    t, 
    noElementLabelKey,
    addElementLabelKey,
    elements, 
    handleNewElement,
    handleEditElement
 }) => {
    const listTableColumns = [
        { 
            key: 'displayName',
            name: t('modelCreate.displayName'), 
            fieldName: 'displayName', 
            minWidth: 100, maxWidth: 300 
        }
    ];

    const renderListRow: IDetailsListProps['onRenderRow'] = props => 
        <DetailsRow {...props} />;

    return <Stack>
        {elements.length === 0 && <div className="cb-elementslist-empty">
                <Text>{t(noElementLabelKey)}</Text>
            </div>}
        {elements.length > 0 && <DetailsList
            selectionMode={SelectionMode.none}
            items={elements}
            columns={listTableColumns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            onRenderRow={renderListRow}
            onItemInvoked={(item, index) => handleEditElement(item, index)} />}
        <ActionButton 
            iconProps={addIcon}
            onClick={handleNewElement}>
            {t(addElementLabelKey)}
        </ActionButton>
    </Stack>;
};

export default ElementsList;