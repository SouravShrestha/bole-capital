export interface SubscribePayload {
  email: string;
  name?: string;
  phone?: string;
}

export interface ContactPayload {
  name: string;
  phone: string;
  message: string;
  email?: string;
}

export interface INotificationService {
  sendSubscribeNotification(payload: SubscribePayload): Promise<void>;
  sendContactNotification(payload: ContactPayload): Promise<void>;
}
