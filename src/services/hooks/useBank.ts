import { useRef } from "react";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { onCreateServiceProviderAccount, onCreateServiceProviderBankAccount } from "@services/api/bank.service";

export const useBank = () => {

    const successCallbackRef = useRef<(a: object) => void>();
    const errorCallbackRef = useRef<(a: any) => void>();

    // Create Service Provider Bank Account
    const createServiceProviderBankAccountMutation = useMutation(
        onCreateServiceProviderBankAccount,
        {
          onSuccess: (data: any) => {
            return successCallbackRef.current?.(data);
          },
          onError: (err: AxiosError) => {
            errorCallbackRef.current?.(err);
          },
        }
      ); 

      const createServiceProviderBankAccount = (
        payload: any,
        succesCallback?: (p: object) => void,
        errorCallback?: (p: any) => void
      ) => {
        successCallbackRef.current = succesCallback;
        errorCallbackRef.current = errorCallback;
        createServiceProviderBankAccountMutation.mutate(payload);
      };

    // Create Service Provider Account
    const createServiceProviderAccountMutation = useMutation(
        onCreateServiceProviderAccount,
        {
          onSuccess: (data: any) => {
            return successCallbackRef.current?.(data);
          },
          onError: (err: AxiosError) => {
            errorCallbackRef.current?.(err);
          },
        }
      );
      
      const createServiceProviderAccount = (
        payload: any,
        succesCallback?: (p: object) => void,
        errorCallback?: (p: any) => void
      ) => {
        successCallbackRef.current = succesCallback;
        errorCallbackRef.current = errorCallback;
        createServiceProviderAccountMutation.mutate(payload);
      };

      return {
        createServiceProviderBankAccount,
        createServiceProviderAccount
      }
}