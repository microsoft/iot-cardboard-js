import { IExtendedTheme } from '../../../../Theming/Theme.types';
import { ICustomNodeConfig } from '../../GraphTypes.types';
import { RectStyle } from '@antv/g6-react-node/dist/ReactNode/Shape/Rect';
import { TextStyle } from '@antv/g6-react-node/dist/ReactNode/Shape/Text';

export interface ICustomGraphNodeProps {
    cfg: ICustomNodeConfig;
}

export interface ICustomGraphNodeStyleProps {
    theme: IExtendedTheme;
}

export interface ICustomGraphNodeStyles {
    rootRect: RectStyle;
    nameText: TextStyle;
    idText: TextStyle;
}
