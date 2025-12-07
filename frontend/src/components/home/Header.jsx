import PropTypes from 'prop-types';

const Header = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center mb-4">
        <img
          src="https://cdn.geo.elelem.ai/onboarding/91638358f_elelem2025logoPrimary.png"
          alt="elelem"
          className="h-10"
        />
      </div>
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        Choose Your Plan
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Get started with AI Search Optimization and win in the age of AI
      </p>
    </div>
  );
};

Header.propTypes = {};

export default Header;