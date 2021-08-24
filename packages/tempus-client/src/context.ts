import React, { Dispatch, SetStateAction } from 'react';

interface ContextDataType {
  userWalletAddress: string;
}

interface ContextType {
  setData: Dispatch<SetStateAction<ContextDataType>> | null;
  data: ContextDataType;
}

export const defaultContextValue = {
  userWalletAddress: '',
};
export const Context = React.createContext<ContextType>({
  data: defaultContextValue,
  setData: null,
});