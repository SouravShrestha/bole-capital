import faqData from "@/data/faqs.json";
import type { FaqCategory } from "@/types/faq";
import type { IFaqService } from "./IFaqService";

const faqService: IFaqService = {
  async getCategories(): Promise<FaqCategory[]> {
    return faqData as FaqCategory[];
  },
};

export default faqService;
