import {
    ContextualMenu,
    IDragOptions,
    IModalStyles,
    Modal
} from '@fluentui/react';
import React, { memo } from 'react';
import { BaseComponentProps } from '../../BaseComponent/BaseComponent.types';
import ElementsPanel from '../../ElementsPanel/ElementsPanel';
import { ElementsPanelProps } from '../../ElementsPanel/ElementsPanel.types';

const ElementsPanelModal: React.FC<ElementsPanelProps & BaseComponentProps> = ({
    theme,
    locale,
    isLoading,
    panelItems,
    onItemClick,
    onItemHover
}) => {
    const modalStyles: Partial<IModalStyles> = {
        root: {
            justifyContent: 'start',
            '.ms-Dialog-title': { padding: '16px 24px 20px 24px' }
        },
        main: {
            background: 'transparent',
            left: 20,
            width: '400px !important',
            minHeight: '400px !important',
            display: 'flex'
        },
        scrollableContent: {
            width: '100%',
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
            isModeless={true}
            styles={modalStyles}
            dragOptions={dragOptions}
        >
            <ElementsPanel
                baseComponentProps={{ theme, locale }}
                isLoading={isLoading}
                panelItems={panelItems}
                onItemClick={onItemClick}
                onItemHover={onItemHover}
            />
        </Modal>
    );
};

export default memo(ElementsPanelModal);
