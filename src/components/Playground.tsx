import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import MamiTheBean from './Mami/MamiTheBean';
import Mami01 from './Mami/Mami01';
import { isMobileOrTablet, numFormatter } from '../helper';

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
    soundUrlList: [
      ...Array.from({ length: 13 }, (_, i) => `/sound/yafu${(i + 1).toString().padStart(3, '0')}.mp3`),
      ...Array.from({ length: 7 }, (_, i) => `/sound/bean-${(i + 1).toString().padStart(2, '0')}.mp3`),
      '/sound/bean-urusai.mp3',
    ],
  };

  isReduceLag: boolean = isMobileOrTablet();

  mamiImgList: string[] = [
    'Mami01',
    'MamiTheBean'
  ]

  apiUrl: string = 'https://api.mamiyaho.com/';

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

    1, // bean-01.mp3
    1, // bean-02.mp3
    1, // bean-03.mp3
    3, // bean-04.mp3
    1, // bean-05.mp3
    1, // bean-06.mp3
    1, // bean-07.mp3
    3, // bean-urusai.mp3
  ];

  pressedKeys: Set<string> = new Set(); // Track currently pressed keys

  lastRandomIndex: number | null = null; // Track the last random index

  componentDidMount() {
    this.getLastYaho();

    const storedCount = localStorage.getItem('count');
    if (storedCount) {
      this.setState({ count: parseInt(storedCount, 10) });
    }

    // Load sound files
    this.state.soundUrlList.forEach((soundUrl) => {
      const audio = new Audio(soundUrl);
      audio.preload = 'auto';
    });

    // Save count to localStorage every 2 seconds
    this.saveInterval = setInterval(() => {
      localStorage.setItem('count', this.state.count.toString());
      this.syncYahoo();
    }, 10e3);

    this.getLastYahoInterval = setInterval(() => {
      this.getLastYaho();
    }, 30e3);

    // Add event listeners
    window.addEventListener('click', this.increment);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    // Clear interval
    clearInterval(this.saveInterval);
    clearInterval(this.getLastYahoInterval);

    // Remove event listeners
    window.removeEventListener('click', this.increment);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (!this.pressedKeys.has(event.key)) {
      this.pressedKeys.add(event.key); // Add key to the set
      this.increment(); // Trigger increment only once per key press
    }
  };

  handleKeyUp = (event: KeyboardEvent) => {
    this.pressedKeys.delete(event.key); // Remove key from the set when released
  };

  saveInterval: ReturnType<typeof setInterval> | undefined;
  getLastYahoInterval: ReturnType<typeof setInterval> | undefined;
  currentPlaySoundCount: number = 0;

  async getLastYaho() {
    const response = await fetch(this.apiUrl);
    const data = await response.json();

    if(data.status === true) {
      this.setState({ globalCount: data.data.yaho });
    }
    return data;
  }

  async syncYahoo() {
    const { collectCount } = this.state;
    if(collectCount === 0) return;

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ yaho: collectCount }),
    });

    const data = await response.json();

    if(data.status === true) {
      this.setState({
        globalCount: data.data.yaho,
        collectCount: 0,
      });
    }
    return data;
  }

  playSound = () => {
    const { count, mamiList, soundUrlList } = this.state;

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * soundUrlList.length);
    } while (randomIndex === this.lastRandomIndex); // Ensure it's not the same as the last index

    this.lastRandomIndex = randomIndex; // Update the last random index

    const isMamiBean = randomIndex >= 12;

    const soundDuration = this.durationList[randomIndex] * 1000; // Convert to milliseconds

    const mamiSize = Math.max(200, Math.random() * (window.screen.height / 2));
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // คำนวณตำแหน่งที่ไม่ให้หลุดออกจากหน้าจอ
    const top = Math.max(0, Math.min(Math.random() * screenHeight - mamiSize, screenHeight - mamiSize));
    const left = Math.random() * (screenWidth - mamiSize); // Adjusted calculation for left

    const addMamiImage = () => {
      const MamiElement = {
        id: `mami-${count}`,
        imgType: this.mamiImgList[isMamiBean ? 1 : 0],
        top,
        left,
        size: mamiSize,
        rotate: Math.random() * 360,
        scale: Math.max(0.7, Math.random() * 1),
        exp: Date.now() + soundDuration,
      };

      this.setState({ mamiList: [...mamiList, MamiElement] });
    };

    if (!this.isReduceLag) {
      addMamiImage();
    } else if (this.isReduceLag && mamiList.length < 15) {
      addMamiImage();
    }

    if (!this.isReduceLag) {
      addMamiImage();
      const sound = new Audio(soundUrlList[randomIndex]);
      sound.volume = isMamiBean ? 0.3 : 0.4; // Set volume to 50%
      sound.play();
    } else if (this.isReduceLag && this.currentPlaySoundCount < 4) {
      this.currentPlaySoundCount++;
      const sound = new Audio(soundUrlList[randomIndex]);
      sound.volume = isMamiBean ? 0.4 : 0.4; // Set volume to 50%
      sound.play();

      // ลดจำนวน currentPlaySoundCount เมื่อเสียงเล่นจบ
      sound.addEventListener('ended', () => {
        this.currentPlaySoundCount--;
        if (this.currentPlaySoundCount < 0) {
          this.currentPlaySoundCount = 0;
        }
      });
    }

    setTimeout(() => {
      this.setState((prevState: IPlaygroundState) => {
        const newList = prevState.mamiList.filter((mami) => mami.exp > Date.now());
        let newCollectCount = prevState.collectCount + 1;

        if (newCollectCount > 500) newCollectCount = 500; // Limit to 500
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

    const globalCountDisplay = globalCount + collectCount;
    return (
      <>
        <div
          onTouchStart={this.increment}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1500,
          }}
        ></div>
        <motion.div className="topCenterContaienr">
          <motion.div className="globalCounterTxt"
            key={globalCountDisplay}
            initial={{
              opacity: 0.5,
              scale: 1.25,
              rotate: Math.round(Math.random() * 2) % 2 === 0 ? -10 : 10,
              color: 'rgb(57, 164, 154)',
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              color: '#000000'
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              duration: 0.05,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {globalCountDisplay === 0 && <p>--</p>}
            {globalCountDisplay > 0 && <p>{numFormatter(globalCountDisplay)}</p>}
            <p className="subTxt">ヤッホー！</p>
          </motion.div>
        </motion.div>
        <motion.div className="centerContainer">
          <motion.div
            key={count}
            className="counterTxt"
            initial={{
              opacity: 1,
              scale: 1.25,
              rotate: Math.round(Math.random() * 2) % 2 === 0 ? -10 : 10,
              color: '#81D8D0',
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              color: '#000000'
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
      </>
    );
  }
}

export default Playground;