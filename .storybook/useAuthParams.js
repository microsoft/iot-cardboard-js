import { useEffect, useState } from 'react';
const useAuthParams = () => {
    const [authParams, setAuthParams] = useState(null);

    async function getAuthenticationParameters() {
        let module;
        let userPath = '.user';
        try {
            module = await import(`./secrets${userPath}`);
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
