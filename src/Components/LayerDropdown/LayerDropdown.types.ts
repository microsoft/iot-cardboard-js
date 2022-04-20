import { ILayer } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export interface LayerDropdownProps {
    layers: ILayer[];
    selectedLayerIds: string[];
    setSelectedLayerIds: React.Dispatch<React.SetStateAction<string[]>>;
    showUnlayeredOption?: boolean;
}
