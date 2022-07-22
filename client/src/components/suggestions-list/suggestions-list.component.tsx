import { Suggestion } from "../../utils/nutritionix/nutritionix.util";

const SuggestionsList = (options: Suggestion[]) => {
  return (
    <>
      {options.length > 0 ? (
        <ul className="suggestions">
          {options.map((suggestion, index) => {
            return <li key={index}>{suggestion.food_name}</li>;
          })}
        </ul>
      ) : (
        <div className="no-suggestions">
          <em>No suggestions, you're on your own!</em>
        </div>
      )}
    </>
  );
};

export default SuggestionsList;
