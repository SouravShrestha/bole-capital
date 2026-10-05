/** Submitted by the site-wide "Book My Portfolio Review" CTA form. */
export interface PortfolioReviewPayload {
  name: string;
  phone: string;
  email?: string;
}

export interface ContactPayload {
  name: string;
  phone: string;
  message: string;
  email?: string;
}

export interface INotificationService {
  sendPortfolioReviewNotification(payload: PortfolioReviewPayload): Promise<void>;
  sendContactNotification(payload: ContactPayload): Promise<void>;
}
