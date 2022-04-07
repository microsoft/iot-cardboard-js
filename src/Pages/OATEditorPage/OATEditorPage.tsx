import React, { useState } from 'react';
import OATHeader from '../../Components/OATHeader/OATHeader';
import OATModelList from '../../Components/OATModelList/OATModelList';
import OATGraphViewer from '../../Components/OATGraphViewer/OATGraphViewer';
import OATPropertyEditor from '../../Components/OATPropertyEditor/OATPropertyEditor';
import { getEditorPageStyles } from './OATEditorPage.Styles';

const OATEditorPage = () => {
    const [elementHandler, setElementHandler] = useState([]);
    const EditorPageStyles = getEditorPageStyles();

    const onHandleElementsUpdate = (newElements) => {
        setElementHandler(newElements);
    };

    return (
        <div className={EditorPageStyles.container}>
            <OATHeader elements={elementHandler} />
            <div className={EditorPageStyles.component}>
                <OATModelList />
                <OATGraphViewer
                    onHandleElementsUpdate={onHandleElementsUpdate}
                />
                <OATPropertyEditor />
            </div>
        </div>
    );
};

export default React.memo(OATEditorPage);
