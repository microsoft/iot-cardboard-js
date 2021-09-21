import React, {useEffect, useState} from "react";
import {SceneView} from "../../Components/3DV/SceneView";
import * as BABYLON from 'babylonjs';
import { IADTAdapter } from "../../Models/Constants/Interfaces";
import SceneViewLabel from '../../Models/Classes/SceneViewLabel';
import { Parser } from "expr-eval";

interface ADT3DVCardProps {
  adapter: IADTAdapter;
  twinId: string;
}

export const ADT3DVCard: React.FC<ADT3DVCardProps> = ({ adapter, twinId }) => {
  const [modelUrl, setModelUrl] = useState('');
  const [labels, setLabels] = useState([]);

  async function getMediaTwin() {
    const twin = await adapter.getADTTwin(twinId);

    const src: string = twin?.result?.data?.MediaSrc;
    if (src) {
      setModelUrl(src);
    }

    const searchResults = await adapter.searchADTTwins({ searchTerm: 'visualstaterule' });      // TODO: Improve this query
    const vsrs = searchResults?.result?.data?.value?.filter((v) => v.$metadata?.BadgeValueExpression !== undefined);
    
    if (vsrs) {
      const labelsList: SceneViewLabel[] = [];
      const sourceTwins = {};
      for (const vsr of vsrs) {
        for (const src in vsr.SourceTwins) {
          const sourceTwin = await adapter.getADTTwin(vsr.SourceTwins[src]);
          sourceTwins[src] = sourceTwin.result.data;
        }
      }

      for (const vsr of vsrs) {
        const relationshipResult = await adapter.getRelationships(vsr.$dtId);
        for (const data of relationshipResult.result.data) {
          const relationship = await adapter.getADTRelationship(vsr.$dtId, data.relationshipId);
          const label = new SceneViewLabel();
          label.metric = vsr.BadgeValueExpression;
          vsr.BadgeColorExpression = vsr.BadgeColorExpression.replace('?', '>');  // HACK: correct the expression
          label.color = Parser.evaluate(vsr.BadgeColorExpression, sourceTwins) as any as string;
          label.value = Parser.evaluate(vsr.BadgeValueExpression, sourceTwins);
          label.meshId = relationship.result.data['MediaMemberProperties'].Position.id;
          labelsList.push(label);
        }
      }
      setLabels(labelsList);
    }
  }
 
  useEffect(() => { getMediaTwin(); }, []);

  return (
    <div style={{ width: '800px', height: '800px', position: 'relative', fontFamily: 'sans-serif' }}>
      <SceneView modelUrl={modelUrl} labels={labels} cameraRadius={800} cameraCenter={new BABYLON.Vector3(0, 100, 0)} />
    </div>
  )
}