import React from 'react';

interface CoreValue {
  title: string;
  description: string;
  icon: string;
}

interface StrategicPillar {
  name: string;
  description: string;
}

const CORE_VALUES: CoreValue[] = [
  {
    title: 'Innovation First',
    description: "We continuously push the boundaries of what's possible in print-on-demand automation.",
    icon: '💡',
  },
  {
    title: 'Creator Success',
    description: 'Your success is our success. We provide the tools and support needed to help you thrive.',
    icon: '🎯',
  },
  {
    title: 'Seamless Integration',
    description: 'Connect and manage multiple platforms effortlessly through our unified dashboard.',
    icon: '🔄',
  },
  {
    title: 'Quality at Scale',
    description: 'Maintain high standards while growing your business with our automated quality controls.',
    icon: '📈',
  },
  {
    title: 'Community Driven',
    description: 'Built by and for the print-on-demand community, with regular feedback and updates.',
    icon: '🤝',
  },
  {
    title: 'Sustainable Growth',
    description: 'Focus on long-term success with scalable solutions that grow with your business.',
    icon: '🌱',
  },
];

const STRATEGIC_PILLARS: StrategicPillar[] = [
  {
    name: 'Automated Workflows',
    description: 'Streamline your operations with intelligent automation that handles everything from design uploads to order fulfillment.',
  },
  {
    name: 'Multi-Platform Integration',
    description: 'Sell across multiple marketplaces while managing everything from a single, unified dashboard.',
  },
  {
    name: 'Smart Analytics',
    description: 'Make data-driven decisions with comprehensive analytics and performance tracking across all your stores.',
  },
  {
    name: 'Scalable Infrastructure',
    description: 'Built to grow with your business, from your first design to your millionth sale.',
  },
];

const Strategy: React.FC = () => {
  return (
    <div className="bg-white dark:bg-secondary-900">
      {/* Hero Section */}
      <div className="relative py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1>
                <span className="block text-base text-primary-600 dark:text-primary-500 font-semibold tracking-wide uppercase">
                  Our Strategy
                </span>
                <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                  <span className="block text-secondary-900 dark:text-white">Building the Future of</span>
                  <span className="block text-primary-600 dark:text-primary-500">Print-on-Demand</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-secondary-500 dark:text-secondary-400 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Our mission is to revolutionize the print-on-demand industry by providing creators with powerful automation tools and seamless marketplace integration.
              </p>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-secondary-100 dark:bg-secondary-800 rounded-lg overflow-hidden">
                  <span className="text-6xl p-12 block text-center">🚀</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-secondary-50 dark:bg-secondary-800">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary-600 dark:text-primary-500 font-semibold tracking-wide uppercase">
              Core Values
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-secondary-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              What Drives Us
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_VALUES.map((value) => (
              <div key={value.title} className="pt-6">
                <div className="flow-root bg-white dark:bg-secondary-900 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg text-4xl">
                      {value.icon}
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-secondary-900 dark:text-white tracking-tight">
                      {value.title}
                    </h3>
                    <p className="mt-5 text-base text-secondary-500 dark:text-secondary-400">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategic Pillars Section */}
      <div className="bg-white dark:bg-secondary-900">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary-600 dark:text-primary-500 font-semibold tracking-wide uppercase">
              Strategic Pillars
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-secondary-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              Our Approach
            </p>
          </div>

          <div className="mt-16">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {STRATEGIC_PILLARS.map((pillar) => (
                <div key={pillar.name} className="relative">
                  <dt>
                    <p className="text-lg leading-6 font-medium text-secondary-900 dark:text-white">
                      {pillar.name}
                    </p>
                  </dt>
                  <dd className="mt-2 text-base text-secondary-500 dark:text-secondary-400">
                    {pillar.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Strategy;