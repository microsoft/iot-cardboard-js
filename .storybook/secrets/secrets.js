import { placeholderSecrets } from './placeholderSecrets';
import { userDefinedSecrets } from './userDefinedSecrets';

export const AuthenticationParameters = {...placeholderSecrets, ...userDefinedSecrets};