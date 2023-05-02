import React from 'react';

export interface INavProps {
    className?: string;
}

const Nav: React.FC<INavProps> = (props: INavProps) => {
    return <nav className={props.className}>Nav</nav>;
};

export default Nav;
