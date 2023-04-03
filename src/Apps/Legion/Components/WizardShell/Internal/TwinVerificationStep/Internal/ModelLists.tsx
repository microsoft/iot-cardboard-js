import React from 'react';
import { Checkbox, mergeStyleSets, Separator } from '@fluentui/react';
import { useWizardNavigationContext } from '../../../../../Models/Context/WizardNavigationContext/WizardNavigationContext';
import { useExtendedTheme } from '../../../../../../../Models/Hooks/useExtendedTheme';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IModelListsProps {}

const getRandomColor = () => {
    // Number between 1-5
    const colorNumber = Math.floor(Math.random() * 5);
    const colors = ['red', 'blue', 'yellow', 'green', 'orange'];
    return colors[colorNumber];
};

export const ModelLists: React.FC<IModelListsProps> = (_props) => {
    // Contexts
    const { wizardNavigationContextState } = useWizardNavigationContext();

    // Hooks
    const { palette } = useExtendedTheme();

    // Style
    const style = mergeStyleSets({
        root: {
            display: 'flex',
            flexDirection: 'column',
            rowGap: 16,
            paddingTop: 8
        },
        tableContainer: {
            display: 'flex',
            columnGap: 8,
            border: `1px solid ${palette.glassyBorder}`,
            background: `${palette.glassyBackground75}`,
            padding: 16
        },
        // Model side
        leftContainer: {
            display: 'flex',
            alignItems: 'center',
            columnGap: 4
        },
        modelNameText: {
            margin: 0
        },
        dot: {
            width: 8,
            height: 8,
            borderRadius: 4
        },
        // Property side
        checkboxContainer: {
            display: 'flex',
            flexDirection: 'column',
            rowGap: 8
        }
    });

    return (
        <div className={style.root}>
            {wizardNavigationContextState.stepData.verificationStepData.models?.map(
                (m) => {
                    const properties =
                        wizardNavigationContextState.stepData
                            .verificationStepData.properties;
                    const propertyValues = m.propertyIds.map((pId) => {
                        const propertyName = properties.find(
                            (property) => property.id === pId
                        )?.name;
                        return {
                            key: pId,
                            propertyName: propertyName
                                ? propertyName
                                : 'Unknown'
                        };
                    });

                    return (
                        <div className={style.tableContainer}>
                            <div className={style.leftContainer}>
                                <div
                                    className={style.dot}
                                    style={{
                                        background: getRandomColor()
                                    }}
                                />
                                <p className={style.modelNameText}>{m.name}</p>
                            </div>
                            <Separator vertical={true} />
                            <div>
                                <p>Properties</p>
                                <div className={style.checkboxContainer}>
                                    {propertyValues.map((p) => {
                                        return (
                                            <Checkbox
                                                label={p.propertyName}
                                                defaultChecked={true}
                                                // TODO: Modify context on change
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                }
            )}
        </div>
    );
};
