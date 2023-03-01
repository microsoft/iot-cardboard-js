import React, { useCallback } from 'react';
import {
    IHomePageProps,
    IHomePageStyleProps,
    IHomePageStyles
} from './HomePage.types';
import { getStyles } from './HomePage.styles';
import {
    BaseButton,
    classNamesFunction,
    Pivot,
    PivotItem,
    Stack,
    styled
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import {
    INGRESS_TRANSLATION_COMMON_PATH,
    INGRESS_TRANSLATION_PATH,
    PageNames
} from '../../Models/Constants';
import { useNavigationContext } from '../../Models/Context/NavigationContext';
import { NavigationContextActionType } from '../../Models/Context/NavigationContext.types';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    IHomePageStyleProps,
    IHomePageStyles
>();

const TRANSLATE_KEY_ROOT = `${INGRESS_TRANSLATION_PATH}.IngressHomePage`;
const TRANSLATE_KEYS = {
    // Common translation values
    templates: `${INGRESS_TRANSLATION_COMMON_PATH}.templates`,
    sourceMappings: `${INGRESS_TRANSLATION_COMMON_PATH}.sourceMappings`,
    eventHandlers: `${INGRESS_TRANSLATION_COMMON_PATH}.eventHandlers`,
    subscriptions: `${INGRESS_TRANSLATION_COMMON_PATH}.subscriptions`,
    // Component translation values
    title: `${TRANSLATE_KEY_ROOT}.title`
};

const HomePage: React.FC<IHomePageProps> = (props) => {
    const { styles } = props;

    // contexts
    const { navigationContextDispatch } = useNavigationContext();

    // state

    // hooks
    const { t } = useTranslation();

    // callbacks
    const onNavigate = useCallback((pageName: PageNames) => {
        navigationContextDispatch({
            type: NavigationContextActionType.NAVIGATE_TO,
            payload: {
                pageName: pageName
            }
        });
    }, []);

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    return (
        <div className={classNames.root}>
            <Stack tokens={{ childrenGap: 8 }}>
                <div>{t(TRANSLATE_KEYS.title)}</div>
                <div>Diagram</div>
                <Pivot>
                    {/* All text on buttons is temporary will add translation later */}
                    <PivotItem headerText={t(TRANSLATE_KEYS.templates)}>
                        <BaseButton
                            text="Go to templates"
                            onClick={() => onNavigate(PageNames.TemplatesForm)}
                        />
                    </PivotItem>
                    <PivotItem headerText={t(TRANSLATE_KEYS.sourceMappings)}>
                        <BaseButton
                            text="Go to source mappings"
                            onClick={() =>
                                onNavigate(PageNames.SourceMappingForm)
                            }
                        />
                    </PivotItem>
                    <PivotItem headerText={t(TRANSLATE_KEYS.eventHandlers)}>
                        <BaseButton
                            text="Go to event handler"
                            onClick={() =>
                                onNavigate(PageNames.EventHandlerForm)
                            }
                        />
                    </PivotItem>
                    <PivotItem headerText={t(TRANSLATE_KEYS.subscriptions)}>
                        <BaseButton
                            text="Go to subscriptions form"
                            onClick={() =>
                                onNavigate(PageNames.SubscriptionsForm)
                            }
                        />
                    </PivotItem>
                </Pivot>
            </Stack>
        </div>
    );
};

export default styled<IHomePageProps, IHomePageStyleProps, IHomePageStyles>(
    HomePage,
    getStyles
);
