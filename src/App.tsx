import './styles/global.css';
import './styles/fonts.css';
import './styles/app.css';
import './styles/layoutHome.css';

import React, { useMemo } from 'react';
import Modal  from 'react-modal';
import {
  BrowserRouter,
  Routes,
  Route, 
} from 'react-router-dom';

import { getPhantomWallet, getSolflareWallet } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

import { ToastProvider } from 'react-toast-notifications'

import { FrontendView } from "./layouts/FrontendView";

import Dashboard from './pages/Frontend/Dashboard';
import Pirates from './pages/Frontend/Pirates';
import Marines from './pages/Frontend/Marines';
import Missions from './pages/Frontend/Missions';
import MissionCreate from './pages/Frontend/Missions/MissionCreate';
import AddNfts from './pages/Frontend/Missions/AddNfts/Start';
import NftFields from './pages/Frontend/Missions/AddNfts/Start/NftFields';
import BorrowNftFields from './pages/Frontend/Missions/AddNfts/Fill/NftFields';
import BorrowNfts from './pages/Frontend/Missions/AddNfts/Fill';
import CONFIG from './config'

const { CLUSTER_API } = CONFIG;

require('@solana/wallet-adapter-react-ui/styles.css');

Modal.setAppElement('#root');

const AppWithProvider = () => {

  const wallets = useMemo(
    () => [getPhantomWallet(), getSolflareWallet()],
    []
  );
  return (

      <ConnectionProvider endpoint={CLUSTER_API}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <ToastProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<FrontendView />}>
                    <Route index element={<Dashboard />}></Route>
                    <Route path="dashboard" element={<Dashboard />}></Route>
                    <Route path="pirates" element={<Pirates />}></Route>
                    <Route path="marines" element={<Marines />}></Route>
                    <Route path="missions" element={<Missions />}></Route>
                    <Route path="missions/create" element={<MissionCreate />}></Route>
                    <Route path="missions/:missionId/add-nfts" element={<AddNfts />}></Route>
                    <Route path="missions/:missionId/borrow-nfts" element={<BorrowNfts />}></Route>
                    <Route path="missions/:missionId/add-nfts/:nftGroupIndex/nft-fields" element={<NftFields />}></Route>
                    <Route path="missions/:missionId/borrow-nfts/:nftGroupIndex/nft-fields" element={<BorrowNftFields />}></Route>
                    <Route path="*" element={<h1 className="text_center">Page not found!</h1>}></Route>
                  </Route>
                </Routes>
              </BrowserRouter>
            </ToastProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
  )
}
export default AppWithProvider;