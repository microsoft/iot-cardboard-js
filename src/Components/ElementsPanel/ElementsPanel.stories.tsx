import React from 'react';
import ElementsPanel from './ElementsPanel';

const componentStyle = {
    height: '800px',
    width: '400px'
};

export default {
    title: 'Components/ElementsPanel',
    component: ElementsPanel
};

// TODO fix these
export const ViewerElementsPanel = () => {
    return (
        <div style={componentStyle}>
            <ElementsPanel
                panelItems={[]}
                onItemClick={(item, meshIds) => console.log(item, meshIds)}
                onItemHover={(item) => console.log(item.type)}
            />
        </div>
    );
};
