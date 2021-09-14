import React, {useEffect, useState} from "react";
import {SceneView} from "../../Components/3DV/SceneView";
import * as BABYLON from 'babylonjs';
import { IADTAdapter } from "../../Models/Constants/Interfaces";

interface ADT3DVCardProps {
    adapter: IADTAdapter;
}

export const ADT3DVCard: React.FC<ADT3DVCardProps> = ({adapter}) => {

    const [root, setRoot] = useState('');
    const [file, setFile] = useState('');

    useEffect(() => {
        async function getMediaTwin() {
            const twin = await adapter.getADTTwin('TankImage');
            if (twin && twin.result.data.MediaSrc) {
                // ToDo update props on twin to be root and file
                const splitMedia = twin.result.data.MediaSrc.split('/');
                setFile(splitMedia[splitMedia.length - 1]);
                splitMedia.pop();
                let rootUrl = '';
                splitMedia.forEach(item => {
                    rootUrl += (item + '/');
                });
                setRoot(rootUrl);
            }
        }
        getMediaTwin();
    });



    return (
        <div style={{width: '600px', height: '600px', position: 'relative', fontFamily: 'sans-serif'}}>
            <SceneView root={root} gtlfFile={file} cameraRadius={1000} cameraCenter={new BABYLON.Vector3(0, 100, 0)}/>
        </div>
    )
};