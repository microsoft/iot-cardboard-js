import { useEffect, useState } from 'react';
const useAuthParams = () => {
    const [authParams, setAuthParams] = useState(null);

    async function getAuthenticationParameters() {
        let module;
        try {
            let userPath = '.user';
            const userSecrets = await import(`./secrets${userPath}`);
            const placeholderSecrets = await import('./secrets.placeholder');
            module = {
                AuthenticationParameters: {
                    ...placeholderSecrets.AuthenticationParameters,
                    ...userSecrets.AuthenticationParameters
                }
            };
        } catch (e) {
            module = await import('./secrets.placeholder');
        }
        return module.AuthenticationParameters;
    }

    useEffect(() => {
        getAuthenticationParameters().then((params) => {
            setAuthParams(params);
        });
    }, []);
    return authParams;
};
export default useAuthParams;
