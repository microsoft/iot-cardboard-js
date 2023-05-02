import React from 'react';
import { ISiteProps } from '../Models/Site.types';
import { getStyles } from './Site.styles';
// import Nav from '.Nav';
// import AssetExplorer from './AssetExplorer/Components/Main';

import { useLocation } from 'react-router-dom';

const Site: React.FC<ISiteProps> = ({ extensionClient }) => {
    if (extensionClient) {
        const styles = getStyles(); // do I need a theme?
        const location = useLocation();
        return (
            <div className={styles.root}>
                <header className={styles.header}></header>
                <Nav className={styles.nav} />
                <main className={styles.main}>
                    {location.pathname === '/'
                        ? EmptyMain()
                        : Explorer(location)}
                </main>
            </div>
        );
    } else {
        return <div>Site without client</div>;
    }
};

const EmptyMain = () => {
    return <div>Landing page goes here</div>;
};
const Explorer = (_location: any) => {
    return <div>Asset Explorer or KPI Explorer main UX</div>;
};

export default Site;
