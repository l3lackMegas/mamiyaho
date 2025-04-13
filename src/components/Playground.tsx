import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import MamiTheBean from './Mami/MamiTheBean';
import MamiBanner from './Layout/MamiCredit';
import Mami01 from './Mami/Mami01';
import { isSafari, numFormatter } from '../helper';

interface IPlaygroundState {
  globalCount: number;
  collectCount: number;
  count: number;
  mamiList: {
    id: string;
    imgType: string;
    top: number;
    left: number;
    size: number;
    rotate: number;
    scale: number;
    exp: number;
  }[];
  soundUrlList: string[];
}

class Playground extends React.Component {
  state: IPlaygroundState = {
    globalCount: 0,
    collectCount: 0,
    count: 0,
    mamiList: [],
    soundUrlList: Array.from({ length: 12 }, (_, i) => `/sound/yafu${(i + 1).toString().padStart(3, '0')}.mp3`),
  };

  audioMuted: boolean = isSafari();

  mamiImgList: string[] = [
    'Mami01',
    'MamiTheBean'
  ]

  durationList: number[] = [
    1, // yaafu001.mp3
    2, // yaafu002.mp3
    1, // yaafu003.mp3
    2, // yaafu004.mp3
    2, // yaafu005.mp3
    3, // yaafu006.mp3
    1, // yaafu007.mp3
    1, // yaafu008.mp3
    2, // yaafu009.mp3
    3, // yaafu010.mp3
    2, // yaafu011.mp3
    1, // yaafu012.mp3
    1, // yaafu013.mp3
  ];

  componentDidMount() {
    this.setState({ globalCount: 100000 });

    const storedCount = localStorage.getItem('count');
    if (storedCount) {
      this.setState({ count: parseInt(storedCount, 10) });
    }

    // Load sound files
    if(!this.audioMuted) {
        this.state.soundUrlList.forEach((soundUrl) => {
            const audio = new Audio(soundUrl);
            audio.preload = 'auto';
        });
    }

    // Save count to localStorage every 2 seconds
    this.saveInterval = setInterval(() => {
      localStorage.setItem('count', this.state.count.toString());
    }, 2000);

    // Add event listeners
    window.addEventListener('click', this.increment);
    window.addEventListener('keydown', this.increment);
    window.addEventListener('touchstart', this.increment);
  }

  componentWillUnmount() {
    // Clear interval
    clearInterval(this.saveInterval);

    // Remove event listeners
    window.removeEventListener('click', this.increment);
    window.removeEventListener('keydown', this.increment);
    window.removeEventListener('touchstart', this.increment);
  }

  saveInterval: ReturnType<typeof setInterval> | undefined;

  playSound = () => {
    const { count, mamiList, soundUrlList } = this.state;

    const randomIndex = Math.floor(Math.random() * soundUrlList.length);

    const soundDuration = this.durationList[randomIndex] * 1000; // Convert to milliseconds

    const mamiSize = Math.max(200, Math.random() * (window.screen.height / 2));
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // คำนวณตำแหน่งที่ไม่ให้หลุดออกจากหน้าจอ
    const top = Math.max(0, Math.min(Math.random() * screenHeight - mamiSize, screenHeight - mamiSize));
    const left = Math.max(0, Math.min(Math.random() * screenWidth - mamiSize, screenWidth - mamiSize));

    const MamiElement = {
      id: `mami-${count}`,
      imgType: this.mamiImgList[Math.floor(Math.random() * this.mamiImgList.length)],
      top,
      left,
      size: mamiSize,
      rotate: Math.random() * 360,
      scale: Math.max(0.7, Math.random() * 1),
      exp: Date.now() + soundDuration,
    };

    this.setState({ mamiList: [...mamiList, MamiElement] });

    if(!this.audioMuted) {
        const sound = new Audio(soundUrlList[randomIndex]);
        sound.play();
    }

    setTimeout(() => {
      this.setState((prevState: IPlaygroundState) => {
        const newList = prevState.mamiList.filter((mami) => mami.exp > Date.now());
        return {
          mamiList: newList,
          collectCount: prevState.collectCount + 1,
        };
      });
    }, soundDuration + 100);
  };

  increment = () => {
    this.playSound();
    this.setState((prevState: IPlaygroundState) => ({ count: prevState.count + 1 }));
  };

  render() {
    const { globalCount, collectCount, count, mamiList } = this.state;

    return (
      <>
        <motion.div className="topCenterContaienr">
          <motion.div className="globalCounterTxt"
            key={globalCount + collectCount}
            initial={{
              opacity: 0.5,
              scale: 1.25,
              rotate: Math.round(Math.random() * 2) % 2 === 0 ? -10 : 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              duration: 0.05,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <p>{numFormatter(globalCount + collectCount)}</p>
            <p className="subTxt">ヤッホー！</p>
          </motion.div>
        </motion.div>
        <motion.div className="centerContainer">
          <motion.div
            key={count}
            className="counterTxt"
            initial={{
              opacity: 0.5,
              scale: 1.25,
              rotate: Math.round(Math.random() * 2) % 2 === 0 ? -10 : 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              duration: 0.05,
              ease: [0.4, 0, 0.2, 1],
            }}
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
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    transition: {
                      duration: 0.25,
                    },
                  }}
                >
                  {mamiElm.imgType === 'Mami01' && (
                    <Mami01 {...mamiElm} />
                  )}
                  {mamiElm.imgType === 'MamiTheBean' && (
                    <MamiTheBean {...mamiElm} />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <MamiBanner/>
      </>
    );
  }
}

export default Playground;