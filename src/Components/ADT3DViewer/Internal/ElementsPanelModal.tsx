import {
    ContextualMenu,
    IDragOptions,
    IModalStyles,
    Modal
} from '@fluentui/react';
import React, { memo } from 'react';
import { BaseComponentProps } from '../../BaseComponent/BaseComponent.types';
import ViewerElementsPanel from '../../ElementsPanel/ViewerElementsPanel';
import { ViewerElementsPanelProps } from '../../ElementsPanel/ViewerElementsPanel.types';

const ElementsPanelModal: React.FC<
    ViewerElementsPanelProps & BaseComponentProps
> = ({ theme, locale, isLoading, panelItems, onItemClick, onItemHover }) => {
    return (
        <Modal
            isOpen={true}
            isModeless={true}
            styles={modalStyles}
            dragOptions={dragOptions}
        >
            <ViewerElementsPanel
                baseComponentProps={{ theme, locale }}
                isLoading={isLoading}
                panelItems={panelItems}
                onItemClick={onItemClick}
                onItemHover={onItemHover}
            />
        </Modal>
    );
};

const modalStyles: Partial<IModalStyles> = {
    root: {
        justifyContent: 'start',
        '.ms-Dialog-title': { padding: '16px 24px 20px 24px' },
        alignItems: 'flex-start'
    },
    main: {
        background: 'transparent',
        left: 20,
        width: '300px !important',
        display: 'flex',
        maxHeight: 'unset',
        height: '100%',
        padding: '20px 0'
    },
    scrollableContent: {
        width: '100%',
        overflowY: 'hidden',
        '.ms-Dialog-inner': { padding: '0px 0px 24px' }
    }
};

const dragOptions: IDragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu
};

export default memo(ElementsPanelModal);
