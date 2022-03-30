import React from 'react';
import OATHeader from '../../Components/OATHeader/OATHeader';
import OATModelList from '../../Components/OATModelList/OATModelList';
import OATGraphViewer from '../../Components/OATGraphViewer/OATGraphViewer';
import OATPropertyEditor from '../../Components/OATPropertyEditor/OATPropertyEditor';

import './OATEditorPage.scss';

const OATEditorPage = () => {
    return (
        <div className="cb-ontology-body-container">
            <OATHeader></OATHeader>
            <div className="cb-ontology-body-component">
                <OATModelList />
                <OATGraphViewer />
                <OATPropertyEditor />
            </div>
        </div>
    );
};

export default React.memo(OATEditorPage);
