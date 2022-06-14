import { useState, useEffect } from 'react'
import * as anchor from '@project-serum/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useToasts } from 'react-toast-notifications'

import { getCurrentChainTime, getProvider, getNftInfo, makeATokenAccountTransaction } from "../../../utils/Helper";
import { SolanaClient, SolanaClientProps } from '../../../helpers/sol';
import Pirate from "../../../components/Pirate"
import CONFIG from '../../../config';

import './index.css';
import { IDL } from '../../../constants/idl';
const { 
  CLUSTER_API, 
  REWARD_TOKEN,
  PIRATE_UPDATE_AUTHORITY, 
  PIRATE_COLLECTION_NAME,
  PROGRAM_ID,
  POOL_SEEDS,
  STAKED_DATA_SEEDS,
  TOKEN_DATA_SEEDS,
  REWARD_TOKEN_DECIMAL,
  REWARD_ATOKEN_ACCOUNT,
  VAULT_PDA,
  FEE_OWNER,
  MARINE_CANDY_MACHINE_CREATOR
} = CONFIG;
const { PublicKey, SystemProgram } = anchor.web3;

function Claim() {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const solanaClient = new SolanaClient({ rpcEndpoint: CLUSTER_API } as SolanaClientProps);
  const [poolPirates, setPoolPirates] = useState<any>([]);
  const [walletMarines, setWalletMarines] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();

  useEffect(() => {
    (async () => {
      if (wallet) {
        setLoading(true);
        await loadData();
        setLoading(false);
      }
    })()
    // eslint-disable-next-line
  }, [wallet])
  
  const loadData = async () => {
    try {

      // get pirates from pool
      let [pool] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(POOL_SEEDS), wallet!.publicKey!.toBuffer()],
        new PublicKey(PROGRAM_ID)
      );
      let pirateList = await solanaClient.getAllCollectibles([pool.toString()], [
        { updateAuthority: PIRATE_UPDATE_AUTHORITY, collectionName: PIRATE_COLLECTION_NAME },
      ]);
  
      if (pirateList[pool.toString()]) {
        const provider = getProvider(connection, wallet!);
        const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider);
        const currentTime = await getCurrentChainTime(connection);
        let newPirates: any[] = [];
        for (let i = 0; i < pirateList[pool.toString()].length; i ++) {
          const pirate = pirateList[pool.toString()][i];
          let [stakedDataPda] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(STAKED_DATA_SEEDS), wallet!.publicKey!.toBuffer(), new PublicKey(pirate.mint).toBuffer()],
            new PublicKey(PROGRAM_ID)
          );
    
          let [tokenData] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(TOKEN_DATA_SEEDS), new PublicKey(pirate.mint).toBuffer()],
            new PublicKey(PROGRAM_ID)
          );
          const stakedDataInfo:any = await program.account.stakedData.fetch(stakedDataPda);
          let { totalReward } = await getNftInfo(stakedDataInfo.bountyList, currentTime!);
          if (totalReward < 0)
            totalReward = 0;
          const tokenDataAccountInfo = await connection.getAccountInfo(tokenData);
          if (tokenDataAccountInfo) {
            const tokenDataInfo:any = await program.account.tokenData.fetch(tokenData);
            const bounty = tokenDataInfo.bounty / REWARD_TOKEN_DECIMAL;
            if (bounty > 0) totalReward += bounty;
          }
          
          newPirates.push({
            ...pirate,
            bounty: totalReward
          })
        }
        setPoolPirates([...newPirates])
      }
      // set state
      let marineList = await solanaClient.getAllCollectibles([wallet!.publicKey.toString()], [
        { candyMachineCreator: MARINE_CANDY_MACHINE_CREATOR },
      ]);
      if (marineList[wallet!.publicKey!.toString()]) {
        setWalletMarines(marineList[wallet!.publicKey!.toString()]);
      }
    }
    catch (error) {
      console.log('error', error);
    }
  }

  const handleClaim = async (index: number) => {
    try {
      setLoading(true);
      let instructions: any[] = [], signers: any[] = [];
      const provider = getProvider(connection, wallet!);
      const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider);
      const pirate = poolPirates[index];
      let [pool] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(POOL_SEEDS), wallet!.publicKey!.toBuffer()],
        new PublicKey(PROGRAM_ID)
      );
      let [stakedDataPda] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(STAKED_DATA_SEEDS), wallet!.publicKey!.toBuffer(), new PublicKey(pirate.mint).toBuffer()],
        new PublicKey(PROGRAM_ID)
      );

      let [tokenData, bumpTokenData] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(TOKEN_DATA_SEEDS), new PublicKey(pirate.mint).toBuffer()],
        new PublicKey(PROGRAM_ID)
      );
  
      const tokenDataInfo = await connection.getAccountInfo(tokenData);
      if (!tokenDataInfo) {
        instructions.push(program.instruction.createTokenData(bumpTokenData, {
          accounts: {
            tokenData: tokenData,
            user: wallet!.publicKey,
            mint: new PublicKey(pirate.mint),
            systemProgram: SystemProgram.programId
          }
        }))
      }
      const rewardTransaction = await makeATokenAccountTransaction(connection, wallet!.publicKey, wallet!.publicKey, new PublicKey(REWARD_TOKEN));
      if (rewardTransaction.instructions.length > 0) {
        instructions = [ ...instructions, ...rewardTransaction.instructions ];
        signers = [ ...signers, ...rewardTransaction.signers ];
      }
      const tokenTo = rewardTransaction.tokenTo;
      
      const feeAtaTx = await makeATokenAccountTransaction(connection, wallet!.publicKey, new PublicKey(FEE_OWNER), new PublicKey(REWARD_TOKEN));
      if (feeAtaTx.instructions.length > 0) {
        instructions = [ ...instructions, ...feeAtaTx.instructions ];
        signers = [ ...signers, ...feeAtaTx.signers ];
      }

      await program.rpc.claimBounty({
        accounts: {
          vault: new PublicKey(VAULT_PDA),
          pool: pool,
          stakedData: stakedDataPda,
          tokenData, 
          user: wallet!.publicKey,
          feeOwner: new PublicKey(FEE_OWNER),
          mint: new PublicKey(pirate.mint),
          marineMint: new PublicKey(walletMarines[0].mint),
          pirateMetadata: pirate.program[0],
          marineMetadata: walletMarines[0].program[0],
          marineToken: new PublicKey(walletMarines[0].tokenAccount),
          tokenMint: new PublicKey(REWARD_TOKEN),
          tokenFrom: new PublicKey(REWARD_ATOKEN_ACCOUNT),
          tokenTo: tokenTo,
          feeTokenTo: feeAtaTx.tokenTo,
          tokenProgram: TOKEN_PROGRAM_ID
        },
        instructions,
        signers
      })
      changeState(index);
      setLoading(false);
      addToast('Claiming success!', {
        appearance: 'success',
        autoDismiss: true,
      });
    }
    catch (error) {
      console.log('error', error);
      setLoading(false);
      addToast('Claiming failed', {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  }

  const changeState = (index: any) => {
    setPoolPirates(poolPirates.map((pirate: any, idx: number) => idx === index ? ({...pirate, bounty: 0}) : pirate))
  }

  return (
      <div className="d_flex justify_content_between frontend_claim">
        {
          loading ?
          <div id="preloader"> </div> :
          <div id="preloader" style={{display: 'none'}}></div>
        }

        <div className="panel_left crews">
          <div className="d_flex align_items_center fontsize_40 ml_24 title">
            <p>Capture all pirates</p>
          </div>
          <div className="d_flex mt_8 scroll_panel crews_panel">
            {poolPirates.map((pirate: any, index: number) => {
              return <div className="nft mb_16" key={pirate.mint}  >
                <Pirate 
                  {...pirate} 
                  index={index}
                  showStatus={true} 
                  showButton={true} 
                  status={2} 
                  enableState={walletMarines.length === 0 ? -1 : walletMarines.length}
                  onClickButton={handleClaim}
                />
              </div>
            })}
          </div>
        </div>

        <div className="panel_right descript">
          <div className="text_center fontsize_40">
            <p>marines holding</p>
          </div>
          <div className="d_flex justify_content_between mt_8 scroll_panel descript_panel">
           {
             
             walletMarines.map((marine: any) => {
                return ( 
                <div key={marine.mint} className="mix_image mt_24" >
                  <img src={marine.image} alt="Marine Nft"/>
                </div>);
             })
           }
          </div>
        </div>
      </div>
    )
}

export default Claim;
