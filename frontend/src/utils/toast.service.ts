import toast from "react-hot-toast";

class ToastService {
  success(message: string) {
    toast.success(message, {
      duration: 3000,
      position:'top-center'
    });
  }

  error(message: string) {
    toast.error(message, {
      duration: 3000,
      position:'top-center'
    });
  }

  loading(message: string) {
    return toast.loading(message);
  }

  dismiss(toastId?: string) {
    toast.dismiss(toastId);
  }

  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) {
    return toast.promise(promise, messages, {
      style: {
        borderRadius: "10px",
      },
    });
  }
}

export const toastService = new ToastService();