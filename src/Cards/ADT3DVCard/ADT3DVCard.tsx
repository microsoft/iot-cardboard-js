import React, {useEffect, useState} from "react";
import {SceneView} from "../../Components/3DV/SceneView";
import * as BABYLON from 'babylonjs';
import { IADTAdapter } from "../../Models/Constants/Interfaces";
import SceneViewLabel from '../../Models/Classes/SceneViewLabel';
import SceneViewData from "../../Models/Classes/SceneViewData";

interface ADT3DVCardProps {
    adapter: IADTAdapter;
    twinId: string;
}

export const ADT3DVCard: React.FC<ADT3DVCardProps> = ({adapter, twinId}) => {

    let root: string;;
    let file: string;
    const labels: SceneViewLabel[] = [];
    const [sceneViewData, setSceneViewData] = useState(new SceneViewData());
    useEffect(() => {
        async function getMediaTwin() {
            const twin = await adapter.getADTTwin(twinId);
            const src: string = twin?.result?.data?.MediaSrc;
            if (src) {
                const n = src.lastIndexOf('/') + 1;
                root = src.substring(0, n);
                file = src.substring(n);
            }

            const relationshipResult = await adapter.getRelationships(twinId);

            for (const data of relationshipResult.result.data) {
                const relationship = await adapter.getADTRelationship(twinId, data.relationshipId);
                const targetTwin = await adapter.getADTTwin(relationship.result.data.$targetId);
                const label = new SceneViewLabel();
                label.targetId = relationship.result.data.$targetId;
                label.metric = relationship.result.data['MediaMemberProperties'].PropertyName;
                label.value = targetTwin.result.data[relationship.result.data['MediaMemberProperties'].PropertyName];
                label.meshId = relationship.result.data['MediaMemberProperties'].Position.id;
                labels.push(label);
            }

            const data: SceneViewData = new SceneViewData();
            data.modelRoot = root;
            data.modelFile = file;
            data.labels = labels;
            data.cameraRadius = 800;
            data.cameraCenter = new BABYLON.Vector3(0, 100, 0);

            setSceneViewData(data);
        }
        
        getMediaTwin();
    }, []);

    return (
        <div style={{width: '800px', height: '800px', position: 'relative', fontFamily: 'sans-serif'}}>
            <SceneView data={sceneViewData}/>
        </div>
    )
};