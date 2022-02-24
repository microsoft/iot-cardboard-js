import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ITwinToObjectMapping } from '../../../../Models/Classes/3DVConfig';

interface ContextualMenuProps {
    elements: Array<ITwinToObjectMapping>;
}

const ContextualMenu: React.FC<ContextualMenuProps> = ({ elements }) => {
    const { t } = useTranslation();

    useEffect(() => {
        // work out if mesh is in an element
    }, [elements]);

    return <div>Hello</div>;
};

export default ContextualMenu;
