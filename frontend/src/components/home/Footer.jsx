import PropTypes from 'prop-types';

const Footer = () => {
  return (
    <div className="text-center">
      <p className="text-gray-600 mb-4">
        All plans include a 7-day free trial. No credit card required for
        trial.
      </p>
      <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
        <a href="#" className="hover:text-[#1E8B8B]">
          Contact Sales
        </a>
        <span>•</span>
        <a href="#" className="hover:text-[#1E8B8B]">
          View Full Feature Comparison
        </a>
        <span>•</span>
        <a href="#" className="hover:text-[#1E8B8B]">
          FAQ
        </a>
      </div>
    </div>
  );
};

Footer.propTypes = {};

export default Footer;