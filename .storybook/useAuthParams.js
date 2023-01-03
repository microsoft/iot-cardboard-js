import { useEffect, useState } from 'react';
const useAuthParams = () => {
    const [authParams, setAuthParams] = useState(null);

    async function getAuthenticationParameters() {
        let module;
        try {
            let userPath = '.user';
            const userSecrets = await import(`./secrets${userPath}`);
            const placeholderSecrets = await import('./secrets.placeholder');

            checkMissingKeys(
                placeholderSecrets.AuthenticationParameters,
                userSecrets.AuthenticationParameters
            );
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

const checkMissingKeys = (placeholder, user, prefix) => {
    const placeholderKeys = Object.keys(placeholder);
    const userKeys = Object.keys(user || {});
    placeholderKeys.forEach((keyName) => {
        if (userKeys.indexOf(keyName) === -1) {
            console.warn(
                `User secret may be missing: ${
                    prefix ? prefix + '.' + keyName : keyName
                }`
            );
        } else if (typeof placeholder[keyName] === 'object') {
            checkMissingKeys(
                placeholder[keyName],
                user[keyName] || {},
                keyName
            );
        }
    });
};
