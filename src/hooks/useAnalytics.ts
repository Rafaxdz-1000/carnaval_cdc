/**
 * Hook para facilitar o tracking de analytics
 */
import { useEffect } from "react";
import { registrarAnalytics } from "@/lib/supabaseService";

export function usePageView(pageSection: string) {
  useEffect(() => {
    registrarAnalytics("page_view", pageSection);
  }, [pageSection]);
}

export function useFormOpen(pageSection: string) {
  useEffect(() => {
    registrarAnalytics("form_open", pageSection);
  }, [pageSection]);
}
