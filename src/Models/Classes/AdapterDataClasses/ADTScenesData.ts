import { IAdapterData } from '../../Constants/Interfaces';
import { Marker } from '../SceneView.types';

export default class ADTScenesData implements IAdapterData {
    data: { markers: Marker[] };

    constructor(markers: Marker[]) {
        this.data = { markers: markers };
    }

    hasNoData() {
        return !this.data?.markers?.length;
    }
}
