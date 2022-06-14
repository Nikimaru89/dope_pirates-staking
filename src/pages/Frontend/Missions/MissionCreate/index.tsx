import { Modal, Box } from "@mui/material";
import React, { useEffect, useState, Fragment, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from 'react-router-dom';
import { PublicKey, SystemProgram, Connection } from '@solana/web3.js';
import bs58 from 'bs58';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import axios from 'axios';
import Collection from "./Collection";
import  { RootState }   from '../../../../store/reducers/rootReducer';
import { createMissionAPI, createCollectionAPI, getCollectionAPI, deleteCollectionAPI} from '../../../../utils/api';
import { setCreateMission } from '../../../../store/actions/missionAction';
import { prepareTokenAccountAndMintTxs } from "@metaplex/js/lib/actions";
import { Token } from "@solana/spl-token";
import { any, array } from "prop-types";
import { useToasts } from "react-toast-notifications";
import { initCollectionName, setCollectionName } from '../../../../store/actions/missionAction';
import './index.css';

const style = {
  position:'absolute' as 'absolute',
  top:'16vh',
  left:'20vw',
  width:'60vw',
  height:'67vh',
  backgroundColor:'#FFE5B7',
  borderRadius:'3px',
  border:'transparent',
  backdropFilter: "blur(5px)",
};

function MissionCreate() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const {addToast} = useToasts();
  const state = useSelector((st:RootState) => st);
  const collectionData = state.missions.collectionData;
  const { connection } = useConnection();
  const [val, setVal] =useState('');
  const [open, setOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [mint, setMint] = useState('');
  const [rum, setRum] = useState('');
  const [nft, setNft] = useState('');
  const [successMissions, setSuccessMissions] = useState('');
  const [payAddress, setPayAddress] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [prizeAddress, setPrizeAddress] = useState('');
  const [prizeAmount, setPrizeAmount] = useState('');
  const [missionName, setMissionName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [hashlist, setHashList] = useState('');
  const [creatorAddress, setCreatorAddress] = useState('');
  const [list, setList] = useState([]);
  const [revivalCost, setRevivalCost] = useState('');
  const [chances, setChances] = useState('');
  const [successRate, setSuccessRate] = useState('');
  const [missionTime, setMissionTime] = useState('');
  const [collectId, setCollectId] = useState<any>([]);
  const [loading, setLoading] = useState(false)
  const [nftGroups, setNftGroups] = useState<any>(
    [[
      {collectionId:0, 
      amount:0,
      trait:0, 
      isBurn:true, 
      rent:0, 
      share:0}
    ]]);
  const TOKEN_METADATA_PROGRAM = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
  const MAX_NAME_LENGTH = 32;
  const MAX_URI_LENGTH = 200;
  const MAX_SYMBOL_LENGTH = 10;
  const MAX_CREATOR_LEN = 32 + 1 + 1;
  const MAX_CREATOR_LIMIT = 5;
  const MAX_DATA_SIZE = 4 + MAX_NAME_LENGTH + 4 + MAX_SYMBOL_LENGTH + 4 + MAX_URI_LENGTH + 2 + 1 + 4 + MAX_CREATOR_LIMIT * MAX_CREATOR_LEN;
  const MAX_METADATA_LEN = 1 + 32 + 32 + MAX_DATA_SIZE + 1 + 1 + 9 + 172;
  const CREATOR_ARRAY_START = 1 + 32 + 32 + 4 + MAX_NAME_LENGTH + 4 + MAX_URI_LENGTH + 4 + MAX_SYMBOL_LENGTH + 2 + 1 + 4;
  const wallet = useAnchorWallet();
  let k:any[] = [];
  
  useEffect(() => {
     (async () => {
      if (wallet) {
        setLoading(true)
        initCollectionName(dispatch);

        const res:any = await getCollectionAPI();

        res.data.map((item:any, index:number) => 
           k.push({id:item._id, collectionName: item.collectionName,creatorAddress: item.creatorAddress})
        )

        setCollectionName(k, dispatch)
        setLoading(false)
      }
    }) ()
  },[wallet]);
 
  const handleChange = (event: any, index:number) => {
    setNftGroups(
      nftGroups.map((nft:any, idx:number) => 
        idx === index ? [...nft.map((item: any) => ({ ...item, collectionId: event})) ] : [...nft]
    )
  )};

  const handleOpen = (index:any) => {
    setOpen(true);
    setVal(index);
  };

  const handleClose = () => {
    setHashList('');
    setOpen(false);
  };

  const addNftGroups = (index:any) => {
    setNftGroups(
      nftGroups.map((nft:any,idx:number) => 
        idx === index ?  ([...nft, 
          {
          collectionId:nft[0].collectionId,
          amount:0,
          trait:0, 
          isBurn:true, 
          rent:0, 
          share:0,
          }
        ])
        : [...nft]
      ))
    setOpen(false);
  };

  const handleCollectionRow = () => {
    setNftGroups(
      [...nftGroups, 
        [{
          collectionId: collectId,
          amount:0,
          trait:0, 
          isBurn:true, 
          rent:0, 
          share:0,
        }]
      ]
    )
  }

  const handleAmount = (e:any, index:number, idx:number) => {
    setNftGroups( 
      nftGroups.map((nft:any, k:number) => 
        k === index ? [...nft.map((item:any, i:number) => i === idx ? {...item, amount: e} : {...item})] : [...nft])
    )
  }

  const handleTrait = (e:any, index:number, idx:number) => {
    setNftGroups( 
      nftGroups.map((nft:any, k:number) => 
        k === index ? [...nft.map((item:any, i:number) => i === idx ? {...item, trait: e} : {...item})] : [...nft])
    )
  }

  const handleIsBurnTrue = (index:number, idx:number) => {
    setNftGroups( 
      nftGroups.map((nft:any, k:number) => 
        k === index ? [...nft.map((item:any, i:number) => i === idx ? {...item, isBurn: true} : {...item})] : [...nft])
    )
  } 

  const handleIsBurnFalse = (index:number, idx:number) => {
    setNftGroups( 
      nftGroups.map((nft:any, k:number) => 
        k === index ? [...nft.map((item:any, i:number) => i === idx ? {...item, isBurn: false} : {...item})] : [...nft])
    )
  } 

  const handleRent = (e:any, index:number, idx:number) => {
    setNftGroups( 
      nftGroups.map((nft:any, k:number) => 
        k === index ? [...nft.map((item:any, i:number) => i === idx ? {...item, rent: e} : {...item})] : [...nft])
    )
  }

  const handleShare = (e:any, index:number, idx:number) => {
    setNftGroups( 
      nftGroups.map((nft:any, k:number) => 
        k === index ? [...nft.map((item:any, i:number) => i === idx ? {...item, share: e} : {...item})] : [...nft])
    )
  }

  const addCollectionName = async(dispatch:any) => {
    setLoading(true)
    try {
      const payload = {  
        creatorAddress: creatorAddress,
        hashlist:list,
        collectionName: addName 
      }

      const res:any = await createCollectionAPI(payload)
      
      if(res.data) {
        const payload = {
          id: res.data._id,
          collectionName: res.data.collectionName,
          creatorAddress: res.data.creatorAddress,
        };
        setCollectionName(payload, dispatch)
      }
    }
    catch (error) {
     console.log('error', error)
    }

    addToast('Adding collection success!', {
      appearance: 'success',
      autoDismiss:  true
    })
    setHashList('');
    setOpen(false);
    setLoading(false)
  }

  const createMission =  async () => {
    setLoading(true)
    let newNft:any = [];
    nftGroups.map((item:any) => 
      item.map((li:any) =>
        newNft.push(li)
      )
    )
    const payload = {  
      revivalCost: revivalCost,
      chances: chances,
      successRate: successRate,
      missionTime: missionTime,
      nftGroups:newNft,
      prizes:{
        candymachineId: mint,
        rumPrize: rum,
        nftFromWallet: nft,
        otherTokenPrize:{
          address: prizeAddress,
          amount: prizeAmount,
      },
    },
      successMissions: successMissions,
      missionName: missionName,
      missionDescription: description,
      missionImage: image,
      boostNfts:'',
      otherTokenPayment:{
        address: payAddress,
        amount: payAmount,
      }
    }
    try {
      const res:any = await createMissionAPI(payload)
      if(res.data)
        {
          await setCreateMission(res.data, dispatch)
        }
    }
    catch (error) {
    }
    
    addToast('Creating mission success!', {
      appearance: 'success',
      autoDismiss: true
    })
    navigate('/missions');
    setLoading(false)
  }
  
  const handleUnlocked = () => {
    setUnlocked(true);
  };
  
  const handleSelectedImage = (event:any) => {
    setImage(URL.createObjectURL(event  .target.files[0]));
  }

  const handleAddName = (event:any) => {
    event.target.value !== '' && setAddName(event.target.value);
  };

  const getMintAddresses = async (firstCreatorAddress: PublicKey) => {
    setLoading(true)
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
        return metadataAccounts.map((metadataAccountInfo) => (
          bs58.encode(metadataAccountInfo.account.data)
        ));
    }
    catch (error) {
      console.log('error', error);
    }
    setLoading(false)
  };
  
  const fetch = async (creatorAddress:string) => {
    setLoading(true)
    try {
      const candymachinPubkey = new PublicKey(creatorAddress);
      let creator = candymachinPubkey;
      const tokenIds = await getMintAddresses(creator);
      tokenIds?.map((tokenId, index) => {
        k.push((tokenId))
      })
      const res = await Promise.all(k)
      res.map(wallet => {
        setList(prevlist => prevlist.concat(wallet));
      })
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

  return(
    <Fragment>
      {
        loading ?
        <div id="preloader"> </div> :
        <div id="preloader" style={{display: 'none'}}></div>
      }
      <div className="mission_create">
        <div className="collections">
          <div className='collect'>
              { nftGroups.map((list:any,index:number) => 
                <div className='collection_container'>
                <Collection 
                  collectionData={collectionData} 
                  // collection={collection}
                  handleOpen={handleOpen} 
                  val={val} 
                  handleAmount={handleAmount}
                  handleTrait={handleTrait}
                  handleIsBurnTrue={handleIsBurnTrue}
                  handleIsBurnFalse={handleIsBurnFalse}
                  handleRent={handleRent}
                  handleShare={handleShare}
                  addNftGroups={addNftGroups}
                  index={index}
                  nftGroups={nftGroups}
                  handleChange={handleChange}
                  list={list}
                  />
                </div>
              )}
          </div>
        <div className="btn_plus" onClick={handleCollectionRow}>
          +
        </div>
        </div>
        <div className='action'>
          <div className='form_group'>
            <div className='item'>
              <div className="label">Revival Cost</div>
              <div className="input">
                <input type="number" onChange={e => setRevivalCost(e.target.value)}/>
              </div>
            </div>
            <div className='item'>
              <div className="label">Success Rate</div>
              <div className="input">
                <input type="number" onChange={e => setSuccessRate(e.target.value)}/>
              </div>
            </div>
          </div>
          <div className='form_group'>
            <div className='item'>
              <div className="label">Chances</div>
              <div className="input">
                <input type="number" onChange={e => setChances(e.target.value)}/>
              </div>
            </div>
            <div className='item'>
              <div className="label">Mission Time</div>
              <div className="input">
                <input type="number" onChange={e => setMissionTime(e.target.value)}/>
              </div>
            </div>
          </div>
            <div className='btn_cancel'>
              Cancel
            </div>
            <div className='btn_create' onClick={handleUnlocked}>
              Create
            </div>
        </div>
      </div>
      <Modal
        open={open}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
        BackdropProps={{ style: { backgroundColor: "#FFFFFFAA" } }}
      >
        <Box sx={{...style}}>
          <div className="m_form">
            <div className="header">
              <div className="h_label">
                Import From a Verified Creators Address
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
            <div className="footer">
              <div className="f_label">
                Name the collection
              </div>
              <div className="f_form">
                <input id='text' type='text' onChange={e => handleAddName(e)} required />
                <div className="btn_can" onClick={handleClose}>
                  Cancel
                </div>
                <div className="btn_add" onClick={() =>addCollectionName(dispatch)}>
                  ADD collection
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      <Modal
        open={unlocked}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
        BackdropProps={{ style: { backgroundColor: "#FFFFFFAA" } }}
      >
        <Box sx={{...style}}>
          <div className="form">
            <div className="item">
              <div className="title">
                Prizes
              </div>
              <div className="subtitle">
                Minting NFT from candymagine
              </div>
              <div className="input">
              <input id='text' type='text' onChange={(e) =>setMint(e.target.value)}/>
              <div className="btn_check">
                Check
              </div>
              </div>
            </div>
            <div className="item_">
              <div className="sub">
                <div className="unit">
                <div className="title">
                  Rum Prize
                </div>
                <input id='number' type='number' onChange={(e) => setRum(e.target.value)}/>
                </div>
                <div className="unit">
                  <div className="title">
                    NFT from wallet
                  </div>
                  <input id='text' type='text' onChange={(e) => setNft(e.target.value)}/>
                </div>
                <div className="unit">
                  <div className="title">
                    Success missions
                  </div>
                  <input id='number' type='number' onChange={(e) => setSuccessMissions(e.target.value)}/>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="sub">
                <div className="organism">
                  <div className="title">
                    Other token payment
                  </div>
                  <div className="molecule">
                    <div className="atom">
                      <div className="subtitle">
                        tokens addres
                      </div>
                      <input id='text' type='text' onChange={(e) => setPayAddress(e.target.value)}/>
                    </div>
                    <div className="atom">
                    <div className="subtitle">
                        Token amount
                      </div>
                      <input id='number' type='number' onChange={(e) => setPayAmount(e.target.value)}/>
                    </div>
                  </div>
                </div>
                <div className="organism">
                  <div className="title">
                    Other token Prize
                  </div>
                  <div className="molecule">
                    <div className="atom">
                      <div className="subtitle">
                        tokens addres
                      </div>
                      <input id='text' type='text' onChange={(e) => setPrizeAddress(e.target.value)}/>
                    </div>
                    <div className="atom">
                    <div className="subtitle">
                        Token amount
                      </div>
                      <input id='number' type='number' onChange={(e) => setPrizeAmount(e.target.value)}/>
                    </div>
                  </div>
                </div>
                </div>
            </div>
            <div className="item_end">
              <div className="organism">
                <div className="molecule">
                  <div className="title">
                    Mission Name
                  </div>
                  <input id='text' type='text' onChange={(e) => setMissionName(e.target.value)}/>
                </div>
                <div className="molecule">
                  <div className="title">
                    Mission Description
                  </div>
                  <input id='text' type='text' onChange={(e) => setDescription(e.target.value)}/>
                </div>
                <div className="molecule">
                  <div className="title">
                    Mission Image
                  </div>
                  <label>
                  <input id='button-file' type='file' accept="image/*" style={{display:'none'}} onChange={(e) => handleSelectedImage(e)} />
                  <div className="btn_select_image"></div>
                  </label>
                </div>
              </div>
              <div className="organism_">
                <div className="btn_can" onClick={() => setUnlocked(false)}>
                  Cancel
                </div>
                <div className="btn_finish" onClick={createMission}>
                  Finish
                </div>
              </div>  
            </div>
          </div>
        </Box>
      </Modal>
  </Fragment>
  )
}

export default MissionCreate




