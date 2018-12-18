import _ from 'lodash';
import printMe from './print';
import './styles.css';

const component = () => {
  const element = document.createElement('div');
  const btn = document.createElement('button');

  element.innerHTML = _.join(['hello', 'webpack']);

  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = printMe;

  element.appendChild(btn);
  return element;
};

let element = component();

document.body.appendChild(element);


if (module.hot) {
  module.hot.accept('./print.js', () => {
    console.log('Accepting the updated printMe module!'); // eslint-disable-line no-console
    document.body.removeChild(element);
    element = component();
    document.body.appendChild(element);
  });
}
