import React from 'react';
import useXeokitRender from '../../Models/Hooks/useXeokitRender';
import './BIMViewer.scss';

const BIMViewer: React.FC<any> = () => {
    useXeokitRender('TBDID');
    return (
        <div className="cb-bimviewer-container">
            <canvas id="TBDID"></canvas>
        </div>
    );
};

export default React.memo(BIMViewer);
