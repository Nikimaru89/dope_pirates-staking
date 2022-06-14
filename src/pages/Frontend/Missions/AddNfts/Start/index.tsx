import React, { useState, useReducer, useEffect, Fragment } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { styled } from '@mui/system';
import { Modal, Box } from '@mui/material'; 
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'swiper/swiper.min.css'
import SelectNft from '../../../../../components/SelectNft';
import MissionImg from '../../../../../assets/frontend/mission.png';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/reducers/rootReducer';
import { getMissionAPI, getCollectionAPI, userStartAPI, userBoostAPI } from '../../../../../utils/api';
import SelectNftImage from '../../../../../assets/frontend/select_nft.png';
import { couldStartTrivia } from 'typescript';
import { useToasts } from 'react-toast-notifications';
import { SSL_OP_ALL } from 'constants';
import { SolanaClient, SolanaClientProps } from '../../../../../helpers/sol';
import  { CLUSTER_API } from '../../../../../config/dev';
import { initFillMission, initUserBoost, setFillMission, setUserBoost } from '../../../../../store/actions/missionAction';
import './index.css';

const style = {
  position: 'absolute' as 'absolute',
  top: '16vh',
  left: '20vw',
  width: '60vw',
  height: '67vh',
  backgroundColor: '#FFE5B7',
  borderRadius: '3px',
  boder: 'transparent !important',
  backdropFilter: 'blur(5px)',
  padding:'2vw'
}

function AddNfts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const wallet = useAnchorWallet();
  const {addToast} = useToasts();
  const state = useSelector((st:RootState) => st);
  const [openModal, setOpenModal] = useState(false);
  const [fieldValue, setFieldValue] = useState<any>([])
  const [address,setAddress] = useState('');
  const str = location.pathname.split('/')
  const missionId = str[2];
  const [loading, setLoading] = useState(false)
  const walletPbk = wallet?.publicKey; 
  const user = walletPbk?.toString();
  const solanaClient = new SolanaClient({ rpcEndpoint: CLUSTER_API} as SolanaClientProps)

  useEffect(() => {
    (async () => {
      try{
        if(wallet) {
          setLoading(true)
          let k:any = []; 

          const res:any = await getMissionAPI();
          const response:any = await getCollectionAPI();

          initFillMission(dispatch);
          initUserBoost(dispatch);

          if(res.data){
            res.data.map((item:any) => {
              if(item._id === missionId) {
                item.nftGroups.forEach((it:any) =>{
                  let name = response.data.find((e:any) => e._id === it.collectionId)
                  if(name === null) { 
                    setLoading(false)
                    addToast('No collections!', {
                      appearance: 'warning',
                      autoDismiss: true
                    })
                  }
                  k.push({collectionName:name?.collectionName, trait:it.trait, amount:it.amount})
                })
              }
            })
            setFillMission(k,dispatch)
          }

          const walletPbk = wallet.publicKey;
          const wallets = [walletPbk.toString()];
          const result:any = await getCollectionAPI();

          let ss:any[] = [];

          result.data.map((item:any) => ss.push({candyMachineCreator: item.creatorAddress}))

          let pirateList = await solanaClient.getAllCollectibles(wallets, ss)

          res.data.map((item:any) => {
            if(item._id === missionId) {
              const creatorAddress = item.boostNfts[0].creatorAddress
              setAddress(creatorAddress)
            }
          })

          const nfts = pirateList[wallets.toString()].filter((e:any) => e.creators[0].address === address)

          setFieldValue(
            nfts.map((item:any) => ({...item, status:false}))
          )
          setUserBoost(nfts, dispatch)
        }
        setLoading(false)
      }
      catch(error){
        console.log('error',error)
      }
    }) ()
  },[wallet])
  
  const handleStart = async() => {
    setLoading(true)
    try{
      const payload = {
        user: user
      }
      const res:any = await userStartAPI(missionId, payload)
      if(res.data) {
        await dispatch({type:'USER_START_MISSION', payload:res.data})
      }
    }
    catch(error) {
      console.log('error', error)
    }
    setLoading(false)
    addToast('User starting mission success!', {
      appearance: 'success',
      autoDismiss: true
    })
  }

  const handleActiveButton = (index:number) => {
		setFieldValue (
			fieldValue.map((item:any, idx:number) => 
				(index === idx) ? {...item, status: !(item.status)} : {...item}
				)
		)
	};
  
  const handleBoost = async() => {
    setLoading(true)
    try {
      let k:any[] = [];
      fieldValue.map((item:any, index:number) => {
        if(item.status) k.push({address: item.mint})
      })
      const payload = {
        user: user,
        nfts: k
      }
      const res:any = await userBoostAPI(missionId, payload)
      if(res.data) {
        await dispatch({type: 'USER_BOOST_NFTS', payload: res.data})
      }
    }
    catch(error) {
      console.log('error',error)
    }
    addToast('Boosting nfts success!', {
      appearance: 'success',
      autoDismiss: true
    })
    setOpenModal(false)
    setLoading(false)
  }

  return (
    <Fragment>
      {
        loading ?
        <div id="preloader"> </div> :
        <div id="preloader" style={{display: 'none'}}></div>
      }
      <div className='add_nft'>
        <div className='collection'>
              <div className='collection_container'>
                <div className='form-group'>
                <Swiper
                  spaceBetween={30}
                  slidesPerView={4}
                >
                  { 
                    state.missions.fillMission.map((item:any, index:number) => 
                          <SwiperSlide >
                            <SelectNft title={item.collectionName} trait={item.trait} amount={item.amount} src={SelectNftImage} actionName={'Select Nfts'} index={index}/>
                          </SwiperSlide>
                    )
                  } 
                  </Swiper>
                </div>
              </div>
        </div>
        <div className='action'>
          <div className='img'>
            <img src={MissionImg} alt="nft"/>
          </div>
          <div className='caption'>
            Prize
          </div>
          <div className='description'>
            <div>
              The Admiral Coat
            </div>
            <div>
              Success Rate 33%
            </div>
          </div>
          <div className='form_group'>
            <div className='btn_boost' onClick={() => setOpenModal(true)}>
              Boost
            </div>
            <div className='btn_start' onClick={handleStart}>
              Start <br></br>Mission
            </div>
            <div className='btn_back' onClick={() => navigate(-1)}>
              Back
            </div>
          </div>
        </div>
      </div>
      <Modal
          open={openModal}   
          BackdropProps={{style:{backgroundColor:"#FFFFFFAA"}}}
      >
        <Box sx={{...style}}>
          <div className='main'>
            <div className='sub'>
              {fieldValue.map((item:any, index:number) => 
                <div className='item'>
                  <div>{item.name}</div>
                  <img src={item.image} />
                  <div className={item.status ? 'button active_boost_nft' : 'button boost_nft'} onClick={() => handleActiveButton(index)}>Select</div>
                </div>
              )}
            </div>
            <div className='button groups'>
              <div className='btn_close' onClick={() => setOpenModal(false)}>Close</div>
              <div className='btn_confirm_boost' onClick={handleBoost}>Confirm</div>
            </div>
          </div>
        </Box>
      </Modal>
    </Fragment>
  )
}

export default AddNfts;