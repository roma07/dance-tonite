/** @jsx h */
import 'babel-polyfill';
import { h, render } from 'preact';

import './theme/index.scss';
import * as THREE from './lib/three';
import router from './router';
import props from './props';
import feature from './utils/feature';
import Router from './containers/Router';
import viewer from './viewer';

window.THREE = THREE;

if (process.env.NODE_ENV === 'development') {
  require('preact/devtools');
}

if (process.env.FLAVOR === 'cms') {
  if (!localStorage.getItem('secret')) {
    router.navigate('/secret');
  }
}

(async () => {
  let root;
  await Promise.all([
    props.prepare(),
    // if we're on a mobile phone that doesn't support WebVR, use polyfill
    new Promise((resolve) => {
      if (!feature.vrPolyfill) return resolve();
      require.ensure([], function (require) {
        require('webvr-polyfill');
        window.WebVRConfig.BUFFER_SCALE = 0.75;
        window.polyfill = new window.WebVRPolyfill();
        console.log('WebVR polyfill');
        resolve();
      });
    }),
  ]);
  await feature.prepare();
  viewer.prepare();
  if (feature.isMobile) {
    document.body.classList.add('mod-mobile');
  }
  document.getElementById('initial').remove();
  render(<Router />, document.body, root);
})();
