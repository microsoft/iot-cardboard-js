import React, { useState } from 'react';
import OATHeader from '../../Components/OATHeader/OATHeader';
import OATModelList from '../../Components/OATModelList/OATModelList';
import OATGraphViewer from '../../Components/OATGraphViewer/OATGraphViewer';
import OATPropertyEditor from '../../Components/OATPropertyEditor/OATPropertyEditor';
import { getEditorPageStyles } from './OATEditorPage.Styles';

const OATEditorPage = () => {
    const [elementHandler, setElementHandler] = useState([]);
    const EditorPageStyles = getEditorPageStyles();

    return (
        <div className={EditorPageStyles.container}>
            <OATHeader elements={elementHandler} />
            <div className={EditorPageStyles.component}>
                <OATModelList />
                <OATGraphViewer setElementHandler={setElementHandler} />
                <OATPropertyEditor />
            </div>
        </div>
    );
};

export default React.memo(OATEditorPage);
