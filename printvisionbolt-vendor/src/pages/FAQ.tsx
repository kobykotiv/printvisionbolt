import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What is PrintVision.Cloud?",
    answer: "PrintVision.Cloud is a comprehensive print-on-demand automation platform that helps creators and businesses manage their product listings across multiple marketplaces. Our platform simplifies the process of creating, publishing, and managing print-on-demand products at scale."
  },
  {
    question: "How does the platform work?",
    answer: "Our platform connects with various print-on-demand suppliers and e-commerce marketplaces. You create your designs once, and we help you publish them across multiple platforms, manage inventory, track orders, and automate fulfillment - all from a single dashboard."
  },
  {
    question: "Which marketplaces do you support?",
    answer: "We currently support integration with major marketplaces including Shopify, Etsy, Amazon, and TikTok Shop. We're constantly adding new integrations based on user demand and market trends."
  },
  {
    question: "What print-on-demand suppliers can I use?",
    answer: "We integrate with leading print-on-demand suppliers including Printify, Printful, and Gooten. You can manage multiple supplier relationships through our platform to optimize your product quality and costs."
  },
  {
    question: "Do I need technical knowledge to use the platform?",
    answer: "No technical knowledge is required. Our platform is designed to be user-friendly with an intuitive interface. We provide comprehensive documentation and support to help you get started quickly."
  },
  {
    question: "How much does it cost?",
    answer: "We offer multiple pricing tiers starting with a free plan. Our paid plans start at $1/month for creators, $9/month for growing businesses, and $29/month for enterprise users. Each plan includes different features and capabilities to match your business needs."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, we offer a free plan that lets you try our core features. You can upgrade to a paid plan anytime when you need additional features or higher usage limits."
  },
  {
    question: "How do I get started?",
    answer: "Getting started is easy! Simply sign up for an account, connect your preferred marketplace and supplier integrations, and start creating your product listings. Our setup wizard will guide you through the process step by step."
  },
  {
    question: "What kind of support do you offer?",
    answer: "We offer multiple support channels including email support, community forums, and comprehensive documentation. Paid plans include priority support and direct access to our customer success team. Enterprise plans include dedicated support."
  },
  {
    question: "Can I manage multiple stores?",
    answer: "Yes, our platform allows you to manage multiple stores across different marketplaces. This is especially useful if you're selling on multiple platforms or managing different brands."
  }
];

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(current =>
      current.includes(index)
        ? current.filter(i => i !== index)
        : [...current, index]
    );
  };

  return (
    <div className="bg-white dark:bg-secondary-900">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-secondary-900 dark:text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-secondary-500 dark:text-secondary-400">
            Can't find the answer you're looking for? Reach out to our{' '}
            <a
              href="/support"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              customer support
            </a>{' '}
            team.
          </p>
        </div>
        <div className="mt-12 max-w-3xl mx-auto divide-y divide-secondary-200 dark:divide-secondary-700">
          {FAQ_ITEMS.map((item, index) => (
            <div key={index} className="py-6">
              <button
                onClick={() => toggleItem(index)}
                className="flex justify-between w-full text-left focus:outline-none"
              >
                <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
                  {item.question}
                </h3>
                <span className="ml-6 flex-shrink-0">
                  {openItems.includes(index) ? (
                    <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </span>
              </button>
              {openItems.includes(index) && (
                <div className="mt-4 pr-12">
                  <p className="text-base text-secondary-500 dark:text-secondary-400">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;