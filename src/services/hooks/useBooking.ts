import { useRef } from "react";
import { AxiosError } from "axios";
import { useMutation } from "react-query";

import {
  onPushSPBookingStatus,
  onSendNotification,
  onUpdateServiceProviderActiveStatus,
  onUpdateServiceProviderLocation,
  onGetBookingHistory,
  onCancelBooking,
  onCompleteBooking,
  onSaveAvailability,
  onSaveFeedback,
  onGetAvailability,
  onGetCustomerDeviceID,
  onGetActiveStatus,
} from "../api/booking.service";

export const useBooking = () => {
  const successCallbackRef = useRef<(a: object) => void>();
  const errorCallbackRef = useRef<(a: any) => void>();

  const updateServiceProviderActiveStatusMutation = useMutation(
    onUpdateServiceProviderActiveStatus,
    {
      onSuccess: (data: any) => {
        return successCallbackRef.current?.(data);
      },
      onError: (err: AxiosError) => {
        errorCallbackRef.current?.(err);
      },
    }
  );
  const updateServiceProviderActiveStatus = (
    payload: any,
    succesCallback?: (p: object) => void,
    errorCallback?: (p: any) => void
  ) => {
    successCallbackRef.current = succesCallback;
    errorCallbackRef.current = errorCallback;
    updateServiceProviderActiveStatusMutation.mutate(payload);
  };
  const updateServiceProviderLocationMutation = useMutation(
    onUpdateServiceProviderLocation,
    {
      onSuccess: (data: any) => {
        return successCallbackRef.current?.(data);
      },
      onError: (err: AxiosError) => {
        errorCallbackRef.current?.(err);
      },
    }
  );
  const updateServiceProviderLocation = (
    payload: any,
    succesCallback?: (p: object) => void,
    errorCallback?: (p: any) => void
  ) => {
    successCallbackRef.current = succesCallback;
    errorCallbackRef.current = errorCallback;
    updateServiceProviderLocationMutation.mutate(payload);
  };

  // ? send notification
  const sendNotificationMutation = useMutation(onSendNotification, {
    onSuccess: (data: any) => {
      return successCallbackRef.current?.(data);
    },
    onError: (err: AxiosError) => {
      errorCallbackRef.current?.(err);
    },
  });
  const sendNotification = (
    payload: any,
    succesCallback?: (p: object) => void,
    errorCallback?: (p: any) => void
  ) => {
    successCallbackRef.current = succesCallback;
    errorCallbackRef.current = errorCallback;
    sendNotificationMutation.mutate(payload);
  };

  // ? push sp booking status
  const pushSPBookingStatusMutation = useMutation(onPushSPBookingStatus, {
    onSuccess: (data: any) => {
      return successCallbackRef.current?.(data);
    },
    onError: (err: AxiosError) => {
      errorCallbackRef.current?.(err);
    },
  });

  const pushSPBookingStatus = (
    payload: any,
    succesCallback?: (p: object) => void,
    errorCallback?: (p: any) => void
  ) => {
    successCallbackRef.current = succesCallback;
    errorCallbackRef.current = errorCallback;
    pushSPBookingStatusMutation.mutate(payload);
  };

  // ? get booking history (per booking reference number or all) legend: pass empty BookingRefNo: "" to get all bookings
  const getBookingHistoryMutation = useMutation(onGetBookingHistory, {
    onSuccess: (data: any) => {
      return successCallbackRef.current?.(data);
    },
    onError: (err: AxiosError) => {
      errorCallbackRef.current?.(err);
    },
  });

  const getBookingHistory = (
    payload: any,
    succesCallback?: (p: object) => void,
    errorCallback?: (p: any) => void
  ) => {
    successCallbackRef.current = succesCallback;
    errorCallbackRef.current = errorCallback;
    getBookingHistoryMutation.mutate(payload);
  };

  // ? cancels the booking from service provider
  const cancelBookingMutation = useMutation(onCancelBooking, {
    onSuccess: (data: any) => {
      return successCallbackRef.current?.(data);
    },
    onError: (err: AxiosError) => {
      errorCallbackRef.current?.(err);
    },
  });

  const cancelBooking = (
    payload: any,
    succesCallback?: (p: object) => void,
    errorCallback?: (p: any) => void
  ) => {
    successCallbackRef.current = succesCallback;
    errorCallbackRef.current = errorCallback;
    cancelBookingMutation.mutate(payload);
  };

  // ? completes the booking from service provider
  const completeBookingMutation = useMutation(onCompleteBooking, {
    onSuccess: (data: any) => {
      return successCallbackRef.current?.(data);
    },
    onError: (err: AxiosError) => {
      errorCallbackRef.current?.(err);
    },
  });

  const completeBooking = (
    payload: any,
    succesCallback?: (p: object) => void,
    errorCallback?: (p: any) => void
  ) => {
    successCallbackRef.current = succesCallback;
    errorCallbackRef.current = errorCallback;
    completeBookingMutation.mutate(payload);
  };

  // ? Saves the booking dates
  const saveAvailabilityMutation = useMutation(onSaveAvailability, {
    onSuccess: (data: any) => {
      return successCallbackRef.current?.(data);
    },
    onError: (err: AxiosError) => {
      errorCallbackRef.current?.(err);
    },
  });

  const saveAvailability = (
    payload: any,
    succesCallback?: (p: object) => void,
    errorCallback?: (p: any) => void
  ) => {
    successCallbackRef.current = succesCallback;
    errorCallbackRef.current = errorCallback;
    saveAvailabilityMutation.mutate(payload);
  };

  // ? Gets the booking dates
  const getAvailabilityMutation = useMutation(onGetAvailability, {
    onSuccess: (data: any) => {
      return successCallbackRef.current?.(data);
    },
    onError: (err: AxiosError) => {
      errorCallbackRef.current?.(err);
    },
  });

  const getAvailability = (
    payload: any,
    succesCallback?: (p: object) => void,
    errorCallback?: (p: any) => void
  ) => {
    successCallbackRef.current = succesCallback;
    errorCallbackRef.current = errorCallback;
    getAvailabilityMutation.mutate(payload);
  };

  // ? Saves rating and feedback
  const saveFeedbackMutation = useMutation(onSaveFeedback, {
    onSuccess: (data: any) => {
      return successCallbackRef.current?.(data);
    },
    onError: (err: AxiosError) => {
      errorCallbackRef.current?.(err);
    },
  });

  const saveFeedback = (
    payload: any,
    succesCallback?: (p: object) => void,
    errorCallback?: (p: any) => void
  ) => {
    successCallbackRef.current = succesCallback;
    errorCallbackRef.current = errorCallback;
    saveFeedbackMutation.mutate(payload);
  };

  // ? Gets the device id of a specific customer
  const getCustomerDeviceIDMutation = useMutation(onGetCustomerDeviceID, {
    onSuccess: (data: any) => {
      return successCallbackRef.current?.(data);
    },
    onError: (err: AxiosError) => {
      errorCallbackRef.current?.(err);
    },
  });

  const getCustomerDeviceID = (
    payload: any,
    succesCallback?: (p: object) => void,
    errorCallback?: (p: any) => void
  ) => {
    successCallbackRef.current = succesCallback;
    errorCallbackRef.current = errorCallback;
    getCustomerDeviceIDMutation.mutate(payload);
  };

  // ? Gets the active status
  const _2successCallbackRef = useRef<(a: object) => void>();
  const _2errorCallbackRef = useRef<(a: any) => void>();

  const getActiveStatusMutation = useMutation(onGetActiveStatus, {
    onSuccess: (data: any) => {
      return _2successCallbackRef.current?.(data);
    },
    onError: (err: AxiosError) => {
      _2errorCallbackRef.current?.(err);
    },
  });

  const getActiveStatus = (
    payload: any,
    succesCallback?: (p: object) => void,
    errorCallback?: (p: any) => void
  ) => {
    _2successCallbackRef.current = succesCallback;
    _2errorCallbackRef.current = errorCallback;
    getActiveStatusMutation.mutate(payload);
  };

  return {
    updateServiceProviderActiveStatus,
    updateServiceProviderLocation,
    sendNotification,
    pushSPBookingStatus,
    getBookingHistory,
    cancelBooking,
    completeBooking,
    saveAvailability,
    getAvailability,
    saveFeedback,
    getCustomerDeviceID,
    getActiveStatus,
  };
};
