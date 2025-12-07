import { Button } from "@/components/ui/button";
import PropTypes from 'prop-types';

const CurrencySelector = ({ currency, setCurrency }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant={currency === "USD" ? "default" : "outline"}
        size="sm"
        onClick={() => setCurrency("USD")}
        className={
          currency === "USD" ? "bg-[#1E8B8B] hover:bg-[#1E8B8B]" : ""
        }
      >
        USD ($)
      </Button>
      <Button
        variant={currency === "GBP" ? "default" : "outline"}
        size="sm"
        onClick={() => setCurrency("GBP")}
        className={
          currency === "GBP" ? "bg-[#1E8B8B] hover:bg-[#1E8B8B]" : ""
        }
      >
        GBP (£)
      </Button>
      <Button
        variant={currency === "EUR" ? "default" : "outline"}
        size="sm"
        onClick={() => setCurrency("EUR")}
        className={
          currency === "EUR" ? "bg-[#1E8B8B] hover:bg-[#1E8B8B]" : ""
        }
      >
        EUR (€)
      </Button>
    </div>
  );
};

CurrencySelector.propTypes = {
  currency: PropTypes.string.isRequired,
  setCurrency: PropTypes.func.isRequired
};

export default CurrencySelector;