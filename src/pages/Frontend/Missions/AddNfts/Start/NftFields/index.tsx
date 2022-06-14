
import { stateDiscriminator } from '@project-serum/anchor/dist/cjs/coder';
import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isTemplateTail } from 'typescript';
import { ThemeContext } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { userSelectAPI, getRentMissionAPI, getCollectionAPI } from '../../../../../../utils/api';
import { RootState } from '../../../../../../store/reducers/rootReducer';
import { useToasts } from 'react-toast-notifications';
import { SolanaClient, SolanaClientProps } from '../../../../../../helpers/sol';
import { CLUSTER_API } from '../../../../../../config/dev';
import { publicKey } from '@project-serum/anchor/dist/cjs/utils';
import { Connection, PublicKey } from '@solana/web3.js';
import { getNftInfo } from '../../../../../../helpers/sol';
import { userSelectNft } from '../../../../../../store/actions/missionAction';
import './index.css';


function NftFields () {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const wallet = useAnchorWallet();
	const solanaClient = new SolanaClient({ rpcEndpoint: CLUSTER_API} as SolanaClientProps);
	const {addToast} = useToasts();
	const state = useSelector((st:RootState) => st);
	const amount = state.missions.startAmount;
	const [fieldValue, setFieldValue] = useState<any>([]);
	const [field, setField] = useState<any>([]);
	const str = location.pathname.split('/')
	const missionId = str[2];
	const nftGroupIndex = parseInt(str[4]);
	const [loading, setLoading] = useState(false)
	const walletPbk = wallet?.publicKey;
	const user = walletPbk?.toString();

	useEffect(() => {
		( async () => {
			if(wallet) {
				setLoading(true)

				const response:any =await getCollectionAPI();

				let ss:any[] =[];

				response.data.map((item:any) => ss.push({candyMachineCreator:item.creatorAddress}))

				const walletPbk = wallet!.publicKey;
				const wallets = [walletPbk.toString()];

				let pirateList = await solanaClient.getAllCollectibles(wallets,ss);
				let pirates:any[] = pirateList;
				
				const res:any = await getRentMissionAPI(missionId)
				
				setField(
					pirateList[wallets.toString()]?.map((item:any) => (
						{...item, button: 'Select', status: false }
					))
				)
				let k:any[] =[];

				for (let i = 0; i < res.data[0].nfts[nftGroupIndex].length; i ++) {
					const it = res.data[0].nfts[nftGroupIndex][i];
					const result = await getNftInfo(it.address);
					k.push({
						name: result.name,
						image: result.image,
						button: "Rent",
						status: false,
					})
				}
				setFieldValue([...field, ...k])
 				setLoading(false)
			}
		}) ()
	}, [wallet])

	let selectNumber = 0;

	fieldValue.map((item:any, index:number) => {
		if(item.status)  
		selectNumber++;
	});

	const handleActiveButton = (index:number) => {
		setFieldValue (
			fieldValue.map((item:any, idx:number) => 
				(index === idx && selectNumber < amount) || (index === idx && item.status)
				? {...item, status: !(item.status)}  
				: {...item}
				)
	)};

	const handleSelect = async (dispatch:any) => {
		setLoading(true)
		let k:any = [];
		fieldValue.map((item:any, index:number) => {
			if(item.status && item.button === "Select") 
				k.push({address:item.title, action:"select"});
			if(item.status && item.button === "Rent")
				k.push({address:item.title, action:"rent"});
		})
		try {
			const payload = {
				user: user,
				nftGroupIndex:nftGroupIndex,
				nfts:k,
			}
			const res:any = await userSelectAPI(missionId, payload)
			if(res.data)
				await userSelectNft(res.data, dispatch)
		}
		catch(error) {
			console.log('error',error)
		}
		addToast('Selecting nfts success!', {
			appearance:'success',
			autoDismiss: true
		})
		navigate(`/missions/${missionId}/add-nfts`)
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
					{fieldValue.map((item:any, index:number) => 
						<div className='item'>
							<div>{item.name}</div>
							<img src={item.image} />
							<div className={item.status && item.button === 'Select' ? 'button active_select_nft' : item.status && item.button === 'Rent' ? 'button active_select_rent' : 'button select_nft'} onClick={() => handleActiveButton(index)}>{item.button}</div>
						</div>
					)}
			</div>
			<div className='act'>
				<div className='sub_act'>
					<div>
						Pirates choose<br></br>{selectNumber}/{amount}
					</div>
					<div>
						Rent per NFT<br></br>1
					</div>
					<div>
						Total to pay<br></br>3
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
