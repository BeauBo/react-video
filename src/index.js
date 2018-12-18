import _ from 'lodash';
import printMe from './print';
// import './style.css';
// import Icon from './Avatar.jpg';
// import Data from './data.xml';

const component = () => {
  const element = document.createElement('div');
  element.innerHTML = _.join(['hello', 'webpack']);
  element.classList.add('hello');

  // const myIcon = new Image();
  // myIcon.src = Icon;

  // element.appendChild(myIcon);

  // console.log(Data);
  printMe();

  return element;
};

document.body.appendChild(component());
