import {
    IDataSourceStepStyleProps,
    IDataSourceStepStyles
} from './DataSourceStep.types';
import { CardboardClassNamePrefix } from '../../../../../../Models/Constants';
import { CONTENT_HEIGHT } from '../../WizardShell.styles';

const classPrefix = `${CardboardClassNamePrefix}-datasourcestep`;
const classNames = {
    root: `${classPrefix}-root`,
    informationText: `${classPrefix}-information-text`
};

// export const DATASOURCESTEP_CLASS_NAMES = classNames;
export const getStyles = (
    _props: IDataSourceStepStyleProps
): IDataSourceStepStyles => {
    return {
        root: [
            classNames.root,
            {
                height: CONTENT_HEIGHT - 12 // Height - padding
            }
        ],
        informationText: [
            classNames.informationText,
            { fontSize: 12, opacity: 0.6 }
        ],
        subComponentStyles: {
            stack: {
                root: {
                    width: 360
                }
            },
            button: {
                root: {
                    position: 'absolute',
                    right: 16,
                    bottom: 0
                }
            }
        }
    };
};
