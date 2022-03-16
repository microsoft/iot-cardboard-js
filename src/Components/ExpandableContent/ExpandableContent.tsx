import './ExpandableContent.scss';
import React from 'react';
import { CSSTransition } from 'react-transition-group';

type Props = {
    children: React.ReactNode;
    isExpanded: boolean;
};

const ExpandableSlideInContent = ({ children, isExpanded }: Props) => {
    return (
        <CSSTransition
            classNames={"cb-expandable"}
            in={isExpanded}
            unmountOnExit
            timeout={400}
        >
            {children}
        </CSSTransition>
    );
};

export default React.memo(ExpandableSlideInContent);
