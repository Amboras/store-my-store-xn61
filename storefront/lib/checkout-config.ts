/**
 * Checkout Settings Types & API
 *
 * Fetches checkout field configuration from Medusa backend.
 * Settings control field visibility, requirements, and behavior.
 */

export type ContactMethod = 'email' | 'email_or_phone'
export type FullNameOption = 'full' | 'last_only'
export type FieldVisibility = 'hidden' | 'optional'
export type AddressLine2Visibility = 'hidden' | 'optional' | 'required'
export type PhoneRequirement = 'required' | 'optional'
export type MarketingOptInLocation = 'checkout' | 'signin' | 'both'

export interface MarketingOptInSettings {
  enabled: boolean
  pre_checked: boolean
  where: MarketingOptInLocation
}

export interface CheckoutSettings {
  contact_method: ContactMethod
  full_name: FullNameOption
  company_name: FieldVisibility
  phone: PhoneRequirement
  address_line_2: AddressLine2Visibility
  require_account: boolean
  marketing_opt_in: MarketingOptInSettings
}

/**
 * Default checkout settings (Shopify-inspired defaults)
 * Used as fallback if API fails
 */
export const DEFAULT_CHECKOUT_SETTINGS: CheckoutSettings = {
  contact_method: 'email',
  full_name: 'full',
  company_name: 'hidden',
  phone: 'optional',
  address_line_2: 'optional',
  require_account: false,
  marketing_opt_in: {
    enabled: false,
    pre_checked: false,
    where: 'checkout'
  }
}

/**
 * Fetch checkout settings from Medusa backend
 */
export async function fetchCheckoutSettings(): Promise<CheckoutSettings> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    const storeEnvId = process.env.NEXT_PUBLIC_STORE_ID

    if (!publishableKey) {
      console.warn('Missing NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY, using default checkout settings')
      return DEFAULT_CHECKOUT_SETTINGS
    }

    const headers: Record<string, string> = {
      'x-publishable-api-key': publishableKey,
      'accept': 'application/json'
    }

    if (storeEnvId) {
      headers['x-store-environment-id'] = storeEnvId
    }

    const response = await fetch(`${baseUrl}/store/checkout-settings`, {
      headers,
      next: { revalidate: 300 } // Cache for 5 minutes
    })

    if (!response.ok) {
      console.warn('Failed to fetch checkout settings, using defaults')
      return DEFAULT_CHECKOUT_SETTINGS
    }

    const data = await response.json()
    return data.checkout_settings || DEFAULT_CHECKOUT_SETTINGS
  } catch (error) {
    console.warn('Error fetching checkout settings:', error)
    return DEFAULT_CHECKOUT_SETTINGS
  }
}
