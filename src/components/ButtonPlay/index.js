/** @jsx h */
import { h } from 'preact';

import ButtonItem from '../ButtonItem';
import icon from './icon.svg';

export default ({ onClick }) => (
  <ButtonItem
    onClick={onClick}
    icon={icon}
  />
);