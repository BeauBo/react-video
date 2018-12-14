import _ from 'lodash';

const component = () => {
  const element = document.createElement('div');
  element.innerHTML = _.join(['hello', 'webpack']);

  return element;
};

document.body.appendChild(component());
