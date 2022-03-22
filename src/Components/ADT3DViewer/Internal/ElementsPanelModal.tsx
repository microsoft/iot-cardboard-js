import {
    ContextualMenu,
    IDragOptions,
    IModalStyles,
    Modal
} from '@fluentui/react';
import React, { memo } from 'react';
import ElementsPanel from '../../ElementsPanel/ElementsPanel';
import { ElementsPanelProps } from '../../ElementsPanel/ElementsPanel.types';

const ElementsPanelModal: React.FC<ElementsPanelProps> = ({
    isLoading,
    panelItems,
    onItemClick,
    onItemHover
}) => {
    const modalStyles: Partial<IModalStyles> = {
        root: {
            width: 'unset',
            justifyContent: 'start',
            left: 20,
            '.ms-Dialog-title': { padding: '16px 24px 20px 24px' }
        },
        main: {
            width: '400px !important',
            minHeight: '400px !important'
        },
        scrollableContent: {
            width: '100%',
            height: '100%',
            '.ms-Dialog-inner': { padding: '0px 0px 24px' }
        }
    };

    const dragOptions: IDragOptions = {
        moveMenuItemText: 'Move',
        closeMenuItemText: 'Close',
        menu: ContextualMenu
    };

    return (
        <Modal
            isOpen={true}
            isBlocking={false}
            isModeless={true}
            styles={modalStyles}
            dragOptions={dragOptions}
        >
            <ElementsPanel
                isLoading={isLoading}
                panelItems={panelItems}
                onItemClick={onItemClick}
                onItemHover={onItemHover}
            />
        </Modal>
    );
};

export default memo(ElementsPanelModal);
