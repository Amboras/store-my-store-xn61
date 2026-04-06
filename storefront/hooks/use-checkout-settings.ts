import { useQuery } from '@tanstack/react-query'
import { fetchCheckoutSettings, DEFAULT_CHECKOUT_SETTINGS, type CheckoutSettings } from '@/lib/checkout-config'

/**
 * Hook to fetch and cache checkout field configuration
 *
 * Returns settings that control:
 * - Which fields are visible (company_name, address_line_2)
 * - Which fields are required (phone, first_name)
 * - Contact method (email only vs email or phone)
 * - Marketing opt-in behavior
 *
 * Settings are cached for 5 minutes and shared across checkout steps.
 */
export function useCheckoutSettings() {
  return useQuery<CheckoutSettings>({
    queryKey: ['checkout-settings'],
    queryFn: fetchCheckoutSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // Always return defaults on error (never show error to user)
    placeholderData: DEFAULT_CHECKOUT_SETTINGS,
    retry: 1
  })
}
