import React, {useEffect, useState} from "react";
import {SceneView} from "../../Components/3DV/SceneView";
import * as BABYLON from 'babylonjs';
import { IADTAdapter } from "../../Models/Constants/Interfaces";
import SceneViewLabel from '../../Models/Classes/SceneViewLabel';

interface ADT3DVCardProps {
    adapter: IADTAdapter;
    twinId: string;
}

export const ADT3DVCard: React.FC<ADT3DVCardProps> = ({adapter, twinId}) => {

    const [modelUrl, setModelUrl] = useState('');
    const [labels, setLabels] = useState([]);
    useEffect(() => {
        async function getMediaTwin() {
            const twin = await adapter.getADTTwin(twinId);
            const src: string = twin?.result?.data?.MediaSrc;
            if (src) {
                setModelUrl(src);
            }

            const relationshipResult = await adapter.getRelationships(twinId);
            const labelsList: SceneViewLabel[] = [];

            for (const data of relationshipResult.result.data) {
                const relationship = await adapter.getADTRelationship(twinId, data.relationshipId);
                const targetTwin = await adapter.getADTTwin(relationship.result.data.$targetId);
                const label = new SceneViewLabel();
                label.targetId = relationship.result.data.$targetId;
                label.metric = relationship.result.data['MediaMemberProperties'].PropertyName;
                label.value = targetTwin.result.data[relationship.result.data['MediaMemberProperties'].PropertyName];
                label.meshId = relationship.result.data['MediaMemberProperties'].Position.id;
                labelsList.push(label);
            }

            setLabels(labelsList);
        }
        
        getMediaTwin();
    }, []);

    return (
        <div style={{width: '800px', height: '800px', position: 'relative', fontFamily: 'sans-serif'}}>
            <SceneView modelUrl={modelUrl} labels={labels} cameraRadius={800} cameraCenter={new BABYLON.Vector3(0, 100, 0)}/>
        </div>
    )
};