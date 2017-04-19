import { tween } from 'shifty';

import props from './props';
import viewer from './viewer';
import settings from './settings';
import { Color } from './lib/three';

const BLACK = new Color(0, 0, 0);

export default class Orb {
  constructor() {
    this.mesh = props.sphere.clone();
    this.mesh.material = this.mesh.material.clone();
    const position = this.mesh.position;
    position.y = settings.holeHeight;
    position.z = 1000;
    viewer.scene.add(this.mesh);
  }

  _fade(from, to) {
    this.mesh.material.color.copy(from);
    tween({
      from,
      to,
      duration: 2000,
      easing: 'easeOutCubic',
      step: color => {
        this.mesh.material.color.copy(color);
      },
    });
  }

  fadeOut() {
    this._fade(settings.sphereColor, BLACK);
  }

  fadeIn() {
    this._fade(BLACK, settings.sphereColor);
  }

  move(z) {
    this.mesh.position.z = z;
  }

  destroy() {
    viewer.scene.remove(this.mesh);
  }
}
