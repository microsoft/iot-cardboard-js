export async function getAuthenticationParameters() {
    let module;
    let userPath = '.user';
    try {
        module = await import(`./secrets${userPath}`);
    } catch (e) {
        module = await import('./secrets.placeholder');
    }
    return module.AuthenticationParameters;
}
