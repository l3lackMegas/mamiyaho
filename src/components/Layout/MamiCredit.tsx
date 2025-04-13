import {motion} from 'motion/react';
import './MamiCredit.css';

function MamiBanner() {
    return (
        <a href='https://www.youtube.com/@MamiMumeiCh' rel='noopener noreferrer'>
            <motion.div className='banner-mami'>
                <motion.div className='banner-mami-container'>
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 100,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.5,
                            type: 'spring',
                            bounce: 0.25,
                        }}
                    >
                        <motion.div className='container-bg'>
                            <img
                                src='/banner.jpg'
                                alt='banner'
                            />
                        </motion.div>
                        <motion.div className='youtube-float-txt'>
                            <motion.div className='youtube-txt-container'>
                                <p className='txt-style'>MamiMumei Ch. 真美夢迷</p>
                                <button className='youtube-btn'>Subscribe</button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </a>
    )
}

export default MamiBanner;