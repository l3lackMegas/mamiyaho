import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import MamiTheBean from './Mami/MamiTheBean';
import Mami01 from './Mami/Mami01';
import { isMobileOrTablet, numFormatter } from '../helper';

interface IMamiElement {
  id: string;
  imgType: string;
  top: number;
  left: number;
  size: number;
  rotate: number;
  scale: number;
  exp: number;
}

interface IPlaygroundState {
  globalCount: number;
  collectCount: number;
  count: number;
  mamiList: IMamiElement[];
  soundUrlList: string[];
}

class Playground extends React.Component<object, IPlaygroundState> {
  state: IPlaygroundState = {
    globalCount: 0,
    collectCount: 0,
    count: 0,
    mamiList: [],
    soundUrlList: this.generateSoundUrls(),
  };

  isReduceLag = isMobileOrTablet();
  mamiImgList = ['Mami01', 'MamiTheBean'];
  apiUrl = 'https://api.mamiyaho.com/';
  durationList = this.generateDurationList();
  pressedKeys = new Set<string>();
  lastRandomIndex: number | null = null;
  saveInterval?: ReturnType<typeof setInterval>;
  getLastYahoInterval?: ReturnType<typeof setInterval>;
  currentPlaySoundCount = 0;

  componentDidMount() {
    this.initializeState();
    this.addEventListeners();
  }

  componentWillUnmount() {
    this.cleanup();
  }

  generateSoundUrls() {
    return [
      ...Array.from({ length: 13 }, (_, i) => `/sound/yafu${(i + 1).toString().padStart(3, '0')}.mp3`),
      ...Array.from({ length: 7 }, (_, i) => `/sound/bean-${(i + 1).toString().padStart(2, '0')}.mp3`),
      '/sound/bean-urusai.mp3',
    ];
  }

  generateDurationList() {
    return [
      1, 2, 1, 2, 2, 3, 1, 1, 2, 3, 2, 1, 1, // yaafu durations
      1, 1, 1, 3, 1, 1, 1, // bean durations
      3, // urusai duration
    ];
  }

  initializeState() {
    this.getLastYaho();
    const storedCount = localStorage.getItem('count');
    if (storedCount) {
      this.setState({ count: parseInt(storedCount, 10) });
    }
    this.preloadSounds();
    this.setupIntervals();
  }

  preloadSounds() {
    this.state.soundUrlList.forEach((soundUrl) => {
      const audio = new Audio(soundUrl);
      audio.preload = 'auto';
    });
  }

  setupIntervals() {
    this.saveInterval = setInterval(() => {
      localStorage.setItem('count', this.state.count.toString());
      this.syncYahoo();
    }, 10e3);

    this.getLastYahoInterval = setInterval(() => {
      this.getLastYaho();
    }, 30e3);
  }

  addEventListeners() {
    window.addEventListener('click', this.increment);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  cleanup() {
    clearInterval(this.saveInterval);
    clearInterval(this.getLastYahoInterval);
    window.removeEventListener('click', this.increment);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (!this.pressedKeys.has(event.key)) {
      this.pressedKeys.add(event.key);
      this.increment();
    }
  };

  handleKeyUp = (event: KeyboardEvent) => {
    this.pressedKeys.delete(event.key);
  };

  async getLastYaho() {
    try {
      const response = await fetch(this.apiUrl);
      const data = await response.json();
      if (data.status) {
        this.setState({ globalCount: data.data.yaho });
      }
    } catch (error) {
      console.error('Error fetching last Yaho:', error);
    }
  }

  async syncYahoo() {
    const { collectCount } = this.state;
    if (collectCount === 0) return;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yaho: collectCount }),
      });
      const data = await response.json();
      if (data.status) {
        this.setState({ globalCount: data.data.yaho, collectCount: 0 });
      } else {
        this.resetCollectCount();
      }
    } catch (error) {
      console.error('Error syncing data:', error);
      this.resetCollectCount();
    }
  }

  resetCollectCount() {
    this.setState({ collectCount: 0 });
    this.getLastYaho();
  }

  playSound = () => {
    // Removed unused destructured variables
    const randomIndex = this.getRandomSoundIndex();
    const isMamiBean = randomIndex > 12;
    const soundDuration = this.durationList[randomIndex] * 1000;
    const mamiSize = Math.max(200, Math.random() * (window.screen.height / 2));
    const { top, left } = this.calculatePosition(mamiSize);

    this.addMamiImage(isMamiBean, mamiSize, top, left, soundDuration);
    this.playAudio(randomIndex, isMamiBean);

    setTimeout(() => {
      this.updateMamiList();
    }, soundDuration + 100);
  };

  getRandomSoundIndex() {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * this.state.soundUrlList.length);
    } while (randomIndex === this.lastRandomIndex);
    this.lastRandomIndex = randomIndex;
    return randomIndex;
  }

  calculatePosition(mamiSize: number) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const top = Math.max(0, Math.min(Math.random() * screenHeight - mamiSize, screenHeight - mamiSize));
    const left = Math.random() * (screenWidth - mamiSize);
    return { top, left };
  }

  addMamiImage(isMamiBean: boolean, mamiSize: number, top: number, left: number, soundDuration: number) {
    const { count, mamiList } = this.state;
    const MamiElement: IMamiElement = {
      id: `mami-${count}`,
      imgType: this.mamiImgList[isMamiBean ? 1 : 0],
      top,
      left,
      size: mamiSize,
      rotate: Math.random() * 360,
      scale: Math.max(0.7, Math.random() * 1),
      exp: Date.now() + soundDuration,
    };

    if (!this.isReduceLag || (this.isReduceLag && mamiList.length < 15)) {
      this.setState({ mamiList: [...mamiList, MamiElement] });
    }
  }

  playAudio(randomIndex: number, isMamiBean: boolean) {
    if (!this.isReduceLag || (this.isReduceLag && this.currentPlaySoundCount < 4)) {
      this.currentPlaySoundCount++;
      const sound = new Audio(this.state.soundUrlList[randomIndex]);
      sound.volume = isMamiBean ? 0.4 : 0.4;
      sound.play();
      sound.addEventListener('ended', () => {
        this.currentPlaySoundCount = Math.max(0, this.currentPlaySoundCount - 1);
      });
    }
  }

  updateMamiList() {
    this.setState((prevState) => {
      const newList = prevState.mamiList.filter((mami) => mami.exp > Date.now());
      const newCollectCount = Math.min(prevState.collectCount + 1, 500);
      return { mamiList: newList, collectCount: newCollectCount };
    });
  }

  increment = () => {
    this.playSound();
    this.setState((prevState) => ({ count: prevState.count + 1 }));
  };

  render() {
    const { globalCount, collectCount, count, mamiList } = this.state;
    const globalCountDisplay = globalCount + collectCount;

    return (
      <>
        <div
          onTouchStart={this.increment}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1500 }}
        ></div>
        <motion.div className="topCenterContaienr">
          <motion.div
            className="globalCounterTxt"
            key={globalCountDisplay}
            initial={{ opacity: 0.5, scale: 1.25, rotate: Math.random() > 0.5 ? -10 : 10, color: 'rgb(57, 164, 154)' }}
            animate={{ opacity: 1, scale: 1, rotate: 0, color: '#000000' }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.05, ease: [0.4, 0, 0.2, 1] }}
          >
            {globalCountDisplay === 0 ? <p>--</p> : <p>{numFormatter(globalCountDisplay)}</p>}
            <p className="subTxt">ヤッホー！</p>
          </motion.div>
        </motion.div>
        <motion.div className="centerContainer">
          <motion.div
            key={count}
            className="counterTxt"
            initial={{ opacity: 1, scale: 1.25, rotate: Math.random() > 0.5 ? -10 : 10, color: '#81D8D0' }}
            animate={{ opacity: 1, scale: 1, rotate: 0, color: '#000000' }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.05, ease: [0.4, 0, 0.2, 1] }}
          >
            {numFormatter(count)}
          </motion.div>
        </motion.div>
        <motion.div className="mami-playground">
          <motion.div className="container-area">
            <AnimatePresence mode="popLayout">
              {mamiList.map((mamiElm) => (
                <motion.div
                  key={mamiElm.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.25 } }}
                >
                  {mamiElm.imgType === 'Mami01' && <Mami01 {...mamiElm} />}
                  {mamiElm.imgType === 'MamiTheBean' && <MamiTheBean {...mamiElm} />}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </>
    );
  }
}

export default Playground;