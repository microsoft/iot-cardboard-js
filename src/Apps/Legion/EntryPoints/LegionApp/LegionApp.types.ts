export interface ILegionAppProps {
    extensionClient?: IExtensionClient;
}

export interface IExtensionClient {
    /**
     *
     * @param scopes  When it is not defined, default PBI access token is returned.
     * @returns promise which resolves when the access token is fetched.
     */
    getAccessToken: (
        scopes?: string[]
    ) => Promise<{ token: string; expiry?: Date }>;
    getUserProfile: () => Promise<IUserProfile>;
    logEvent(event: IEvent): void;
    openNotification: (
        config: OpenNotificationConfig
    ) => Promise<{
        notificationId: string;
    }>;
    hideNotification: (config: { notificationId: string }) => void;
    openPage: (config: OpenPageConfig) => Promise<OpenUIResult>;
    openDialog: (config: OpenDialogConfig) => Promise<OpenUIResult>;
    closeDialog: (config: CloseUIConfig) => Promise<CloseUIResult>;
    openPanel: (config: OpenPanelConfig) => Promise<OpenUIResult>;
    closePanel: (config: CloseUIConfig) => Promise<CloseUIResult>;
}
export interface CloseUIResult {
    success: boolean;
}
export interface OpenUIResult {
    value?: unknown;
}
export interface OpenPageConfig extends OpenUIConfig {
    workloadName?: string;
}
export interface OpenUIConfig {
    extensionName: string;
    route: ExtensionRoute;
    mode?: OpenMode;
}
export interface ExtensionRoute {
    /**
     * Route info is constructed with 2 parts including path & query parameters (as KV pair).
     */
    path: string;
    queryParams?: Record<string, string>;
}
export declare enum OpenMode {
    Append = 1,
    ReplaceAll = 2
}
export declare enum NotificationType {
    Success = 1,
    Info = 2,
    Warning = 3,
    Error = 4
}
export declare enum NotificationToastDuration {
    Short = 'Short',
    Medium = 'Medium',
    Long = 'Long'
}
export interface CloseUIConfig {
    mode?: CloseMode;
    data?: unknown;
}
export declare enum CloseMode {
    PopOne = 1,
    ClearAll = 2
}
export interface DialogUIOptions {
    /**
     * Width of the dialog.
     *
     * If type of the value is number, it will be treated as px value.
     * If type of the value is string, it will be used directly.
     */
    width?: number | string;
    /**
     * Height of the dialog.
     *
     * If type of the value is number, it will be treated as px value.
     * If type of the value is string, it will be used directly.
     */
    height?: number | string;
    /**
     * A concept borrowed from fluent ui. See blocking dialog example here https://developer.microsoft.com/en-us/fluentui#/controls/web/dialog
     *
     * Default: false (non-blocking)
     */
    isBlocking?: boolean;
    /**
     * Whether the dialog has a close button on the upper right corner.
     * If isBlocking is set to true, it is recommended to set this property to true.
     *
     * Default: false (no close button)
     */
    hasCloseButton?: boolean;
}
export interface OpenDialogConfig extends OpenUIConfig {
    options?: DialogUIOptions;
}
export interface PanelUIOptions {
    width?: number | string;
}
export interface OpenPanelConfig extends OpenUIConfig {
    options?: PanelUIOptions;
}

export interface IEvent<TName = string> {
    name: TName;
    properties?: Record<string, string>;
    status?: 'Succeeded' | 'Failed' | 'Cancelled';
}
export interface OpenNotificationConfig {
    notificationType?: NotificationType;
    title: string;
    message?: string;
    duration?: NotificationToastDuration;
}
export interface IUserProfile {
    name: string;
    givenName: string;
    surname: string;
    principalName: string;
    objectId: string;
    tenantId: string;
}
