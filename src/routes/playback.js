import Orb from '../orb';
import audio from '../audio';
import audioSrc from '../public/sound/lcd-14loops.ogg';
import Playlist from '../playlist';
import viewer from '../viewer';
import settings from '../settings';
import about from '../about';
import titles from '../titles';
import hud from '../hud';
import feature from '../utils/feature';

const { roomDepth, roomOffset, holeHeight } = settings;
const progressBar = document.querySelector('.audio-progress-bar');
const loopCount = 16;

const toggleVR = () => {
  if (viewer.vrEffect.isPresenting) {
    hud.exitVR();
    viewer.vrEffect.exitPresent();
    viewer.switchCamera('orthographic');
  } else {
    hud.enterVR();
    audio.fadeOut();
    setTimeout(() => {
      viewer.vrEffect.requestPresent().then(() => {
        viewer.switchCamera('default');
        setTimeout(() => {
          audio.rewind();
        }, 4000);
      });
    }, 600);
  }
};

let orb;
let playlist;
let tick;

const hudSettings = {
  menuAdd: true,
  menuEnter: toggleVR,
  aboutButton: about.toggle,
  colophon: true,
};

let mountComponent;
if (feature.isMobile) {
  hudSettings.playButton = function () {
    audio.fill();
    mountComponent();
    this.classList.add('mod-hidden');
  };
} else {
  audio.fill();
}

const mount = (req) => {
  titles.mount();
  viewer.switchCamera('orthographic');
  orb = new Orb();

  const moveCamera = (progress) => {
    const z = ((progress - 1.5) * roomDepth) + roomOffset;
    viewer.camera.position.set(0, holeHeight, z);
    orb.move(z);
  };

  hud.showLoader('Loading performances...');
  playlist = new Playlist({
    url: 'curated.json',
    pathRecording: req.params.id,
  });
  tick = () => {
    audio.tick();
    playlist.tick();
    titles.tick();
    progressBar.style.transform = 'scale(' + audio.progress / loopCount + ', 1)';
    moveCamera(audio.progress);
  };

  hud.showLoader('Spinning up the track...');
  audio.load({
    src: audioSrc,
    loops: loopCount,
    progressive: true,
  }, (loadError) => {
    if (loadError) throw loadError;
    hud.hideLoader();
    audio.play();
    viewer.events.on('tick', tick);
  });
};

export default {
  hud: hudSettings,

  mount: (req) => {
    if (feature.isMobile) {
      if (feature.isMobile) {
        mountComponent = () => {
          mount(req);
        };
      }
    } else {
      mount(req);
    }
  },

  unmount: () => {
    progressBar.style.width = 0;
    audio.reset();
    viewer.events.off('tick', tick);
    orb.destroy();
    titles.destroy();
    playlist.destroy();
  },
};
