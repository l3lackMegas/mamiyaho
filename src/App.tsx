import React from 'react';
import './App.css';
import Playground from './components/Playground';
import { motion } from 'motion/react';
import MamiBanner from './components/Layout/MamiCredit';

function App() {

  const [showInformationModal, setShowInformationModal] = React.useState(false);

  const InfomationIcon = () => {
    return (
      <svg className="informationIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"></path>
        <path d="M12 16v-4"></path>
        <path d="M12 8h0"></path>
      </svg>
    );
  };
  return <>
    <div className="informationIcon"
      onClick={() => {
        setShowInformationModal(!showInformationModal);
      }}
    ><InfomationIcon/></div>

    {showInformationModal && (
      <div className='informationModal'>
        <motion.div className='informationModalContent'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className='informationModalTitle'>About</h2>
          <div className='informationModalText'>
            This is a fan site dedicated to the <a href="https://www.youtube.com/@MamiMumeiCh">MamiMumei</a> from Papa <a href="https://www.youtube.com/@NAK3DS">NAK3DS</a>'s NAKAMA crew.
            Please support them by subscribing through their various channels and purchasing their merchandise!
            <br /><br />
            This website uses cookies to record your score count and may collect anonymous website usage statistics through Cloudflare (we need Cloudflare to save costs for this Hobby Project).
            <br /><br />
            We do not accept any donations!
            <br />
            If you want to support us, please send your support to the Talents instead,
            <br />
            or you can support us by contributing code on <a href="https://github.com/l3lackMegas/mamiyahoo" target='_blank'>GitHub</a>.
          </div>
          <br />
          <button className='informationModalCloseButton' onClick={() => setShowInformationModal(false)}>Close</button>
        </motion.div>
        <div className='informationModalOverlay' onClick={() => setShowInformationModal(false)}></div>
      </div>
    )}

    <MamiBanner/>
    <Playground />
  </>;
}

export default App;