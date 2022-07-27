import { useTheme } from '@fluentui/react';
import React from 'react';
import { Marker } from '../../../Models/Classes/SceneView.types';
import { getSceneViewStyles } from '../SceneView.styles';

interface MarkersProps {
    markersAndPositions: { marker: Marker; left: number; top: number }[];
}

export const Markers: React.FC<MarkersProps> = ({ markersAndPositions }) => {
    const theme = useTheme();
    const customStyles = getSceneViewStyles(theme);
    return (
        <div>
            {markersAndPositions?.map((markerAndPosition, index) => {
                return (
                    <div
                        key={index}
                        className={customStyles.markers}
                        style={{
                            left: markerAndPosition.left,
                            top: markerAndPosition.top
                        }}
                    >
                        {markerAndPosition.marker.GroupedUIElement
                            ? markerAndPosition.marker.GroupedUIElement
                            : markerAndPosition.marker.UIElement}
                    </div>
                );
            })}
        </div>
    );
};
