/* eslint-disable */

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, msg, icon) => {
  hideAlert();

  const markup = `<div class="alert alert__container alert__container--${type}">
                    <svg class="alert__icon alert__icon--${type}">
                        <use xlink:href="http://127.0.0.1:3000/img/sprite.svg#icon-${icon}"></use>
                    </svg>
                    <p class="alert__message alert__message--${type}">
                        ${msg}
                    </p>
                    
                </div>`;

  document.querySelector('body').insertAdjacentHTML('beforeend', markup);

  window.setTimeout(hideAlert, 3000);
};
