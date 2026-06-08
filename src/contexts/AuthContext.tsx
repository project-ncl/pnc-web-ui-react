import axios from 'axios';
import { PropsWithChildren, createContext, useEffect, useState } from 'react';

import { useServiceContainer } from 'hooks/useServiceContainer';

import * as userApi from 'services/userApi';
import { IAuthUser } from 'services/userApi';
import { userService } from 'services/userService';

export interface IAuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  isError: boolean;
  user: IAuthUser | null;
  error: string | null;
}

const initialState: IAuthContextValue = {
  isLoading: true,
  isAuthenticated: false,
  isError: false,
  user: null,
  error: null,
};

export const AuthContext = createContext<IAuthContextValue>(initialState);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [authState, setAuthState] = useState<IAuthContextValue>(initialState);

  const serviceContainerUser = useServiceContainer(userApi.getCurrentUser, 0);
  const serviceContainerUserRunner = serviceContainerUser.run;

  useEffect(() => {
    serviceContainerUserRunner({
      onSuccess: ({ response }) => {
        const user = response.data;
        userService.setUser(user);
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          isError: false,
          user,
          error: null,
        });
      },
      onError: ({ error }) => {
        userService.clearUser();

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            isError: false,
            user: null,
            error: null,
          });
          return;
        }

        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          isError: true,
          user: null,
          error: error instanceof Error ? error.message : 'Auth Service unavailable',
        });
      },
    });
  }, [serviceContainerUserRunner]);

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
};
