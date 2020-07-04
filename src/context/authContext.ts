import { createContext, useContext } from 'react';

// export interface IAuthContext {
//   roles: Array<string>,
//   username: string,
//   token: string,
// }

export const AuthContext = createContext({ authContext: { roles: [] as Array<string>, username: '', token: '' }, setAuthContext: (tokenStr: string) => {} });

export function useAuth() {
  return useContext(AuthContext);
}