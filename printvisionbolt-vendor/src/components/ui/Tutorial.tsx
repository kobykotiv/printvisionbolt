import React, { useEffect, useState } from 'react';
import './Tutorial.css'; // Import the CSS file

interface TutorialProps {
  onComplete: () => void; // Define the onComplete prop
}

const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: 'Welcome to the App!',
      content: 'This app helps you manage your designs efficiently. Let\'s get started!',
      target: '#welcome', // Target element for the pop-up
    },
    {
      title: 'Navigation',
      content: 'Use the sidebar to navigate between different sections of the app.',
      target: '#navigation', // Target element for the pop-up
    },
    {
      title: 'Creating Designs',
      content: 'Click here to create a new design and explore our templates.',
      target: '#create-design', // Target element for the pop-up
    },
    {
      title: 'Your Dashboard',
      content: 'Here you can view your designs and manage your collections.',
      target: '#dashboard', // Target element for the pop-up
    },
  ];

  useEffect(() => {
    const currentStep = steps[step];
    if (currentStep) {
      const targetElement = document.querySelector(currentStep.target);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetElement.classList.add('highlight'); // Add highlight class for visual effect
      }
    }
  }, [step]);

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(); // Call onComplete when the tutorial is finished
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="tutorial-popup">
      <h2>{steps[step]?.title}</h2>
      <p>{steps[step]?.content}</p>
      <div className="tutorial-controls">
        <button onClick={prevStep} disabled={step === 0}>Previous</button>
        <button onClick={nextStep} disabled={step === steps.length - 1}>Next</button>
      </div>
    </div>
  );
};

export default Tutorial;