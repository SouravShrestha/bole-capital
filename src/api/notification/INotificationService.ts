export interface SubscribePayload {
  email: string;
}

export interface INotificationService {
  sendSubscribeNotification(payload: SubscribePayload): Promise<void>;
}
