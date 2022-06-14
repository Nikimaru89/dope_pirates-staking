import { useState, useEffect } from 'react'
import * as anchor from '@project-serum/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css'

import Pirate from "../../../components/Pirate"
import { SolanaClient, SolanaClientProps } from '../../../helpers/sol';
import { getCoinPrice, getCollectionFloorPrice, getImg, numberToFixed } from "../../../utils/Helper";
import CONFIG from '../../../config';
import './index.css';

const { PublicKey } = anchor.web3;
const { 
  CLUSTER_API, 
  PIRATE_COLLECTION_NAME,
  REWARD_TOKEN,
  MARINE_COLLECTION_NAME,
  PRIATE_CANDY_MACHINE_CREATOR1,
  PRIATE_CANDY_MACHINE_CREATOR2,
  MARINE_CANDY_MACHINE_CREATOR
} = CONFIG;

ChartJS.register(ArcElement, Tooltip, Legend);
const chartData = {
  datasets: [
    {
      label: '# of Votes',
      data: [100 ,0],
      backgroundColor: [
        "#05FF00",
        "rgba(0, 240, 255, 0.6)"
      ],
      borderWidth: 1,
    },
  ],
};

const labelData:any[] = [
    {
      label: "Pirates",
      color: "#05FF00",
      value: 100
    },
    {
      label: "Marines",
      color: "rgba(0, 240, 255, 0.6)",
      value: 0
    }
];

function Dashboard() {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const solanaClient = new SolanaClient({ rpcEndpoint: CLUSTER_API } as SolanaClientProps);
  const [walletPirates, setWalletPirates] = useState<any>([]);
  const [walletMarines, setWalletMarines] = useState<any>([]);
  const [pirateFloorPirce, setPirateFloorPrice] = useState(0);
  const [solPrice, setSolPrice] = useState(0);
  const [bootyAmount, setBootyAmount] = useState(0);
  const [colLabelData, setColLabelData] = useState(labelData);
  const [colChartData, setColChartData] = useState(chartData);
  const [loading, setLoading] = useState(false);

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

      // get pirates from wallet
      let nftList = await solanaClient.getAllCollectibles([wallet!.publicKey!.toString()], [
        { candyMachineCreator: PRIATE_CANDY_MACHINE_CREATOR1 },
        { candyMachineCreator: PRIATE_CANDY_MACHINE_CREATOR2 },
        { candyMachineCreator: MARINE_CANDY_MACHINE_CREATOR }
      ]);
      // set state
      if (nftList[wallet!.publicKey!.toString()]) {
        const pirates = nftList[wallet!.publicKey!.toString()].filter((nft: any) => nft.name.indexOf(PIRATE_COLLECTION_NAME) >= 0);
        const marines = nftList[wallet!.publicKey!.toString()].filter((nft: any) => nft.name.indexOf(MARINE_COLLECTION_NAME) >= 0);
        setWalletPirates(pirates);     
        setWalletMarines(marines);
        const piratePercent = numberToFixed(pirates.length * 100 / (pirates.length + marines.length), 0);
        const marinePercent = 100 - piratePercent;
        const colPercents = [piratePercent, marinePercent];
        setColLabelData(colLabelData.map((dt: any, index: number) => ({
          ...dt,
          value: colPercents[index]
        })))
  
        colChartData.datasets[0].data = colPercents;
        setColChartData({
          ...colChartData,
          datasets: [...colChartData.datasets]
        });
      }
  
      // get booty from wallet
      const bootyTkAccounts = await connection.getParsedTokenAccountsByOwner(wallet!.publicKey, { mint: new PublicKey(REWARD_TOKEN) })
      let bootyAmount = 0;
      bootyTkAccounts.value.forEach(item => {
        bootyAmount += item?.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
      })
      //get floor prices
      const pirateFloor = await getCollectionFloorPrice('dope_pirates');
      setPirateFloorPrice(pirateFloor / 1000000000);
      const solPrice = await getCoinPrice('SOL');
      setSolPrice(solPrice);
      // set state
      setBootyAmount(numberToFixed(bootyAmount, 0));
    }
    catch (error) {
      console.log('error', error);
    }
  }

  return (
      <div className="frontend_home_content">
        {
          loading ?
          <div id="preloader"> </div> :
          <div id="preloader" style={{display: 'none'}}></div>
        }
        <div className="d_flex align_items_center justify_content_center info">
          <div className="col-6 text_center info_value">
            <p className="fontsize_30 title">Dopes treasure</p>
            <p className="price_usd">+{numberToFixed(solPrice * pirateFloorPirce * walletPirates.length, 2)} <span className="fontsize_35">USD</span></p>
            <div className="fontsize_35 booty">{bootyAmount} $RUM</div>
            <div className="fontsize_35 price_sol">{numberToFixed(pirateFloorPirce * walletPirates.length, 2)} $SOL</div>
          </div>
          <div className='col-6 text_center info_chart'>
            <div className="text_center chart_panel">
              <img src={getImg('frontend/skeleton-black.png')} alt="Skull"></img>
              <Doughnut 
                data={colChartData}
                options = {{
                  cutout: '86%',
                  rotation: 90
                }}
              />
            </div>
            <div className="d_flex justify_content_center align_items_center mt_16 chart_detail">
                {
                  labelData.map((_item, _index) => {
                    if(_item.label !== "") {
                      return (
                        <div key={_index} className="d_flex justify_content_between align_items_center detail">
  
                          <div className="color" style={{background: _item.color}}>
          
                          </div>
                          <div className="ml_8 sort">
                            <p className="fontsize_30">{_item.label}</p>
                          </div>
                        </div>                     
                      );
                    }
                    else return ""
                  })
                }
            </div>
          </div>
        </div>

        <div className="nfts">
          {
            walletPirates.length === 0  && walletMarines.length === 0? 
            <div className="no-nft">
              No Nft
            </div> :
            <div style={{width: '100%'}}>
              <Swiper
                  spaceBetween={30}
                  slidesPerView={5}
                  onSlideChange={() => console.log('slide change')}
                  onSwiper={(swiper) => console.log(swiper)}
              >
                {
                  walletPirates.map((_item: any, _index: number) => <SwiperSlide key={_index}><Pirate {..._item} /></SwiperSlide>)
                }
                {
                  walletMarines.map((_item: any, _index: number) => <SwiperSlide key={_index}><Pirate {..._item} /></SwiperSlide>)
                }
              </Swiper>
            </div>
          }
        </div>
      </div>
    )
}

export default Dashboard;
