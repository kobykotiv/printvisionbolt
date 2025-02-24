import React from 'react';

const LandingPage = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h1>Welcome to PrintVision.Cloud</h1>
      <p style={{ fontSize: '1.2em', textAlign: 'center', maxWidth: '600px' }}>
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
    </div>
  );
};

export default LandingPage;
