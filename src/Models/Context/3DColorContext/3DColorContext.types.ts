import { ViewerMode } from '../../../Components/ModelViewerModePicker/ModelViewerModePicker';
import { IADTBackgroundColor, IADTObjectColor } from '../../Constants';

export interface I3DColorContextProviderProps {
    onOverrideColors: (overrideViewMode: ViewerMode) => string;
}

/**
 * A context used for overriding 3D color themes
 */
export interface I3DColorContext {
    onOverrideColors: (overrideViewMode: ViewerMode) => string;
}
