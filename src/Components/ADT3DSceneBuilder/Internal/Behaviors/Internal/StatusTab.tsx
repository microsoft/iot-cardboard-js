import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BehaviorFormContext } from '../BehaviorsForm';
import {
    IStackTokens,
    Separator,
    Stack,
    Text,
    useTheme
} from '@fluentui/react';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import produce from 'immer';
import {
    IBehavior,
    IStatusColoringVisual
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { IValueRangeBuilderHandle } from '../../../../ValueRangeBuilder/ValueRangeBuilder.types';
import ValueRangeBuilder from '../../../../ValueRangeBuilder/ValueRangeBuilder';
import { defaultStatusColorVisual } from '../../../../../Models/Classes/3DVConfig';
import { IValidityState, TabNames } from '../BehaviorForm.types';
import { deepCopy } from '../../../../../Models/Services/Utils';
import TwinPropertyDropown from './TwinPropertyDropdown';

const getStatusFromBehavior = (behavior: IBehavior) =>
    behavior.visuals.filter(ViewerConfigUtility.isStatusColorVisual)[0] || null;

const ROOT_LOC = '3dSceneBuilder.behaviorStatusForm';
const LOC_KEYS = {
    stateItemLabel: `${ROOT_LOC}.stateItemLabel`,
    notice: `${ROOT_LOC}.notice`,
    noElementsSelected: `${ROOT_LOC}.noElementsSelected`
};

interface IStatusTabProps {
    valueRangeRef: React.MutableRefObject<IValueRangeBuilderHandle>;
    onValidityChange: (tabName: TabNames, state: IValidityState) => void;
}
const StatusTab: React.FC<IStatusTabProps> = ({
    onValidityChange,
    valueRangeRef
}) => {
    const { t } = useTranslation();
    const { behaviorToEdit, setBehaviorToEdit } = useContext(
        BehaviorFormContext
    );

    const [areValueRangesValid, setAreValueRangesValid] = useState(true);

    const statusVisualToEdit =
        getStatusFromBehavior(behaviorToEdit) || defaultStatusColorVisual;

    const validateForm = useCallback(
        (visual: IStatusColoringVisual) => {
            let isValid = true;
            if (visual) {
                isValid = isValid && !!visual.statusValueExpression;
                // only look at the ranges when the expression is populated
                if (visual.statusValueExpression) {
                    isValid = isValid && areValueRangesValid;
                }
            }

            onValidityChange('Status', {
                isValid: isValid
            });
        },
        [areValueRangesValid, onValidityChange]
    );

    const setProperty = useCallback(
        (propertyName: keyof IStatusColoringVisual, value: string) => {
            setBehaviorToEdit(
                produce((draft) => {
                    // Assuming only 1 alert visual per behavior
                    let statusVisual = getStatusFromBehavior(draft);
                    // Edit flow
                    if (statusVisual) {
                        // selected the none option, clear the data
                        if (!value) {
                            const index = draft.visuals.indexOf(statusVisual);
                            draft.visuals.splice(index, 1);
                        } else {
                            statusVisual[propertyName] = value as any;
                        }
                    } else {
                        statusVisual = deepCopy(defaultStatusColorVisual);
                        statusVisual[propertyName] = value as any;
                        draft.visuals.push(statusVisual);
                    }
                    // check form validity
                    validateForm(statusVisual);
                })
            );
        },
        [setBehaviorToEdit]
    );

    // update validity when range validity changes
    useEffect(() => {
        validateForm(getStatusFromBehavior(behaviorToEdit));
    }, [areValueRangesValid, validateForm]);

    const onPropertyChange = useCallback(
        (option: string) => {
            setProperty('statusValueExpression', option);
        },
        [setProperty]
    );

    const theme = useTheme();
    const showRangeBuilder = !!statusVisualToEdit.statusValueExpression;
    return (
        <Stack tokens={sectionStackTokens}>
            <Text styles={{ root: { color: theme.palette.neutralSecondary } }}>
                {t(LOC_KEYS.notice)}
            </Text>
            <TwinPropertyDropown
                behavior={behaviorToEdit}
                defaultSelectedKey={statusVisualToEdit.statusValueExpression}
                dataTestId={'behavior-form-state-property-dropdown'}
                onChange={onPropertyChange}
            />
            {showRangeBuilder && <Separator />}
            {showRangeBuilder && (
                <ValueRangeBuilder
                    initialValueRanges={statusVisualToEdit.valueRanges}
                    minRanges={1}
                    ref={valueRangeRef}
                    setAreRangesValid={setAreValueRangesValid}
                />
            )}
        </Stack>
    );
};
const sectionStackTokens: IStackTokens = { childrenGap: 12 };

export default StatusTab;
