/* eslint-disable */
/*********** Toogle Advanced Search Menu ****************/
export const toggleAdvancedSearch = (
  advancedSearch,
  advancedSearchSwitch,
  advancedSearchFilters
) => {
  advancedSearch.addEventListener('click', () => {
    advancedSearchSwitch.classList.toggle('switch-color-red');
    advancedSearchFilters.classList.toggle('hide-menu');
  });
};
