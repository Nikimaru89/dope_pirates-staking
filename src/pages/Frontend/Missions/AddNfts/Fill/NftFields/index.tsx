
import { stateDiscriminator } from '@project-serum/anchor/dist/cjs/coder';
import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isTemplateTail } from 'typescript';
import './index.css';
import { ThemeContext } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';
import { Transaction } from '@solana/web3.js';
import { useToasts } from 'react-toast-notifications';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import { addRentMissionAPI } from '../../../../../../utils/api';
import { RootState } from '../../../../../../store/reducers/rootReducer';
import { SolanaClient, SolanaClientProps } from '../../../../../../helpers/sol';
import { CLUSTER_API } from '../../../../../../config/dev';
import { getCollectionAPI, rentTransactionAPI  } from '../../../../../../utils/api';
import { signAndSendTransactions, signAndSendTransaction } from '../../../../../../helpers/sol/connection';
import { initWalletNft, setWalletNft } from '../../../../../../store/actions/missionAction';

const { PublicKey, SystemProgram } =anchor.web3;

function NftFields () {
	const dispatch = useDispatch();
	const location = useLocation();
	const wallet = useAnchorWallet();
	const {connection} = useConnection();
	const solanaClient = new SolanaClient({ rpcEndpoint: CLUSTER_API } as SolanaClientProps);
	const {addToast} = useToasts();
	const [loading, setLoading] = useState(false)
	const [list, setList] = useState<any>([])
	const [flag , setFlag] = useState(false)
	const navigate = useNavigate();
	const state = useSelector((st:RootState) => st);
	const walletPbk = wallet?.publicKey;
	const wallets = walletPbk?.toString();
	const str = location.pathname.split('/')
	const nftGroupIndex = parseInt(str[4]);
	const missionId = str[2];

	useEffect(() => {
		(async () => {
			if(wallet) {
				setLoading(true)
				if(!flag){
					setFlag(true)
					await loadData();
				}
				setLoading(false)
			}
		}) ()
	}, [wallet])

	const loadData = async () => { 
		try {
			await initWalletNft(dispatch)
			const res:any = await getCollectionAPI();
			let ss:any[] = []
			res.data.map((item:any) => ss.push({candyMachineCreator: item.creatorAddress}))

			const walletPbk = wallet!.publicKey;
			const wallets = [walletPbk.toString()];
			
			let pirateList = await solanaClient.getAllCollectibles(wallets,ss);
			
			let pirates: any[] = pirateList;
			let k: any = [];
		
			res.data.map((k:any, index:number) => {
				if(index === nftGroupIndex) {
					{	const s = pirateList[walletPbk.toString()]?.filter((e:any) => e.creators[0].address === k.creatorAddress)
						s.map((it:any) => {
							const i = Object.assign(it,{status:false})
							setList((prevlist:any) => prevlist.concat(i))
						})
					}
				}
			})
			await setWalletNft(list, dispatch)
		}
		catch (error) {
			console.log('error', error);
		}
	}
	
	const handleActiveButton = (index:number) => {
		setList (
			list.map((item:any, idx:number) => 
				index === idx 
				? {...item, status:!(item.status)}
				: {...item}
				)
		)
	};

	const handleSelect = async (dispatch:any) => {
		setLoading(true)
		let k:any = [];
		list.map((item:any, index:number) => {
			if(item.status)
				k.push({address:item.mint, action:"borrow"});
		})
		try {
			const payload = {
				user: wallets,
				nfts:k,
			}
			const res:any = await rentTransactionAPI(missionId, payload)
			
			const transaction: Transaction = Transaction.from(res.data[0].data);
			const result = await signAndSendTransaction(connection, wallet, transaction, 'singleGossip')
		}
		catch(error) {
			console.log('error',error)
		}
			addToast('Renting nfts success!', {
				appearance: 'success',
				autoDismiss: true
			})
			navigate(`/missions/${missionId}/borrow-nfts`);
		setLoading(false)
	};

	return (
		<div className='nft_fields'>
			{
				loading ?
				<div id="preloader"> </div> :
				<div id="preloader" style={{display: 'none'}}></div>
			}
			<div className='main_field'>
					{list.map((item:any, index:number) => 
						<div className='item'>
							<div>{item.name}</div>
							<img src={item.uri} />
							<div className={item.status ? 'button active_select_nft': 'button select_nft'} onClick={() => handleActiveButton(index)}>Borrow</div>
						</div>
					)}
			</div>
			<div className='act'>
				<div className='sub_act'>
					<div>
						Total in Pool<br></br>50
					</div>
					<div>
						NFTs for Rent<br></br>8
					</div>
					<div>
						Reward/Adventure<br></br>1
					</div>
					<div>
						NFTS in adventure<br></br>2
					</div>
				</div>
				<div className='btn_group'>
					<div className='button confirm' onClick={() => handleSelect(dispatch)}>
						Confirm
					</div>
					<div className='button back' onClick={() => navigate(-1)}>
						Back
					</div>
				</div>
		</div>
		</div>
  );
}

export default NftFields
