export const togglePasswordVisibility = (el, name) => {
  if (el) {
    el.addEventListener('click', () => {
      let inputField = document.getElementById(`${name}`);
      inputField.type === 'password'
        ? (inputField.type = 'text')
        : (inputField.type = 'password');
    });
  }
};
