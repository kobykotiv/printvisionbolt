import React, { Component, useState, useEffect } from 'react';

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

const LandingPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a network request or some async operation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the timeout as needed

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontFamily: 'Arial, sans-serif',
        padding: '20px'
      }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1>Welcome to PrintVision.Cloud</h1>
          <p style={{ fontSize: '1.2em', maxWidth: '800px', margin: '0 auto' }}>
            Stunning! Print on Demand that scales. Deploy instantly. Focus on Selling your art Online.
          </p>
          <div style={{ marginTop: '20px' }}>
            <a 
              href="/auth/login" 
              style={{ 
                padding: '10px 20px', 
                marginRight: '10px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '5px' 
              }}
            >
              Log in
            </a>
            <a 
              href="/auth/register"
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '5px' 
              }}
            >
              Sign up
            </a>
          </div>
        </header>

        <section style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '40px' }}>
          <h2>Why Choose PrintVision.Cloud?</h2>
          <p style={{ fontSize: '1.1em' }}>
            PrintVision.Cloud offers a comprehensive solution for artists and entrepreneurs looking to sell their art online. Our platform is designed to be scalable, user-friendly, and packed with features to help you succeed.
          </p>
        </section>

        <section style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '40px' }}>
          <h3>Current Features</h3>
          <ul style={{ textAlign: 'left', fontSize: '1.1em' }}>
            <li>Instant Deployment: Get your store up and running in minutes.</li>
            <li>Scalable Infrastructure: Grow your business without worrying about technical limitations.</li>
            <li>Easy-to-Use Dashboard: Manage your products, orders, and customers with ease.</li>
            {/* <li>Secure Payments: Integrated payment gateways to ensure secure transactions.</li>
            <li>Customizable Storefront: Personalize your store to match your brand.</li> */}
            <li>Analytics and Reporting: Gain insights into your sales and customer behavior.</li>
          </ul>
        </section>

        <section style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '40px' }}>
          <h3>Future Features (Version 1.0)</h3>
          <ul style={{ textAlign: 'left', fontSize: '1.1em' }}>
            <li>Advanced Marketing Tools: Email campaigns, social media integration, and more.</li>
            <li>Expanded Product Options: Offer a wider range of products to your customers.</li>
            <li>Automated Order Fulfillment: Streamline your order processing and shipping.</li>
            {/* <li>Multi-Language Support: Reach a global audience with multi-language capabilities.</li> */}
            <li>Mobile App: Manage your store on the go with our upcoming mobile app.</li>
            <li>Customer Loyalty Programs: Reward your loyal customers with discounts and special offers.</li>
          </ul>
        </section>

        <section style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '40px' }}>
          <h3>Testimonials</h3>
          <blockquote style={{ fontSize: '1.1em', fontStyle: 'italic' }}>
            "PrintVision.Cloud has transformed my art business. The platform is incredibly easy to use and the support team is fantastic!" - Jane Doe, Artist
          </blockquote>
          <blockquote style={{ fontSize: '1.1em', fontStyle: 'italic' }}>
            "Thanks to PrintVision.Cloud, I can focus on creating art while they handle the logistics. Highly recommend!" - John Smith, Entrepreneur
          </blockquote>
        </section>

        <section style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '40px' }}>
          <h3>Potential Use Cases</h3>
          <ul style={{ textAlign: 'left', fontSize: '1.1em' }}>
            <li>Artists looking to sell their prints online.</li>
            <li>Entrepreneurs wanting to start a print-on-demand business.</li>
            <li>Businesses needing custom merchandise for branding.</li>
            <li>Non-profits seeking to raise funds through merchandise sales.</li>
          </ul>
        </section>

        <section style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '40px' }}>
          <h3>Blog</h3>
          <div style={{ textAlign: 'left', fontSize: '1.1em' }}>
            <h4>Latest Posts</h4>
            <article>
              <h5>How to Get Started with PrintVision.Cloud</h5>
              <p>Learn the basics of setting up your store and start selling your art online.</p>
            </article>
            <article>
              <h5>Top 10 Tips for Marketing Your Art Online</h5>
              <p>Discover effective strategies to promote your art and reach a wider audience.</p>
            </article>
          </div>
        </section>

        <footer style={{ textAlign: 'center', marginTop: '40px' }}>
          <p>&copy; 2025 PrintVision.Cloud. All rights reserved.</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default LandingPage;
