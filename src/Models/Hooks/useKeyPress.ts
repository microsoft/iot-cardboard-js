import { useEffect, useState } from 'react';

/**
 * Hook to easily listen for key presses in React components
 * @param targetKey key to attach listner to.  eg. 'ArrowLeft'
 * @param onPressedCallback Optional callback which is triggered when targetKey is pressed
 * @returns boolean flag indicating current press state of the targetKey.  This
 * will be true while the key is held down
 */
const useKeyPress = (targetKey: string, onPressedCallback?: () => void) => {
    const [keyPressed, setKeyPressed] = useState(false);

    useEffect(() => {
        const downHandler = ({ key }) => {
            if (key === targetKey) {
                onPressedCallback && onPressedCallback();
                setKeyPressed(true);
            }
        };

        const upHandler = ({ key }) => {
            if (key === targetKey) {
                setKeyPressed(false);
            }
        };

        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, [onPressedCallback, targetKey]);

    return keyPressed;
};

export default useKeyPress;
