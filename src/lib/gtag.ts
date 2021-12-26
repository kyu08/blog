export const GA_TRACKING_ID = 'G-BDQ408J45J'

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  // 開発環境では window.gtag は未定義
  if (window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
type GaEventProps = {
  action: string
  category: string
  label: string
  value?: number
}

export const event = ({ action, category, label, value }: GaEventProps) => {
  // 開発環境では window.gtag は未定義
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}
