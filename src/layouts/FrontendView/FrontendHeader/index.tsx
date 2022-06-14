import React, { useState, useEffect, useRef } from 'react';
import * as anchor from '@project-serum/anchor';
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import './Header.css'
import CONFIG from '../../../config';
import { getEnglishNumber, getProvider, numberToFixed } from '../../../utils/Helper';
import { IDL } from '../../../constants/idl';

const { COMMITMENT, PROGRAM_ID, VAULT_PDA } = CONFIG;

export const FrontendHeader = () => {

    const { connection } = useConnection();
    const wallet = useAnchorWallet();
    const [balance, setBalance] = useState(0);
    const [totalStakedCount, setTotalStakedCount] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                if (wallet) {
                    const curBalance = await connection.getBalance(wallet.publicKey!, COMMITMENT);
                    setBalance(numberToFixed(curBalance / 1000000000, 2));
                    const provider = getProvider(connection, wallet!);
                    const program = new anchor.Program(IDL, new anchor.web3.PublicKey(PROGRAM_ID), provider);
                    const vaultData = await program.account.vault.fetch(new anchor.web3.PublicKey(VAULT_PDA));
                    setTotalStakedCount(vaultData.stakedAmount);
                }
            }
            catch (error) {
                console.log('error', error);
            }
        })()
        // eslint-disable-next-line
    }, [wallet])
    const header = useRef(null);

    return (
        <header className="d_flex align_items_center justify_content_between frontend_header" ref={header}>
            <h1 className="font_roboto font_900">Dope Pirates - Bounty Game</h1>
            <h3>Total Staked: {getEnglishNumber(totalStakedCount)}</h3>
            <div className="d_flex align_items_center justify_content_between white connect_wallet">
                <WalletMultiButton className="wallet_button" />
                <div className="font_16 ml_24 balance">{getEnglishNumber(balance)}Sol</div>
            </div>
        </header>
    );
}
