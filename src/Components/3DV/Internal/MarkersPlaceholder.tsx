import { useTheme } from '@fluentui/react';
import React from 'react';
import { Marker } from '../../../Models/Classes/SceneView.types';
import { getSceneViewStyles } from '../SceneView.styles';

interface MarkersPlaceholderProps {
    markers: Marker[];
}

export const MarkersPlaceholder: React.FC<MarkersPlaceholderProps> = ({
    markers
}) => {
    const theme = useTheme();
    const customStyles = getSceneViewStyles(theme);
    return (
        <div>
            {markers?.map((marker, index) => {
                return (
                    <div
                        id={marker.id}
                        key={index}
                        className={customStyles.placeholderMarkers}
                    >
                        {marker.UIElement}
                    </div>
                );
            })}
        </div>
    );
};
