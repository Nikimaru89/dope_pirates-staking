import React, { useReducer, useState, useEffect } from 'react';
import { Modal, Box} from '@mui/material';
import { useToasts } from 'react-toast-notifications'
import axios from 'axios';
import { Navigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { PublicKey, SystemProgram, Connection } from '@solana/web3.js';
import bs58 from 'bs58';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import Mission from '../../../components/Mission'
import  { RootState }   from '../../../store/reducers/rootReducer';
import {boostMissionAPI} from '../../../utils/api';
import {deleteMissionAPI, getMissionAPI} from '../../../utils/api';
import CONFIG from '../../../../src/config';
import { boostMission, initCreateMission, setCreateMission, deleteMission } from '../../../store/actions/missionAction';
import { getClaimBidTransactions } from '@metaplex/js/lib/actions';
import classNames from 'classnames';
import './index.css';

const { ADMIN } = CONFIG;

const style = {
  position: 'absolute' as 'absolute',
  top: '16vh',
  left: '20vw',
  width: '60vw',
  height: '67vh',
  backgroundColor: '#FFE5B7',
  borderRadius: '3px',
  boder: 'transparent',
  backdropFilter: 'blur(5px)',
}

function Missions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const {connection} = useConnection();
  const {addToast} = useToasts();
  const state = useSelector((st:RootState) => st);
  const value = state.missions.missionData;
  const [maskId, setMaskId] = useState([]);
  const [checkIfSelect, setCheckIfSelect] = useState(false);
  const [checkIfBoost, setCheckIfBoost] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [creatorAddress, setCreatorAddress] = useState('');
  const [hashlist, setHashList] = useState('');
  const [missionId, setMissionId] = useState('');
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const TOKEN_METADATA_PROGRAM = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
  const MAX_NAME_LENGTH = 32;
  const MAX_URI_LENGTH = 200;
  const MAX_SYMBOL_LENGTH = 10;
  const MAX_CREATOR_LEN = 32 + 1 + 1;
  const MAX_CREATOR_LIMIT = 5;
  const MAX_DATA_SIZE = 4 + MAX_NAME_LENGTH + 4 + MAX_SYMBOL_LENGTH + 4 + MAX_URI_LENGTH + 2 + 1 + 4 + MAX_CREATOR_LIMIT * MAX_CREATOR_LEN;
  const MAX_METADATA_LEN = 1 + 32 + 32 + MAX_DATA_SIZE + 1 + 1 + 9 + 172;
  const CREATOR_ARRAY_START = 1 + 32 + 32 + 4 + MAX_NAME_LENGTH + 4 + MAX_URI_LENGTH + 4 + MAX_SYMBOL_LENGTH + 2 + 1 + 4;
  const wallets = wallet?.publicKey.toString();
  let k:any[] = [];
  let ss:boolean

  useEffect(() => {
    ( async () => {
        if(wallet) {
          setLoading(true)
          initCreateMission(dispatch);

          const res:any = await getMissionAPI();
          
          let k:any[] = [];
          
          res.data.map((item:any) => k.push(item)
          )

          setCreateMission(k, dispatch)
          setLoading(false)
        }
    }) ()
  }, [wallet]);

  const handleSelect = () => {
    setCheckIfSelect(!checkIfSelect);
  }

  const handleDelete = async() => {
    setLoading(true)
    try {
      const res = await deleteMissionAPI(maskId)
      if(res.data) {
        await deleteMission(maskId, dispatch);
        setDeleteStatus(res.data);
      }
    }
    catch(error) {
      console.log('error', error);
    }
    setLoading(false)
    addToast('Deleting mission success!', {
      appearance: 'success',
      autoDismiss: true,
    });  
  };

  const handleImageMask = (index:any) => {
    if (maskId.length == 0 && checkIfSelect) 
      setMaskId(prevmaskId => prevmaskId.concat(index))
    if (maskId.some(e => e !== index ) && checkIfSelect)
      setMaskId(prevmaskId => prevmaskId.concat(index))
    if (maskId.some(e => e === index) && checkIfSelect)
      setMaskId(prevmaskId => prevmaskId.filter(mask => mask !== index))
    if (checkIfBoost) 
      setOpenModal(true)
      setMissionId(index) 
  }

  const handleClose = () => {
    setOpenModal(false);
    setHashList('');
  }

  const getMintAddresses = async (firstCreatorAddress: PublicKey) => {
    try {
      const metadataAccounts = await connection.getProgramAccounts(
          TOKEN_METADATA_PROGRAM,
          {
              dataSlice: { offset: 33, length: 32 },
              filters: [
                  { dataSize: MAX_METADATA_LEN },
                  {
                      memcmp: {
                          offset: CREATOR_ARRAY_START,
                          bytes: firstCreatorAddress.toBase58(),
                      },
                  },
              ],
          },
      );
  
      return metadataAccounts.map((metadataAccountInfo:any) => (
          bs58.encode(metadataAccountInfo.account.data)
      ));
    }
    catch (error) {
      console.log('error', error);
    }
  };
  
  const fetch = async (creatorAddress:string) => {
    setLoading(true);
    try {
      const candymachinPubkey = new PublicKey(creatorAddress);
      let creator = candymachinPubkey;
      const tokenIds = await getMintAddresses(creator);
      tokenIds?.map((tokenId:any, index:number) => {
        k.push((tokenId))
      })
      const res = await Promise.all(k)
      const enter: any = "\n";
      const fix: any = '"';
      let newString = '[' + enter;
      res.forEach((wallet, index) =>  
      {  
        if (index < res.length - 1)
        newString += fix + wallet + fix + "," + enter
        else if  (index = res.length - 1)
        newString += fix + wallet + fix + enter
      }
      )
      newString += ']';
      setHashList(newString);
    }
    catch (error) {
      console.log('error', error);
    }
    setLoading(false)
  }
  const handleBoost = async() => {
    setLoading(true)
    const payload = {
      creatorAddresses: [creatorAddress]
    }
    try {
      const res:any = await  boostMissionAPI(missionId, payload)
      if(res !== null) {
        const boostPayload = {
          id: res.data._id,
          boostNfts: res.data.boostNfts,
        }
        await boostMission(boostPayload, dispatch);
        addToast('Boosting mission success!', {
          appearance: 'success',
          autoDismiss: true
        })
      }
      if(res === null){
        setLoading(false)
        addToast('Boosting mission failed!', {
          appearance: 'error',
          autoDismiss: true
        })
      }
    }
    catch(error){
      console.log('error',error)
    }
    setLoading(false)
    setHashList('');
    setOpenModal(false);
  }

  const handleSelectBoost = () => {
    setCheckIfBoost(!checkIfBoost)
  }

  return(
    <div>
       {
          loading ?
          <div id="preloader"> </div> :
          <div id="preloader" style={{display: 'none'}}></div>
        }
      <div className='button_group'>
        <div className={wallets === ADMIN ? 'button create' :'button deactive'}>
          <Link to='create'>Create Mission</Link>
        </div>
        <div className={(checkIfSelect && wallets === ADMIN) ? 'button active_delete' : (!checkIfSelect && wallets === ADMIN) ?'button deactive_delete': 'button none'} onClick={handleSelect} >
         Delete Mission
        </div>
        <div className={(checkIfBoost && wallets === ADMIN)? 'button active_update' : (!checkIfBoost && wallets === ADMIN) ?'button deactive_update': 'button none'} onClick={handleSelectBoost} >
          Boost Update
        </div>
      </div>
      <div className='sub-content'>
        <div className='missions'>
            {
              value.map((mission: any, index:number) => 
              <div className='mission_container'>
                <Mission 
                  mission={mission} 
                  handleImageMask={handleImageMask} 
                  index={mission._id} 
                  maskId = {maskId}
                />
              </div>
              )
            }
          </div>
        <div className={maskId.length > 0 ? 'btn_confirm': 'btn_deactive_confirm'} onClick={handleDelete}>
          Confirm
        </div>
      </div>
      <Modal
        open={openModal}
        BackdropProps={{style: {backgroundColor:"#FFFFFFAA"}}}
      >
        <Box
          sx={{...style}}
        >
           <div className="m_form">
            <div className="header">
              <div className="h_label">
                Include creators address for new boosts
              </div>
              <div className="h_form">
                <input id='text' type='text' onChange={(e) => setCreatorAddress(e.target.value)}/>
                <div className="btn_fetch" onClick={() => fetch(creatorAddress)}>
                  fetch
                </div>
              </div>
            </div>
            <div className="content">
              <textarea id='modal' name='modal' value={hashlist}>
              </textarea>  
            </div>
            <div className="foot">
                <div className="btn_boost_can" onClick={handleClose}>
                  Cancel
                </div>
                <div className="btn_delete_boost">
                  Delete Boost
                </div>
                <div className="btn_boost_update" onClick={handleBoost}>
                  Boost Update
                </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Missions