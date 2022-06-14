import { useState, useEffect } from 'react'
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useToasts } from 'react-toast-notifications'

import gifChance0 from '../../../assets/frontend/chance0.gif';
import gifChance1 from '../../../assets/frontend/chance1.gif';

import { 
  delay,
  getCombosBoosts, 
  getCurrentChainTime, 
  getEnglishNumber, 
  getHasAffected, 
  getMetadataListWithCombo, 
  getMetaValuesFromAttributes, 
  getMultiplier, 
  getNftInfo, 
  getProvider, 
  makeATokenAccountTransaction,
  
} from "../../../utils/Helper";

import Pirate from "../../../components/Pirate"

import './index.css';
import { SolanaClient, SolanaClientProps } from '../../../helpers/sol';
import { IDL } from '../../../constants/idl';
import CONFIG from '../../../config';
import { sendTransactions, SequenceType } from '../../../helpers/sol/connection';
import Button from '../../../components/Button';

const { PublicKey, SystemProgram } = anchor.web3;
const { 
  CLUSTER_API, 
  PRIATE_CANDY_MACHINE_CREATOR1,
  PRIATE_CANDY_MACHINE_CREATOR2,
  MARINE_CANDY_MACHINE_CREATOR,
  PROGRAM_ID, 
  POOL_SEEDS, 
  TOKEN_DATA_SEEDS, 
  REWARD_ATOKEN_ACCOUNT,
  REWARD_TOKEN,
  VAULT_PDA,
  // ADMIN_DATA_PDA,
  STAKED_DATA_SEEDS,
  NEXT_STAKING_PERIOD,
  DAY_TIME,
  TRANSFERABLE_NFTS_ONCE,
  // ADD_NFT_METADATA_COUNT_ONCE,
  UPDATE_INSTRUCTION_COUNT_PER_TRANSACTION,
  STAKE_INSTRUCTION_COUNT_PER_TRANSACTION,
  // UPDATE_INTERVAL,
  CLAIM_SEEDS,
  FEE_OWNER,
  UPDATE_REWARD_INSTRUCTION_COUNT_PER_TRANSACTION
} = CONFIG;

function Pirates() {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const solanaClient = new SolanaClient({ rpcEndpoint: CLUSTER_API } as SolanaClientProps);
  const [pirates, setPirates] = useState<any>([]);
  const [isEnableConfirm, setIsEnableConfirm] = useState(false);
  const [rumEarned, setRumEarned] = useState(0);
  const [combos_boosts, setCombosBoosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [gifState, setGifState] = useState(-1);
  const { addToast } = useToasts();

  useEffect(() => {
    (async () => {
      if (wallet) {
        setLoading(true)
        await loadData();
        setLoading(false);
      }
    })()
    // eslint-disable-next-line
  }, [wallet])

  const loadData = async () => {
    try {
      // get pirates from wallet and pool
      const walletPbk = wallet!.publicKey; 
      // get pool pda
      let [pool] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(POOL_SEEDS), walletPbk.toBuffer()],
        new PublicKey(PROGRAM_ID)
      );
      
      const wallets = [walletPbk.toString(), pool.toString()];
     
      let pirateList = await solanaClient.getAllCollectibles(wallets, [
          { candyMachineCreator: PRIATE_CANDY_MACHINE_CREATOR1},
          { candyMachineCreator: PRIATE_CANDY_MACHINE_CREATOR2}
      ]);
     
      let pirates: any[] = [];
      // merge pirates from wallet and pool
  
      if (pirateList[pool.toString()] && pirateList[pool.toString()]?.length > 0) {
        pirates = [
          ...pirates,
          ...pirateList[pool.toString()]?.map((pirate: any) => ({
            ...pirate,
            status: 1,
            enableState: 0
          }))
        ]
        const combosBoosts: any[] = await getCombosBoosts(pirateList[pool.toString()].map((pirate: any) => ({...pirate.attributes})));
        setCombosBoosts(combosBoosts);
      }
   
      if (pirateList[walletPbk.toString()] && pirateList[walletPbk.toString()]?.length > 0) {
        pirates = [
          ...pirates,
          ...pirateList[walletPbk.toString()]?.map((pirate: any) => ({
            ...pirate,
            status: 0,
            enableState: 0
          }))
        ]
      }
      await setIntervalForUpdate(pirates);
      
      // check confirm state
      const confirmEnabled = (pirates.filter((pirate: any) => pirate.enableState > 0).length > 0);
      setIsEnableConfirm(confirmEnabled);
    }
    catch (error) {
      console.log('error', error);
    }
  }

  // handle status of pirate when clicking button
  const handlePirateStatus = async (index: number, status: number) => {
    let newPirates = pirates;
    const selectedPirates = newPirates.filter((pirate: any) => pirate.enableState > 0);
    if (selectedPirates.length === TRANSFERABLE_NFTS_ONCE && newPirates[index].enableState <= 0) {
      addToast(`You can only deal with ${TRANSFERABLE_NFTS_ONCE} pirates at once.`, {
        appearance: 'warning',
        autoDismiss: true,
      });
      return;
    }

    if (newPirates[index].enableState <= 0 && newPirates[index].status === 0) {
      try {
        setLoading(true);
        let [tokenDataPda] = await anchor.web3.PublicKey.findProgramAddress(
          [Buffer.from(TOKEN_DATA_SEEDS), new PublicKey(newPirates[index].mint).toBuffer()],
          new PublicKey(PROGRAM_ID)
        );
        let tokenDataInfo = await connection.getAccountInfo(tokenDataPda);
        if (tokenDataInfo) {
          const provider = getProvider(connection, wallet!);
          const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider);
          let tokenData = await program.account.tokenData.fetch(tokenDataPda);
          const currentTime = await getCurrentChainTime(connection);
          // if (tokenData.lastStakedUser.toString() === wallet!.publicKey.toString() && (currentTime! - tokenData.lastUnstakedTime) < DAY_TIME * NEXT_STAKING_PERIOD) {
          //   addToast(`Staking is allowed after ${NEXT_STAKING_PERIOD - Math.max(Math.floor((currentTime! - tokenData.lastUnstakedTime) / DAY_TIME), 0)}day(s)`, {
          //     appearance: 'warning',
          //     autoDismiss: true,
          //   });
          //   setLoading(false);
          //   return;
          // }
        }
        setLoading(false);
      }
      catch (error) {
        console.log('error', error);
        setLoading(false);
        return;
      }
    }     
    if (newPirates[index].enableState > 0) { 
      if (newPirates[index].status === status) {
        newPirates[index].enableState = 0;
      }
      else {
        if (newPirates[index].status === 1) {
          newPirates[index].status = 2;
        }
        else if (newPirates[index].status === 2) {
          newPirates[index].status = 1;
        }
      }
    }
    else { 
      newPirates[index].enableState = 1;
      newPirates[index].status = status;
    }
    // check confirm state
    const confirmEnabled = (newPirates.filter((pirate: any) => pirate.enableState > 0).length > 0);
    setIsEnableConfirm(confirmEnabled);
    setPirates([...newPirates]);
  }
  // handle transaction of staking and unstaking when confirming
  const handleConfirm = async () => {
    try {
      setLoading(true)
      // build instructions and signers of staking and unstaking transactions
      let instructionSet: any[] = [], signerSet: any[] = [];
      let instructions: any = [], signers: any[] = [];
      let newPirates = [...pirates];

      const provider = getProvider(connection, wallet!);
      const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider);

      const createPoolTx = await makeCreatePoolTransaction();
      instructions = [...instructions, ...createPoolTx.instructions];
      signers = [...signers, ...createPoolTx.signers];

      if (instructions.length > 0) {
        instructionSet.push(instructions);
        signerSet.push(signers);
        await sendTransactions(connection, wallet, instructionSet, signerSet);
        instructionSet = [];
        signerSet = [];
      }

      const stakingPirates = newPirates.filter((pirate: any) => pirate.enableState > 0 && pirate.status === 0);
      const unstakingPirates = newPirates.filter((pirate: any) => pirate.enableState > 0 && pirate.status === 1);
      const claimPirates = newPirates.filter((pirate: any) => pirate.enableState > 0 && pirate.status === 2);

      for (let i = 0; i < stakingPirates.length; i += STAKE_INSTRUCTION_COUNT_PER_TRANSACTION) {
        let transaction: any[] = [], txSigners: any[] = [];
        for (let j = 0; j < STAKE_INSTRUCTION_COUNT_PER_TRANSACTION; j ++) {
          if (i + j >= stakingPirates.length) break;
          const pirate = stakingPirates[i + j];
          const { instructions, signers, nftTo } = await makeStakeTransaction(pirate);
          transaction = [
            ...transaction,
            ...instructions
          ];
          txSigners = [
            ...txSigners,
            ...signers
          ];
          const index = newPirates.findIndex((item: any) => item.mint === pirate.mint);
          if (index >= 0) {
            newPirates[index].tokenAccount = nftTo.toString();
          }
        }
        if (transaction.length > 0) {
          instructionSet.push(transaction);
          signerSet.push(txSigners);
        }
      }

      if (unstakingPirates.length > 0) {
        const rewardTransaction = await makeATokenAccountTransaction(connection, wallet!.publicKey, wallet!.publicKey, new PublicKey(REWARD_TOKEN));
        if (rewardTransaction.instructions.length > 0) {
          instructionSet.push(rewardTransaction.instructions);
          signerSet.push(rewardTransaction.signers);
        }
        const tokenTo = rewardTransaction.tokenTo;

        for (let i = 0; i < unstakingPirates.length; i += STAKE_INSTRUCTION_COUNT_PER_TRANSACTION) {
          let transaction: any[] = [], txSigners: any[] = [];
          for (let j = 0; j < STAKE_INSTRUCTION_COUNT_PER_TRANSACTION; j ++) {
            if (i + j >= unstakingPirates.length) break;
            const pirate = unstakingPirates[i + j];
            const { instructions, signers, nftTo } = await makeUnstakeTransaction(pirate, tokenTo);
            transaction = [
              ...transaction,
              ...instructions
            ];
            txSigners = [
              ...txSigners,
              ...signers
            ];
            const index = newPirates.findIndex((item: any) => item.mint === pirate.mint);
            if (index >= 0) {
              newPirates[index].tokenAccount = nftTo.toString();
            }
          }
          if (transaction.length > 0) {
            instructionSet.push(transaction);
            signerSet.push(txSigners);
          }
        }
      }
      // changed state
      const stakedPirates = newPirates.filter((pirate: any) => pirate.enableState > 0 && pirate.status === 0);
      const unStakedPirates = newPirates.filter((pirate: any) => pirate.enableState > 0 && pirate.status === 1);
      const poolPirates = newPirates.filter((pirate: any) => (pirate.enableState <= 0 && (pirate.status === 1 || pirate.status === 2)) || (pirate.enableState > 0 && pirate.status === 0));
      let metadataList = getMetadataList(poolPirates);
      metadataList = metadataList.map((metadata: any) => ({
        ...getMetaValuesFromAttributes(metadata)
      }))

      const stakedCount = stakedPirates.length;
      const unStakedCount = unStakedPirates.length;
      const claimedCount = claimPirates.length;
      // claim
      let [claim, bump] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(CLAIM_SEEDS), wallet!.publicKey.toBuffer()],
        new PublicKey(PROGRAM_ID)
      );
      if (claimedCount > 0) {
        let instructions: any[] = [], signers: any[] = [];
    
        const claimInfo = await connection.getAccountInfo(claim);
        if (!claimInfo) {
          const createClaimTx = await makeCreateClaimTx(claim, bump);
          instructions = [...createClaimTx.instructions];
          signers = [...createClaimTx.signers];
        }

        const prepareClaimTx = await makePrepareClaimTx(claim);
        instructions = [...instructions, ...prepareClaimTx.instructions];
        signers = [...signers, ...prepareClaimTx.signers];

        instructionSet.push(instructions);
        signerSet.push(signers);

        for (let i = 0; i < claimPirates.length; i ++) {
          const pirate = claimPirates[i];
          if (pirate.status === 0) {
            continue;
          }

          const claimTx = await makeClaimTx(claim, pirate);
          instructions = [...claimTx.instructions];
          signers = [...claimTx.signers];
    
          instructionSet.push(instructions);
          signerSet.push(signers);
        }
      }

      if (stakedCount > 0 || unStakedCount > 0) {
        const metadataOnChain = poolPirates.map((pirate: any) => {
          const metadata = getMetaValuesFromAttributes(pirate.attributes);
          return {
            ...metadata,
            id: parseInt(pirate.name.replace('Dope Pirates #', '')),
            job: metadata['crew job']
          }
        })
  
        const { metadataWithComboList ,affectedByUnexpectedEssentialList }= await getMetadataListWithCombo(metadataOnChain);
        for (let i = 0; i < poolPirates.length; i += UPDATE_INSTRUCTION_COUNT_PER_TRANSACTION) {
          let transaction: any[] = [], txSigners: any[] = [];
          for (let j = 0; j < UPDATE_INSTRUCTION_COUNT_PER_TRANSACTION; j ++) {
            if (i + j >= poolPirates.length) break;
            if (metadataList.length > 0) {
              const id = parseInt(poolPirates[i + j].name.replace('Dope Pirates #', ''));
              const multiplier = getMultiplier(id, metadataWithComboList);
              const hasAffected = getHasAffected(id, affectedByUnexpectedEssentialList);
              const { instructions, signers } = await makeUpdateRewardTransaction(multiplier, hasAffected, poolPirates[i + j]);
              transaction = [...transaction, ...instructions];
              txSigners = [...txSigners, ...signers];
            }
          }
          if (transaction.length > 0) {
            instructionSet.push(transaction);
            signerSet.push(txSigners);
          }
        }
      }

      const result = await sendTransactions(connection, wallet, instructionSet, signerSet, SequenceType.StopOnFailure);
      let title = '';
      if (stakedCount > 0) {
        title =`${title} ${stakedCount} pirate(s) staked successfully`
      }
      if (unStakedCount > 0) {
        title =`${title} ${unStakedCount} pirate(s) unstaked successfully`
      }

      if (result.success) {
        await delay(5000);
        await changeState(newPirates);
        if (stakedCount > 0 || unStakedCount > 0) {
          addToast(title, {
            appearance: 'success',
            autoDismiss: true,
          });
        }
        if (claimedCount > 0) {
          const claimData = await program.account.claim.fetch(claim);
          console.log('claimData', claimData);
          setGifState(claimData.chance);
        }
      }
      else {
        addToast('Action failed. System will restart.', {
          appearance: 'error',
          autoDismiss: true,
        });  
      }
      setLoading(false);
    }
    catch (error: any) {
      if (error?.message?.indexOf('User rejected the request.') < 0) {
        addToast('Action failed', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
      console.log('error', error);
      setLoading(false);
    }
  }

  const getMetadataList = (pirateList: any[]) => {
    let metadataList: any[] = pirateList.map((pirate: any) => ({
      ...pirate.attributes
    }))

    return metadataList;
  }

  const makeCreatePoolTransaction = async () => {
    const provider = getProvider(connection, wallet!);
    const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider);
   
    let instructions: any[] = [], signers: any[] = [];

    let [pool, bumpPool] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(POOL_SEEDS), wallet!.publicKey!.toBuffer()],
      new PublicKey(PROGRAM_ID)
    );

    const poolInfo:any = await connection.getAccountInfo(pool);
    if (!poolInfo) {
      instructions.push(program.instruction.createPool(bumpPool, {
        accounts: {
          pool: pool,
          user: wallet!.publicKey!,
          systemProgram: SystemProgram.programId
        }
      }));  
    }

    return { instructions, signers };
  }

  const makeStakeTransaction = async (pirate: any) => {
    const provider = getProvider(connection, wallet!);
    const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider);

    let instructions: any[] = [], signers: any[] = [];
    let [pool] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(POOL_SEEDS), wallet!.publicKey!.toBuffer()],
      new PublicKey(PROGRAM_ID)
    );

    let [tokenDataPda, bumpTokenData] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(TOKEN_DATA_SEEDS), new PublicKey(pirate.mint).toBuffer()],
      new PublicKey(PROGRAM_ID)
    );

    let [stakedDataPda, bumpStakedData] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(STAKED_DATA_SEEDS), wallet!.publicKey!.toBuffer(), new PublicKey(pirate.mint).toBuffer()],
      new PublicKey(PROGRAM_ID)
    );

    const metadata = getMetaValuesFromAttributes(pirate.attributes);
    const tokenDataInfo = await connection.getAccountInfo(tokenDataPda);
    if (tokenDataInfo) {
      // const tokenData = await program.account.tokenData.fetch(tokenDataPda);
      instructions.push(
        program.instruction.updateTokenData({
          ...metadata,
          id: parseInt(pirate.name.replace('Dope Pirates #', '')),
          job: metadata['crew job']
        }, {
          accounts: {
            tokenData: tokenDataPda,
            user: wallet!.publicKey,
            mint: new PublicKey(pirate.mint),
            systemProgram: SystemProgram.programId
          }
        })
      );
    }
    else {
      instructions.push(
        program.instruction.createTokenData({
          ...metadata,
          id: parseInt(pirate.name.replace('Dope Pirates #', '')),
          job: metadata['crew job']
        }, bumpTokenData, {
          accounts: {
            tokenData: tokenDataPda,
            user: wallet!.publicKey,
            mint: new PublicKey(pirate.mint),
            systemProgram: SystemProgram.programId
          }
        })
      );
    }
    // check if pool has associated accounts to hold pirate, else create it
    const transaction = await makeATokenAccountTransaction(connection, wallet!.publicKey, pool, new PublicKey(pirate.mint));
    instructions = [ ...instructions, ...transaction.instructions ];
    signers = [ ...signers, ...transaction.signers];
    const nftTo = transaction.tokenTo;

    // modify metadata to send as param of on-chain program function
    instructions.push(program.instruction.stake(bumpStakedData, {
      accounts: {
        vault: new PublicKey(VAULT_PDA),
        stakedData: stakedDataPda,
        tokenData: tokenDataPda,
        pool: pool,
        user: wallet!.publicKey,
        mint: new PublicKey(pirate.mint),
        metadata: pirate.program[0],
        nftFrom: new PublicKey(pirate.tokenAccount),
        nftTo: nftTo,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId
      }
    }));

    return { instructions, signers, nftTo }
  }

  const makeUnstakeTransaction = async (pirate: any, tokenTo: anchor.web3.PublicKey) => {
    const provider = getProvider(connection, wallet!);
    const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider);

    let instructions: any[] = [], signers: any[] = [];
    let [pool] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(POOL_SEEDS), wallet!.publicKey!.toBuffer()],
      new PublicKey(PROGRAM_ID)
    );

    let [tokenDataPda, bumpTokenData] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(TOKEN_DATA_SEEDS), new PublicKey(pirate.mint).toBuffer()],
      new PublicKey(PROGRAM_ID)
    );

    let [stakedDataPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(STAKED_DATA_SEEDS), wallet!.publicKey!.toBuffer(), new PublicKey(pirate.mint).toBuffer()],
      new PublicKey(PROGRAM_ID)
    );

    const tokenDataInfo = await connection.getAccountInfo(tokenDataPda);
    if (!tokenDataInfo) {

      instructions.push(
        program.instruction.createTokenData(bumpTokenData, {
          accounts: {
            tokenData: tokenDataPda,
            user: wallet!.publicKey,
            mint: new PublicKey(pirate.mint),
            systemProgram: SystemProgram.programId
          }
        })
      );
    }

    const pirateTransaction = await makeATokenAccountTransaction(connection, wallet!.publicKey, wallet!.publicKey, new PublicKey(pirate.mint));
    instructions = [ ...instructions, ...pirateTransaction.instructions ];
    signers = [ ...signers, ...pirateTransaction.signers ];
    const nftTo = pirateTransaction.tokenTo;
    
    instructions.push(program.instruction.unstake({
      accounts: {
        vault: new PublicKey(VAULT_PDA),
        stakedData: stakedDataPda,
        tokenData: tokenDataPda,
        pool: pool,
        user: wallet!.publicKey,
        mint: new PublicKey(pirate.mint),
        metadata: pirate.program[0],
        tokenMint: new PublicKey(REWARD_TOKEN),
        nftFrom: new PublicKey(pirate.tokenAccount),
        nftTo: nftTo,
        tokenFrom: new PublicKey(REWARD_ATOKEN_ACCOUNT),
        tokenTo: tokenTo,
        tokenProgram: TOKEN_PROGRAM_ID
      }
    }));

    return { instructions, signers, nftTo }
  }

  const makeClosePoolTranaction = async () => {
    let instructions: any[] = [], signers: any[] = [];
    const provider = getProvider(connection, wallet!);
    const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider);

    let [poolPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(POOL_SEEDS), wallet!.publicKey!.toBuffer()],
      new PublicKey(PROGRAM_ID)
    );

    let metadataAccountInfo = await connection.getAccountInfo(poolPda);
    if (metadataAccountInfo) {
      instructions.push(program.instruction.closePool({
       accounts: {
          pool: poolPda,
          user: wallet!.publicKey
       }
      }))
    }

    return { instructions, signers };
  }

  const makeUpdateRewardTransaction = async (multiplier: number, hasAffected: number, pirate: any) => {
    const instructions: any[] = [], signers: any[] = [];
    const provider = getProvider(connection, wallet!);
    const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider);

    let [poolPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(POOL_SEEDS), wallet!.publicKey!.toBuffer()],
      new PublicKey(PROGRAM_ID)
    );

    let [stakedDataPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(STAKED_DATA_SEEDS), wallet!.publicKey!.toBuffer(), new PublicKey(pirate.mint).toBuffer()],
      new PublicKey(PROGRAM_ID)
    );
    
    let [tokenDataPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(TOKEN_DATA_SEEDS), new PublicKey(pirate.mint).toBuffer()],
      new PublicKey(PROGRAM_ID)
    );

    instructions.push(program.instruction.updateReward(multiplier, hasAffected, {
      accounts: {
        pool: poolPda,
        stakedData: stakedDataPda,
        tokenData: tokenDataPda,
        user: wallet!.publicKey,
        mint: new PublicKey(pirate.mint)
      }
    }));
    
    return { instructions, signers };
  }

  const makeUpdateTokenDataTransaction = async (pirate: any) => {
    const provider = getProvider(connection, wallet!);
    const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider);

    let instructions: any[] = [], signers: any[] = [];
    let [tokenDataPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(TOKEN_DATA_SEEDS), new PublicKey(pirate.mint).toBuffer()],
      new PublicKey(PROGRAM_ID)
    );
    
    const metadata = getMetaValuesFromAttributes(pirate.attributes);
    const tokenDataInfo = await connection.getAccountInfo(tokenDataPda);
    if (tokenDataInfo) {
      instructions.push(
        program.instruction.updateTokenData({
          ...metadata,
          id: parseInt(pirate.name.replace('Dope Pirates #', '')),
          job: metadata['crew job']
        }, {
          accounts: {
            tokenData: tokenDataPda,
            user: wallet!.publicKey,
            mint: new PublicKey(pirate.mint),
            systemProgram: SystemProgram.programId
          }
        })
      );
    }

    return { instructions, signers };
  }

  const changeState = async (newPirates: any[]) => {
    // calculate rum earned
    for (let i = 0; i < newPirates.length; i ++) {
      let pirate = newPirates[i];
      if (pirate.enableState) {
        if (pirate.status === 1) {
          newPirates[i].status = 0;
          newPirates[i].totalReward = undefined;
        }
        else {
          newPirates[i].status = 1;
        }
        newPirates[i].enableState = false;
      }
    }
    await setIntervalForUpdate(newPirates);
    const combosBoosts: any[] = await getCombosBoosts(
      newPirates.filter((pirate: any) => pirate.status === 1)
      .map((pirate: any) => ({...pirate.attributes})));
    setCombosBoosts(combosBoosts);
    setIsEnableConfirm(false);
  }


  const handleClean = async () => {
    setLoading(true);
    try {
      let instructionSet: any[] = [], signerSet: any[] = [];
      if (pirates.findIndex((pirate: any) => pirate.status === 1) >= 0) {
        addToast(`You need to unstake all pirates.`, {
          appearance: 'warning',
          autoDismiss: true,
        });
        return;
      }
      let [pool] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(POOL_SEEDS), wallet!.publicKey!.toBuffer()],
        new PublicKey(PROGRAM_ID)
      );
      const poolInfo = await connection.getAccountInfo(pool);
      if (!poolInfo) {
        addToast(`Already cleaned.`, {
          appearance: 'warning',
          autoDismiss: true,
        });
        setLoading(false);
        return;
      }
  
      const closePoolTx = await makeClosePoolTranaction();
      instructionSet.push(closePoolTx.instructions);
      signerSet.push(closePoolTx.signers);
      const result = await sendTransactions(connection, wallet, instructionSet, signerSet, SequenceType.StopOnFailure);
      if (result.success) {
        addToast(`Cleaning success`, {
          appearance: 'success',
          autoDismiss: true,
        });
      }
      else {
        addToast(`Cleaning failed.`, {
          appearance: 'error',
          autoDismiss: true,
        });  
      }
    }
    catch (error) {
      console.log('error', error);
      addToast(`Cleaning failed.`, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
    setLoading(false);
  };

  const handleUpdateReward = async (pirates: any) => {
    setLoading(true);
    try {
      let instructionSet: any[] = [], signerSet: any[] = [];
      const poolPirates = pirates.filter((pirate: any) => pirate.status === 1);
      
      const metadataOnChain = poolPirates.map((pirate: any) => {
        const metadata = getMetaValuesFromAttributes(pirate.attributes);
        return {
          ...metadata,
          id: parseInt(pirate.name.replace('Dope Pirates #', '')),
          job: metadata['crew job']
        }
      })

      const { metadataWithComboList, affectedByUnexpectedEssentialList }= await getMetadataListWithCombo(metadataOnChain);
      for (let i = 0; i < poolPirates.length; i += UPDATE_REWARD_INSTRUCTION_COUNT_PER_TRANSACTION) {
        let transaction: any[] = [], txSigners: any[] = [];
        for (let j = 0; j < UPDATE_REWARD_INSTRUCTION_COUNT_PER_TRANSACTION; j ++) {
          if (i + j >= poolPirates.length) break;
          const updateTokenDataTx = await makeUpdateTokenDataTransaction(poolPirates[i + j]);
          const id = parseInt(poolPirates[i + j].name.replace('Dope Pirates #', ''));
          const multiplier = getMultiplier(id, metadataWithComboList);
          const hasAffected = getHasAffected(id, affectedByUnexpectedEssentialList);
          const { instructions, signers } = await makeUpdateRewardTransaction(multiplier, hasAffected, poolPirates[i + j]);
          transaction = [...transaction, ...updateTokenDataTx.instructions, ...instructions];
          txSigners = [...txSigners, ...updateTokenDataTx.signers, ...signers];
        }
        instructionSet.push(transaction);
        signerSet.push(txSigners);
      }
      const result = await sendTransactions(connection, wallet, instructionSet, signerSet, SequenceType.StopOnFailure);
      console.log('result', result);
      if (result.success) {
        await changeState(pirates);
        addToast(`Update reward success!`, {
          appearance: 'success',
          autoDismiss: true,
        });
      }
      else {
        addToast(`Update reward failed!`, {
          appearance: 'error',
          autoDismiss: true,
        });  
      }
    }
    catch (error: any) {
      console.log('error', error);
      if (error?.message?.indexOf('User rejected the request.') < 0) {
        addToast(`Update reward failed!`, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
      else {
        addToast(`You can get wrong reward!`, {
          appearance: 'warning',
          autoDismiss: true,
        });
      }
    }
    setLoading(false);
  }

  const setIntervalForUpdate = async (newPirates: any) => {
    await updateNftsInfo(newPirates);
  }

  const updateNftsInfo = async (newPirates: any) => {
    try {
      const provider = getProvider(connection, wallet!);
      const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider);
      let poolTotalReward = 0;
      for (let i = 0; i < newPirates.length; i ++) {
        let pirate = newPirates[i];
        if (pirate.status === 1) {
          let [stakedDataPda] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(STAKED_DATA_SEEDS), wallet!.publicKey!.toBuffer(), new PublicKey(pirate.mint).toBuffer()],
            new PublicKey(PROGRAM_ID)
          );
    
          const stakedDataInfo = await connection.getAccountInfo(stakedDataPda);
          if (stakedDataInfo) {
            const stakedDataInfo: any = await program.account.stakedData.fetch(stakedDataPda);
            const rewardList: any[] = stakedDataInfo.rewardList;
            const currentTime = await getCurrentChainTime(connection);
            const { rewardPerDay, totalReward, nextUpdateTime, passedDays } = await getNftInfo(rewardList, currentTime!)
            newPirates[i].rewardPerDay = rewardPerDay;
            newPirates[i].totalReward = (totalReward > 0? totalReward : 0);
            newPirates[i].nextUpdateTime = nextUpdateTime;
            newPirates[i].passedDays = passedDays;
            poolTotalReward += newPirates[i].totalReward;
          }
        }
      }
      
      setPirates([...newPirates]);
      setRumEarned(poolTotalReward);
    }
    catch (error) {
      console.log('error', error)
    }
  }

  // const handleSend = async () => {
  //   setLoading(true);
  //   let instructionSet: any[] = [], signerSet: any[] = [];
  //   for (let i = 0; i < pirates.length; i ++) {
  //     let instructions: any[] = [], signers: any[] = [];
  //     const pirate = pirates[i];
  //     if (!pirate.tokenAccount) continue;
  //     const ataTx = await makeATokenAccountTransaction(
  //       connection, 
  //       wallet!.publicKey, new PublicKey('B7PWdZgAsgXZ3yMFypJu5WMrqckpYxrAFeLDh3nvPQL4'), 
  //       new PublicKey(pirate.mint)
  //     );
  //     instructions = ataTx.instructions;
  //     signers = ataTx.signers;
  //     instructions.push(Token.createTransferInstruction(
  //       TOKEN_PROGRAM_ID,
  //       new PublicKey(pirate.tokenAccount),
  //       ataTx.tokenTo,
  //       wallet!.publicKey,
  //       [],
  //       1
  //     ));

  //     instructionSet.push(instructions);
  //     signerSet.push(signers);
  //   }

  //   await sendTransactions(connection, wallet, instructionSet, signerSet, SequenceType.StopOnFailure);
  //   setLoading(false);
  // }

  // const handleClaim = async () => {
  //   let instructionSet: any[] = [], signerSet: any[] = [];
  //   setLoading(true)
  //   const provider = getProvider(connection, wallet!);
  //   const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider);
  //   try {

  //     let instructions: any[] = [], signers: any[] = [];
  //     let [claim, bump] = await anchor.web3.PublicKey.findProgramAddress(
  //       [Buffer.from(CLAIM_SEEDS), wallet!.publicKey.toBuffer()],
  //       new PublicKey(PROGRAM_ID)
  //     );
  
  //     const claimInfo = await connection.getAccountInfo(claim);
  //     if (!claimInfo) {
  //       const createClaimTx = await makeCreateClaimTx(claim, bump);
  //       instructions = [...createClaimTx.instructions];
  //       signers = [...createClaimTx.signers];
  //     }

  //     const prepareClaimTx = await makePrepareClaimTx(claim);
  //     instructions = [...instructions, ...prepareClaimTx.instructions];
  //     signers = [...signers, ...prepareClaimTx.signers];

  //     instructionSet.push(instructions);
  //     signerSet.push(signers);

  //     for (let i = 0; i < pirates.length; i ++) {
  //       const pirate = pirates[i];
  //       if (pirate.status === 0) {
  //         continue;
  //       }

  //       const claimTx = await makeClaimTx(claim, new PublicKey(pirate.mint));
  //       instructions = [...claimTx.instructions];
  //       signers = [...claimTx.signers];
  
  //       instructionSet.push(instructions);
  //       signerSet.push(signers);
  //     }
  
  //     await sendTransactions(connection, wallet, instructionSet, signerSet, SequenceType.StopOnFailure);
  //     await setIntervalForUpdate(pirates);
  //     const claimData = await program.account.claim.fetch(claim);
  //     setGifState(claimData.chance);
  //   }
  //   catch (error) {
  //     console.log('error', error);
  //     addToast(`Claiming failed!`, {
  //       appearance: 'error',
  //       autoDismiss: true,
  //     });

  //   }
  //   setLoading(false);
  // }

  const makeCreateClaimTx = async (address: anchor.web3.PublicKey, bump: number) => {
    let instructions: any[] = [], signers: any[] = [];

    const provider = getProvider(connection, wallet!);
    const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider);
    instructions.push(
      program.instruction.createClaim(bump, {
        accounts: {
          claim: address, 
          user: wallet!.publicKey,
          systemProgram: SystemProgram.programId
        } 
      })
    );
    
    return { instructions, signers };
  }

  const makePrepareClaimTx = async (address: anchor.web3.PublicKey) => {
    let instructions: any[] = [], signers: any[] = [];

    const provider = getProvider(connection, wallet!);
    const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider);
    const marineCount = await getMarineCount();
    instructions.push(
      program.instruction.prepareClaim(marineCount, {
        accounts: {
          claim: address, 
          user: wallet!.publicKey
        }
      })
    );

    return { instructions, signers};
  }

  const makeClaimTx = async (address: anchor.web3.PublicKey, pirate: any) => {
    let instructions: any[] = [], signers: any[] = [];

    const provider = getProvider(connection, wallet!);
    const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider);

    let [pool] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(POOL_SEEDS), wallet!.publicKey.toBuffer()],
      new PublicKey(PROGRAM_ID)
    );

    let [tokenDataPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(TOKEN_DATA_SEEDS), new PublicKey(pirate.mint).toBuffer()],
      new PublicKey(PROGRAM_ID)
    );

    let [stakedDataPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(STAKED_DATA_SEEDS), wallet!.publicKey!.toBuffer(), new PublicKey(pirate.mint).toBuffer()],
      new PublicKey(PROGRAM_ID)
    );

    const ataTx = await makeATokenAccountTransaction(connection, wallet!.publicKey, wallet!.publicKey, new PublicKey(REWARD_TOKEN));
    if (ataTx.instructions.length > 0) {
      instructions = [
        ...instructions, ...ataTx.instructions
      ];
      signers = [...signers, ...ataTx.signers];
    }
    const feeAtaTx = await makeATokenAccountTransaction(connection, wallet!.publicKey, new PublicKey(FEE_OWNER), new PublicKey(REWARD_TOKEN));
    if (feeAtaTx.instructions.length > 0) {
      instructions = [
        ...instructions, ...feeAtaTx.instructions
      ];
      signers = [...signers, ...feeAtaTx.signers];
    }
    instructions.push(
      program.instruction.claim({
        accounts: {
          vault: new PublicKey(VAULT_PDA),
          pool: pool,
          stakedData: stakedDataPda,
          tokenData: tokenDataPda,
          claim: address,
          user: wallet!.publicKey,
          feeOwner: new PublicKey(FEE_OWNER),
          mint: new PublicKey(pirate.mint),
          metadata: pirate.program[0],
          tokenMint: new PublicKey(REWARD_TOKEN),
          tokenFrom: new PublicKey(REWARD_ATOKEN_ACCOUNT),
          tokenTo: ataTx.tokenTo,
          feeTokenTo: feeAtaTx.tokenTo,
          tokenProgram: TOKEN_PROGRAM_ID
        }
      })
    );
    
    return { instructions, signers };
  }

  const getMarineCount = async () => {
    let marineList = await solanaClient.getAllCollectibles([wallet!.publicKey.toString()], [
      { candyMachineCreator: MARINE_CANDY_MACHINE_CREATOR}
    ]);

    return marineList[wallet!.publicKey.toString()]?.length || 0;
  
  }
  return (
      <div className="d_flex justify_content_between frontend_staking">
        {
          loading ?
          <div id="preloader"> </div> :
          <div id="preloader" style={{display: 'none'}}></div>
        }
        {
          gifState >= 0 && 
          <div className="mask" onClick={() => setGifState(-1)}></div>
        }
        {/* <button onClick={handleSend}>send</button> */}
        <div className="crews panel_left">
          <div className="d_flex align_items_center fontsize_40 title">
            {/* <p>Yo ho ho this is your Crew</p> */}
            <p>RUM earned: {getEnglishNumber(rumEarned)}</p>
            <div className="d_flex justify_content_end">
              <div className="btn_update mr_16">
                <Button 
                  status={0} 
                  enableState={1} 
                  value={"Update Reward"}
                  onClick={() => handleUpdateReward(pirates)} 
                />

              </div>

              <div className="btn_clean">
                <Button 
                  className={'fontsize_30 danger'}
                  status={1} 
                  enableState={pirates.findIndex((pirate: any) => pirate.status === 1 || pirate.status === 2) >= 0 ? 0 : 1} 
                  value={"Clean"}
                  onClick={handleClean} 
                />
              </div>
            </div>
          </div>
          <div className="d_flex mt_8 scroll_panel crews_panel">
            {pirates.map((pirate: any, index: number) => {
              return <div className="nft mb_16" key={pirate.mint}  >
                <Pirate 
                  {...pirate} 
                  index = {index}
                  showStatus={false} 
                  showButton={true}
                  multiButton={true}
                  showJob={true}
                  isActivate={true}
                  onClickButton={handlePirateStatus}
                />
              </div>
            })}
          </div>
        </div>

        <div className="descript panel_right">
          <div className="text_center fontsize_40">
            <p>Combos and boosts</p>
          </div>
          <div className="text mt_8 scroll_panel"> 
            <div className="text_center descript_panel">
            {
              combos_boosts.map((item: any, index: number) => {
                return <p key={index} className={`font_bold font_roboto font-neon mb_16 ${item.class}`}>{item.text}</p>
              })
            }
            </div>

          </div>  
          <div className="mix_confirm_panel text_center mt_8">
              <button 
                className={isEnableConfirm ? "mix_confirm" : "mix_confirm disabled"}
                disabled={!isEnableConfirm}
                onClick={handleConfirm}
              >
                Confirm
              </button>
          </div>
        </div>
        {
          gifState >= 0 &&
          <div className='claim_gif' onClick={() => setGifState(-1)}>
            <img src={gifState === 0 ? gifChance0 : gifChance1} alt="img"/>
          </div>
        }
      </div>
  )
}

export default Pirates;