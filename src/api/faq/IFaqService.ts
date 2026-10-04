import type { FaqCategory } from "@/types/faq";

export interface IFaqService {
  getCategories(): Promise<FaqCategory[]>;
}
