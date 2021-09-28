import React, {useEffect, useState} from "react";
import {SceneView} from "../../Components/3DV/SceneView";
import * as BABYLON from 'babylonjs';
import { IADTAdapter } from "../../Models/Constants/Interfaces";
import { useAdapter } from '../../Models/Hooks';

interface ADT3DVCardProps {
  adapter: IADTAdapter;
  twinId: string;
}

export const ADT3DVCard: React.FC<ADT3DVCardProps> = ({ adapter, twinId }) => {
  const [modelUrl, setModelUrl] = useState('');
  const [labels, setLabels] = useState([]);

  const visualTwin = useAdapter({
    adapterMethod: () => adapter.getVisualADTTwin(twinId),
    refetchDependencies: [twinId],
    isLongPolling: true,
    pollingIntervalMillis: 10000
  });

  function visualTwinLoaded() {
    if (visualTwin.adapterResult.result?.data) {
      setModelUrl(visualTwin.adapterResult.result.data.modelUrl)
      setLabels(visualTwin.adapterResult.result.data.labels)
    }
  }

  useEffect(() => { visualTwinLoaded(); }, [visualTwin.adapterResult.result]);

  return (
    <div style={{ width: '800px', height: '800px', position: 'relative', fontFamily: 'sans-serif' }}>
      <SceneView modelUrl={modelUrl} labels={labels} cameraRadius={800} cameraCenter={new BABYLON.Vector3(0, 100, 0)} />
    </div>
  )
}