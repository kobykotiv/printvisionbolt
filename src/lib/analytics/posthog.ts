import posthog from 'posthog-js'

export const initPostHog = () => {
    posthog.init(
        'phc_xaUZXBs0f3D3WpqHfwg0yVZ8O6faEJqqEtILtGbATeK',
        {
            api_host: 'https://us.posthog.com',
            loaded: (posthog) => {
                if (process.env.NODE_ENV === 'development') {
                    // Add warning that we're in dev mode
                    console.log('PostHog loaded in development mode')
                }
            },
            autocapture: true
        }
    )
}

export const analyticsService = {
    track: (eventName: string, properties?: Record<string, any>) => {
        posthog.capture(eventName, properties)
    },
    identify: (userId: string, properties?: Record<string, any>) => {
        posthog.identify(userId, properties)
    },
    reset: () => {
        posthog.reset()
    }
}
