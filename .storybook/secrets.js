export const AuthenticationParameters = {
    iotCentral: {
        appId: 'APPID_PLACEHOLDER',
        aadParameters: {
            authority: 'AUTHORITY_PLACEHOLDER',
            clientId: 'CLIENTID_PLACEHOLDER',
            scope: 'SCOPE_PLACEHOLDER',
            redirectUri: 'REDIRECTURI_PLACEHOLDER'
        }
    },
    tsi: {
        environmentFqdn:
            '10000000-0000-0000-0000-100000000109.env.timeseries.azure.com',
        aadParameters: {
            authority: 'https://login.microsoftonline.com/organizations',
            clientId: 'e7e88070-28a1-43a3-9704-d8b986eb5f60',
            scope: 'https://api.timeseries.azure.com//.default',
            redirectUri: 'https://adtexplorer-tsi-local.azurewebsites.net'
        }
    }
};
