Develop a comprehensive art marketplace platform using Next.js. The platform should facilitate the buying and selling of art pieces, with the US Dollar (USD) as the primary currency for all transactions. Implement a robust system where artists can list their artwork, including detailed descriptions, pricing, and high-quality images. Buyers should be able to browse, search, and purchase art with secure payment processing. The marketplace must integrate with an API broker to connect with suppliers who provide the blueprints or manufacturing of the art pieces.

The user must make templates out of blueprints

This integration should automate the fulfillment process, ensuring that orders are seamlessly routed to the appropriate suppliers for production and shipping. The platform should also include features for user accounts, order tracking, and communication between buyers and sellers. Ensure the design is user-friendly, responsive, and optimized for both desktop and mobile devices.

BYOK bring your own keys.

Integrate Stripe:

Set up Stripe for handling subscriptions and payments.
Create Stripe accounts for storefront owners to receive payments.
Implement webhooks to handle events such as successful payments, subscription updates, and payouts.
Database Schema:

Add tables to store payment and subscription information.
Track orders and payments to ensure accurate revenue distribution.
API Integration:

Integrate with supplier APIs to dispatch orders automatically.
Ensure secure handling of API keys and credentials.
User Interface:

Provide a dashboard for storefront owners to view their revenue and expenses.
Allow users to manage their subscriptions and payment methods.
Backend Logic:

Implement logic to calculate and distribute revenue minus expenses.
Handle payouts to storefront owners.
Bolt.new Task: Art Marketplace Development

Your task is to use the bolt.new web-based IDE to build a Next.js art marketplace. Requirements:

Core Features:
- Set up Next.js project structure
- Implement Stripe payment integration
- Create user authentication system
- Design responsive UI components
- Build API routes for marketplace operations

Technical Requirements:
1. Frontend:
    - Next.js pages and components
    - Responsive design system
    - Art listing and search functionality
    - Shopping cart implementation

2. Backend:
    - RESTful API endpoints
    - Stripe payment processing
    - Database integration
    - Supplier API integration

3. Security:
    - BYOK implementation
    - API key management
    - Secure payment handling

Start by creating the project structure and implementing the core authentication system.