import { BehaviorModalMode } from '../../Models/Constants/Enums';
import { DTwin } from '../../Models/Constants/Interfaces';
import { IExpressionRangeVisual } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export type StatusPillsContainerWidth = 'compact' | 'wide';

export interface IStatusPillsProps {
    /**
     * Visuals values required to calulate amount of pills and color
     */
    statusVisuals: IExpressionRangeVisual[];
    /**
     * Twins context values required to calculate pill color
     */
    twins: Record<string, DTwin>;
    /**
     * Width of the container, compact adds small margin, wide sets to specific width
     */
    width: StatusPillsContainerWidth;
    /**
     * Mode
     */
    mode?: BehaviorModalMode;
}
