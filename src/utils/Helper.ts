import { useState, useEffect } from 'react'
import * as anchor from '@project-serum/anchor';
import CONFIG from '../config';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { AccountLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import axios from 'axios';
import { PiratesStaking } from '../constants/idl';

const { 
    COMMITMENT, 
    DAY_TIME, 
    REWARD_TOKEN_DECIMAL, 
    HOUR_TIME, 
    STAKED_DATA_SEEDS,
    PROGRAM_ID,
 } = CONFIG;

export const VALUABLE_META_VALUES = [
    {
        trait: 'Crew Job',
        name: 'Captain',
        value: 90
    }, {
        trait: 'Crew Job',
        name: 'Archeologist',
        value: 91
    }, {
        trait: 'Crew Job',
        name: 'Navigator',
        value: 92
    }, {
        trait: 'Crew Job',
        name: 'Helmsman',
        value: 93
    }, {
        trait: 'Crew Job',
        name: 'Shipwright',
        value: 94
    }, {
        trait: 'Crew Job',
        name: 'Doctor',
        value: 95
    }, {
        trait: 'Crew Job',
        name: 'Cook',
        value: 96
    }, {
        trait: 'Crew Job',
        name: 'Musician',
        value: 97
    }, {
        trait: 'Crew Job',
        name: 'Marksman',
        value: 98
    }, {
        trait: 'Crew Job',
        name: 'Combatant',
        value: 99
    }, {
        trait: 'Body',
        name: 'Alien',
        value: 70,
        effect: 'From The Stars'
    }, {
        trait: 'Body',
        name: 'Monkey',
        value: 71,
        effect: 'Pre-Human Strength'
    }, {
        trait: 'Body',
        name: 'Vampire',
        value: 72,
        effect: 'Ancient Knowledge'
    }, {
        trait: 'Body',
        name: 'Zombie',
        value: 73,
        effect: 'Strange Tastes'
    }, {
        trait: 'Clothes',
        name: 'Space Suit',
        value: 10,
        effect: 'Major Tom'
    }, {
        trait: 'Clothes',
        name: 'Luffy',
        value: 11,
        effect: 'Fashion of a Protagonist'
    }, {
        trait: 'Clothes',
        name: 'Naked',
        value: 12,
        effect: 'Bravery'
    }, {
        trait: 'Clothes',
        name: 'Blackbeard_vest',
        value: 13,
        effect: 'A Piece of History'
    }, {
        trait: 'Clothes',
        name: 'Sport_Pirate',
        value: 14,
        effect: 'Athleticism'
    }, {
        trait: 'Clothes',
        name: 'Modern_Pirate',
        value: 15,
        effect: 'The Wealth of Modern Trade'
    }, {
        trait: 'Clothes',
        name: 'Stripped_Shirt',
        value: 16,
        effect: 'Patterns'
    }, {
        trait: 'Clothes',
        name: 'Bussiness_Pirate',
        value: 17,
        effect: `Why Don't We Make A Deal`
    }, {
        trait: 'Clothes',
        name: 'Colonial_Pirate',
        value: 18,
        effect: 'Empire'
    }, {
        trait: 'Crew',
        name: 'Dapper_duck',
        value: 20,
        effect: 'Flocking Together'
    }, {
        trait: 'Crew',
        name: 'Intergalactic_Crew',
        value: 21,
        effect: 'Space, The Final Frontier'
    }, {
        trait: 'Crew',
        name: 'Legendary_Crew',
        value: 22,
        effect: 'A Known Name'
    }, {
        trait: 'Crew',
        name: 'Primitive_Future',
        value: 23,
        effect: 'Of a Paradox Machine'
    }, {
        trait: 'Crew',
        name: 'Undead_Pirates',
        value: 24,
        effect: `Davy Jones' First Chosen`
    }, {
        trait: 'Face',
        name: 'Mutant',
        value: 30,
        effect: 'Uranium-235'
    }, {
        trait: 'Face',
        name: 'Happy_Alien',
        value: 31,
        effect: 'Starman'
    }, {
        trait: 'Face',
        name: 'Happy_Zombie',
        value: 32,
        effect: 'Emotional Undead'
    }, {
        trait: 'Face',
        name: 'Dead',
        value: 33,
        effect: 'Murder!'
    }, {
        trait: 'Face',
        name: 'Two_Eyes',
        value: 34,
        effect: 'Hmm'
    }, {
        trait: 'Face',
        name: 'Bored_Ape',
        value: 35,
        effect: 'A Classic'
    }, {
        trait: 'Face',
        name: 'Eye_Patch_Monkey',
        value: 36,
        effect: 'Regreession'
    }, {
        trait: 'Face',
        name: 'Ape',
        value: 37,
        effect: 'True Pirate Monkey'
    }, {
        trait: 'Face',
        name: '3D_Glasses',
        value: 38,
        effect: 'Timey-Wimey'
    }, {
        trait: 'Face',
        name: 'Blackbeard',
        value: 39,
        effect: 'Gunpowder Beard'
    }, {
        trait: 'Face',
        name: 'Eye_Patch',
        value: 310,
        effect: 'True Pirate'
    }, {
        trait: 'Face',
        name: 'Zoro',
        value: 311,
        effect: 'Can Hold a Sword Like That'
    }, {
        trait: 'Face',
        name: 'Bored',
        value: 312,
        effect: 'Eh'
    }, {
        trait: 'Face',
        name: 'Solana_glasses',
        value: 313,
        effect: 'Best Blockchain'
    }, {
        trait: 'Head',
        name: 'King',
        value: 50,
        effect: 'Long Live the King'
    }, {
        trait: 'Head',
        name: 'Captain_Hat',
        value: 51,
        effect: 'Captain phillips'
    }, {
        trait: 'Head',
        name: 'Ninja',
        value: 52,
        effect: 'Combat: An Art'
    }, {
        trait: 'Head',
        name: 'Pirate_Cap',
        value: 53,
        effect: `A Pirate's Life For Me`
    }, {
        trait: 'Head',
        name: 'Halo',
        value: 54,
        effect: 'Muse'
    }, {
        trait: 'Head',
        name: 'Caribe_Hat',
        value: 55,
        effect: 'Classic!'
    }, {
        trait: 'Head',
        name: 'Dope_Hat',
        value: 56,
        effect: 'Part of the Project'
    }, {
        trait: 'Head',
        name: 'Cook_Hat',
        value: 57,
        effect: 'Parisan Training'
    }, {
        trait: 'Head',
        name: 'Zoro',
        value: 58,
        effect: 'Pirate Hunter'
    }, {
        trait: 'Head',
        name: 'Messy',
        value: 59,
        effect: 'Hard Working'
    }, {
        trait: 'Earring',
        name: 'Holden_earring',
        value: 40,
        effect: 'Renaissance Pirate'
    }, {
        trait: 'Earring',
        name: 'Silver_earring',
        value: 41,
        effect: 'Precious Metals'
    }, {
        trait: 'Ducks',
        value: 60,
        effect: 'Polly Wants A Breadcrumb'
    }
]

export const AFFECTING_ATTRIBUTES:any [] = [
    70, // BODY_ALIEN,
    71, // BODY_MONKEY,
    72, // BODY_VAMPIRE,
    73, // BODY_ZOMBIE,
    12, // CLOTHES_NAKED,
    14, // CLOTHES_SPORT_PIRATE,
    16, // CLOTHES_STRIPED_SHIRT,
    23, // CREW_PRIMITIVE_FUTURE,
    31, // FACE_HAPPY_ALIEN,
    34, // FACE_TWO_EYES,
    35, // FACE_BORED_APE,
    36, // FACE_EYE_PATCH_MONKEY,
    38, // FACE_3D_GLASSES,
    39, // FACE_BLACKBEARD,
    311, // FACE_ZORO,
    51, // HEAD_CAPTAIN_HAT,
    54, // HEAD_HALO,
    57, // HEAD_COOK_HAT,
    59, // HEAD_MESSY,
    60, // DUCK_ALL
];

export const BASE_REWARD_JOBS: any [] = [
    92, // JOB_NAVIGATOR,
    99, // JOB_COMBATANT,
    91, // JOB_ARCHAEOLOGIST,
    96, // JOB_COOK,
    9898, // JOB_COMATANT_MARKSMAN,
    9898, // JOB_COMATANT_MARKSMAN,
    97, // JOB_MUSICIAN,
    95, // JOB_DOCTOR,
    92, // JOB_NAVIGATOR,
    90, // JOB_CAPTAIN,
    9999, // JOB_AFFECTED,
    91, // JOB_ARCHAEOLOGIST,
    95, // JOB_DOCTOR,
    90, // JOB_CAPTAIN,
    99, // JOB_COMBATANT,
    92, // JOB_HELMSMAN,
    6767, // JOB_COOK_MUSICIAN,
    96, // JOB_COOK,
    94, // JOB_SHIPWRIGHT,
    2323, // JOB_NAVIGATOR_HELMSMAN
];

export const getImg = (img: string) => {
    if (img === undefined)
        return  null;
    return require(`../assets/${img}`).default
}

export const useResize = () => {
    const [screenSize, setScreenSize] = useState({
        width: 0,
        height: 0,
        isMobile: false,
        isResponsive: false
    })

    const updateSize = () => {
        setScreenSize({
            width: window.innerWidth,
            height: window.innerHeight,
            isMobile: window.innerWidth < 768,
            isResponsive: window.innerWidth < 1320
        })
    }

    useEffect(() => {
        window.addEventListener("resize", updateSize)
        updateSize()

        return () => {
            window.removeEventListener("resize", updateSize)
        }
    }, [])

    return screenSize;
}

export const useDetectOutsideClick = (el: any, initialState: any) => {
    const [isActive, setIsActive] = useState(initialState);

    useEffect(() => {
        const onClick = (e: any) => {
            if (el.current !== null && !el.current.contains(e.target)) {
                setIsActive(!isActive);
            }
        };

        if (isActive) {
            window.addEventListener("click", onClick);
        }

        return () => {
            window.removeEventListener("click", onClick);
        };
    }, [isActive, el]);

    return [isActive, setIsActive];
};

export const getEnglishNumber = (num: number) => {
    return num.toLocaleString();
}

export const numberToFixed = (num: number, fixed: number) => {
    return Number(Number(num).toFixed(fixed));
}

export const getMetaValuesFromAttributes = (metadata: any) =>  {
    const DEFAULT_TRAIT_VALUE = 0;
    let metaValues: any = {};
    let isSpecial = false;
    Object.keys(metadata)?.forEach((key: any) => {
        const data = metadata[key];
        if (data.trait_type.toLowerCase() === 'Head'.toLowerCase() && data.value === '∅'){
            isSpecial = true;
        }
        if (data.trait_type.toLowerCase() === 'Ducks'.toLowerCase() && data.value !=='∅') {
            metaValues = {
                ...metaValues,
                [data.trait_type.toLowerCase()]: 60
            }
        }
        else {
            const meta = VALUABLE_META_VALUES.find(
                (meta: any) => meta.trait?.toLowerCase() === data.trait_type?.toLowerCase() && meta.name?.toLowerCase() === data.value?.toLowerCase()
            );
            metaValues = {
                ...metaValues,
                [data.trait_type.toLowerCase()]: meta ? meta.value : DEFAULT_TRAIT_VALUE
            }
        }
        
    });
    if (isSpecial) {
        metaValues = {
            ...metaValues,
            special: 10000
        }
    }
    else {
        metaValues = {
            ...metaValues,
            special: DEFAULT_TRAIT_VALUE
        }
    }
    return metaValues;
}

export const getProvider = (connection: anchor.web3.Connection, wallet: AnchorWallet ) => {
    if (wallet)
        return new anchor.Provider(connection, wallet, COMMITMENT as anchor.web3.ConfirmOptions);
}

export const makeATokenAccountTransaction = async (connection: anchor.web3.Connection, wallet: anchor.web3.PublicKey, owner: anchor.web3.PublicKey, mint: anchor.web3.PublicKey) => {
    const { SystemProgram, Keypair } = anchor.web3;
    const instructions = [], signers = [];
    const aTokenAccounts = await connection.getParsedTokenAccountsByOwner(owner, { mint: mint });
    const rent = await connection.getMinimumBalanceForRentExemption(
        AccountLayout.span
    )
    let tokenTo;
    if (aTokenAccounts.value.length === 0) {
      const aTokenAccount = new Keypair();
      instructions.push(SystemProgram.createAccount({
        fromPubkey: wallet,
        newAccountPubkey: aTokenAccount.publicKey,
        lamports: rent,
        space: AccountLayout.span,
        programId: TOKEN_PROGRAM_ID
      }));
      instructions.push(Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,
        mint,
        aTokenAccount.publicKey,
        owner
      ));
      signers.push(aTokenAccount);
      tokenTo = aTokenAccount.publicKey;
    }
    else {
      tokenTo = aTokenAccounts.value[0].pubkey;
    }

    return { instructions, signers, tokenTo }
}

export const getCollectionFloorPrice = async (collection: string) => {
    const result = await axios.get(`https://magiceden.boogle-cors.workers.dev?u=https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/${collection}?edge_cache=true`);
    return result.data.results.floorPrice;
}

export const getCoinPrice = async (coin: string) => {
    const result = await axios.get(`https://api.coinbase.com/v2/exchange-rates`);
    return 1 / result.data.data.rates[coin];
}

export const getNftInfo = async (rewardList: any [], currentTime: number) => {
    let totalReward = 0;
    for (let i = 0; i < rewardList.length; i ++) {
        const item = rewardList[i];
        let isFinish: boolean = false;
        let period: number, days: number;
        if (i + 1 < rewardList.length) {
            if (rewardList[i + 1].time + DAY_TIME > currentTime) {
                isFinish = true;
                period = (currentTime - item.time) / DAY_TIME;
                days = Math.floor(period);
            }
            else {
                period = (rewardList[i + 1].time - item.time) / DAY_TIME;
                days = Math.floor(period) + 1;
            }
        }
        else {
            period = (currentTime - item.time) / DAY_TIME;
            days = Math.floor(period);
        }
        const reward = item.reward / REWARD_TOKEN_DECIMAL;
        totalReward += reward * days;
        if (isFinish) {
            break;
        }
    }

    let nextUpdateTime = 0;
    if (rewardList.length > 0) {
        nextUpdateTime = (currentTime - rewardList[0].time) > 0 ? (currentTime - rewardList[0].time) : 0;
    }

    let hour = Math.floor(nextUpdateTime % DAY_TIME / HOUR_TIME);
    let min = Math.floor(nextUpdateTime  % DAY_TIME % HOUR_TIME) ;
    return { 
        rewardPerDay: rewardList.length > 0 ? rewardList[rewardList.length - 1].reward / REWARD_TOKEN_DECIMAL : 0,
        totalReward, 
        nextUpdateTime: hour > 0 ? `${hour}hr ${min}min` : `${min}min`, 
        passedDays: Math.floor(nextUpdateTime / DAY_TIME)
    };
}

export const getCurrentChainTime = async (connection: anchor.web3.Connection) => {
    const slot = await connection.getSlot(COMMITMENT);
    const curChainTime = await connection.getBlockTime(slot);
    return curChainTime;
}

export const getCombosBoosts = async (nftList: any[]) => {
    let combos = [];
    const classes: string[] = ['font_success', 'font_warning', 'font_brown', 'font_blue', 'font_purple'];
    let list: any[] = []
    let visitedAttrList: boolean[] = [];
    // get combos
    let jobList: any = {}, comboList: any = {};
    VALUABLE_META_VALUES.filter((item: any) => item.trait === 'Job')
                .forEach((item: any) => jobList[item.name] = false);

    let isSpecial: boolean = false;
    // get boosts
    nftList.forEach((metadata: any) => {
        Object.keys(metadata).forEach((key: any) => {
            const meta = metadata[key];
            if (meta.trait_type === 'Crew Job') {
                jobList[meta.value] = true;
                const head = Object.keys(metadata).find((key: any) => metadata[key].trait_type.toLowerCase() === 'Head'.toLowerCase() && metadata[key].value.toLowerCase() === 'Zoro'.toLowerCase());
                const earring = Object.keys(metadata).find((key: any) => metadata[key].trait_type.toLowerCase() === 'Earring'.toLowerCase() && metadata[key].value.toLowerCase() === 'Holden_earring'.toLowerCase());
                if (head) {
                    if (meta.value === 'Combatant') jobList['Marksman'] = true;
                    else jobList['Combatant'] = true;
                }
                if (earring) {
                    if (meta.value === 'Musician') jobList['Archeologist'] = true;
                    else jobList['Musician'] = true;
                }
            }
            if (meta.trait_type === 'Head' && meta.value === '∅') {
                isSpecial = true;
            }

            let item: any = VALUABLE_META_VALUES.find((item: any) => item?.trait?.toLowerCase() === meta?.trait_type?.toLowerCase() && item?.name?.toLowerCase() === meta.value.toLowerCase());
            if (item && item.effect && !visitedAttrList[item?.name]) {
                const random = Math.floor(Math.random() * 5);
                list.push({
                    class: `${classes[random]} fontsize_35`,
                    text: item?.effect
                });
                visitedAttrList[item?.name] = true;
            }

            if (meta.trait_type.toLowerCase() === 'Ducks'.toLowerCase() && meta.value !== '∅') {
                const random = Math.floor(Math.random() * 5);
                list.push({
                    class: `${classes[random]} fontsize_35`,
                    text: 'Polly Wants A Breadcrumb'
                });
                visitedAttrList[meta.value] = true;
            }
        })
    })

    if (jobList['Navigator'] && jobList['Helmsman']) comboList['riding_the_waves'] = true;
    if (jobList['Shipwright'] && jobList['Doctor']) comboList['reparing_healing'] = true;
    if (jobList['Marksman'] && jobList['Combatant']) comboList['our_militia'] = true;
    if (jobList['Musician'] && jobList['Cook'] && jobList['Archeologist']) comboList['unexpected_essentials'] = true;

    if (comboList['riding_the_waves'] && comboList['unexpected_essentials']) comboList['seafarers'] = true;
    if (comboList['reparing_healing'] && comboList['our_militia']) comboList['yo_ho_ho'] = true;

    if (jobList['Captain'] && comboList['seafarers'] && comboList['yo_ho_ho']) combos.push('Full Crew');
    else {
        if (comboList['seafarers']) {
            combos.push('Seafarers');
            if (!comboList['yo_ho_ho']) {
                if (comboList['reparing_healing']) combos.push('Repairing! Healing!');
                else if (comboList['our_militia']) combos.push('Our Militia');
            }
        }
        if (comboList['yo_ho_ho']) {
            combos.push('Yo Ho Ho!');
            if (!comboList['seafarers']) {
                if (comboList['riding_the_waves']) combos.push('Riding the Waves');
                else if (comboList['unexpected_essentials']) combos.push('Unexpected Essentials');
            }
        }
        if (!comboList['seafarers'] && !comboList['yo_ho_ho']){
            if (comboList['reparing_healing']) combos.push('Repairing! Healing!');
            else if (comboList['our_militia']) combos.push('Our Militia');
            if (comboList['riding_the_waves']) combos.push('Riding the Waves');
            else if (comboList['unexpected_essentials']) combos.push('Unexpected Essentials');
        }
    }

    if (isSpecial) {
        const random = Math.floor(Math.random() * 5);
        list = [
            ...list, {
                class: `${classes[random]} fontsize_40`,
                text: 'Walking Among Legends'
            }
        ]
    }

    if (combos.length > 0) {
        return [
            ...combos.map((combo: string) => {
                const random = Math.floor(Math.random() * 5);
                return{
                    class: `${classes[random]} fontsize_40`,
                    text: combo
                }
            })
            , ...list];
    }

    
    return list;
}

export const getUpdateNeedPirates = async (connection: anchor.web3.Connection, wallet: anchor.web3.PublicKey, program: anchor.Program<PiratesStaking>, pirates: any[], metadataList: any[]) => {
    // get attribute list
    let attributeList: any[] = [];

    metadataList.forEach((metadata: any) => {
        attributeList.push(metadata.body);
        attributeList.push(metadata.clothes);
        attributeList.push(metadata.crew);
        attributeList.push(metadata.face);
        attributeList.push(metadata.head);
        attributeList.push(metadata.earring);
        attributeList.push(metadata.ducks);
        attributeList.push(metadata.special);
    })

    // get affected job list
    let affectedJobList: any[] = [];
    attributeList.forEach((attribute: any) => {
        const index = AFFECTING_ATTRIBUTES.findIndex((attr: any) => attr === attribute);
        if (index >= 0) {
            const job = BASE_REWARD_JOBS[index];
            if (job === 9898/*JOB_COMATANT_MARKSMAN*/)  {
                affectedJobList.push(99); // Combatant
                affectedJobList.push(98); // Marksman
            }
            else if (job === 2323 /*JOB_NAVIGATOR_HELMSMAN*/) {
                affectedJobList.push(92); // Navigator
                affectedJobList.push(93); // Helmsman
            }
            else if (job === 6767/*JOB_COOK_MUSICIAN*/) {
                affectedJobList.push(96); // Cook
                affectedJobList.push(97); // Musician
            }
            else {
                affectedJobList.push(BASE_REWARD_JOBS[index]);
            }

            affectedJobList.push(BASE_REWARD_JOBS[index]);
        }
    })

    let updateNeedPirates: any[] = [];
    for (let i = 0; i < pirates.length; i ++) {
        const pirate = pirates[i];
        let [stakedDataPda] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(STAKED_DATA_SEEDS), wallet.toBuffer(), new anchor.web3.PublicKey(pirate.mint).toBuffer()],
            new anchor.web3.PublicKey(PROGRAM_ID)
        );
        const stakedDataInfo = await connection.getAccountInfo(stakedDataPda);
        if (stakedDataInfo) {
            const stakedData = await program.account.stakedData.fetch(stakedDataPda);
            const rewardList: any = stakedData.rewardList;
            if (rewardList.length === 0) {
                updateNeedPirates.push(pirate);
            }
            else {
                const job = pirate.attributes.find((attribute: any) => attribute.trait_type === 'Crew Job');
                if (job) {
                    if (affectedJobList.find(((affectedJob: any) => affectedJob === job.value))) {
                        updateNeedPirates.push(pirate);
                    }
                }
            }
        }
        else {
            updateNeedPirates.push(pirate);
        }
    }
    return updateNeedPirates;
}

export const getMetadataListWithCombo = (metadataList: any[]) => {
    let navigatorList: any[] = [];
    let helsmanList: any[] = [];
    let shiprwrightList: any[] = [];
    let doctorList: any[] = [];
    let marksmanList: any[] = [];
    let combatantList: any[] = [];
    let musicianList: any[] = [];
    let cookList: any[] = [];
    let archeologistList: any[] = [];
    let captainList: any[] = [];

    let ridingTheWavesList: any[] = [];
    let repairingHealingList: any[] = [];
    let ourMilitiaList: any[] = [];
    let unexpectedEssentialList: any[] = [];

    let seafarerList: any[] = [];
    let yoHoHoList: any[] = [];

    let fullCrewList: any[] = [];

    metadataList.sort((a: any, b: any) => a.id - b.id);
    for (let i = 0; i < metadataList.length; i ++) {
        const metadata = metadataList[i];
        switch (metadata.job) {
            case 90:
                captainList.push(metadata);
                break;
            case 91:
                archeologistList.push(metadata);
                break;
            case 92:
                navigatorList.push(metadata);
                break;
            case 93:
                helsmanList.push(metadata);
                break;
            case 94:
                shiprwrightList.push(metadata);
                break;
            case 95:
                doctorList.push(metadata);
                break;
            case 96:
                cookList.push(metadata);
                break;
            case 97:
                musicianList.push(metadata);
                break;
            case 98:
                marksmanList.push(metadata);
                break;
            case 99:
                combatantList.push(metadata);
                break;
        }

        if (metadata.head === 58) {
            if (metadata.job === 99) {
                marksmanList.push(metadata);
            }
            else {
                combatantList.push(metadata);
            }
        }

        if (metadata.earring === 40) {
            if (metadata.job === 97) {
                archeologistList.push(metadata);
            }
            else {
                musicianList.push(metadata);
            }
        }
    }
    let loop = Math.min(navigatorList.length, helsmanList.length);
    for (let i = 0; i < loop; i ++) {
        ridingTheWavesList.push([
            navigatorList[0],
            helsmanList[0]
        ])
        navigatorList.splice(0, 1);
        helsmanList.splice(0, 1);
    }

    loop = Math.min(shiprwrightList.length, doctorList.length);
    for (let i = 0; i < loop; i ++) {
        repairingHealingList.push([
            shiprwrightList[0],
            doctorList[0]
        ])
        shiprwrightList.splice(0, 1);
        doctorList.splice(0, 1);
    }

    loop = Math.min(marksmanList.length, combatantList.length);
    for (let i = 0; i < loop; i ++) {
        ourMilitiaList.push([
            marksmanList[0],
            combatantList[0]
        ])
        marksmanList.splice(0, 1);
        combatantList.splice(0, 1);
    }

    loop = Math.min(musicianList.length, cookList.length, archeologistList.length);
    for (let i = 0; i < loop; i ++) {
        unexpectedEssentialList.push([
            musicianList[0],
            cookList[0],
            archeologistList[0]
        ])
        musicianList.splice(0, 1);
        cookList.splice(0, 1);
        archeologistList.splice(0, 1);
    }

    loop = Math.min(ridingTheWavesList.length, unexpectedEssentialList.length);
    for (let i = 0; i < loop; i ++) {
        seafarerList.push([
            ...ridingTheWavesList[0],
            ...unexpectedEssentialList[0]
        ])
        ridingTheWavesList.splice(0, 1);
        unexpectedEssentialList.splice(0, 1);
    }

    loop = Math.min(repairingHealingList.length, ourMilitiaList.length);
    for (let i = 0; i < loop; i ++) {
        yoHoHoList.push([
            ...repairingHealingList[0],
            ...ourMilitiaList[0]
        ])
        repairingHealingList.splice(0, 1);
        ourMilitiaList.splice(0, 1);
    }

    loop = Math.min(seafarerList.length, yoHoHoList.length, captainList.length);
    for (let i = 0; i < loop; i ++) {
        fullCrewList.push([
            ...seafarerList[0],
            ...yoHoHoList[0],
            captainList[0]
        ])
        seafarerList.splice(0, 1);
        yoHoHoList.splice(0, 1);
        captainList.splice(0, 1);
    }

    let metadataWithComboList: any = [];
    for (let i = 0; i < fullCrewList.length; i ++) {
        let members = fullCrewList[i].map((member: any) => ({
            ...member,
            combo: 3
        }))
        metadataWithComboList = [
            ...metadataWithComboList,
            ...members,    
        ]
    }
    
    for (let i = 0; i < seafarerList.length; i ++) {
        let members = seafarerList[i].map((member: any) => ({
            ...member,
            combo: 2
        }))
        metadataWithComboList = [
            ...metadataWithComboList,
            ...members,    
        ]
    }

    for (let i = 0; i < yoHoHoList.length; i ++) {
        let members = yoHoHoList[i].map((member: any) => ({
            ...member,
            combo: 2
        }))
        metadataWithComboList = [
            ...metadataWithComboList,
            ...members,    
        ]
    }

    for (let i = 0; i < ridingTheWavesList.length; i ++) {
        let members = ridingTheWavesList[i].map((member: any) => ({
            ...member,
            combo: 1
        }))
        metadataWithComboList = [
            ...metadataWithComboList,
            ...members,    
        ]
    }

    for (let i = 0; i < repairingHealingList.length; i ++) {
        let members = repairingHealingList[i].map((member: any) => ({
            ...member,
            combo: 1
        }))
        metadataWithComboList = [
            ...metadataWithComboList,
            ...members,    
        ]
    }

    for (let i = 0; i < ourMilitiaList.length; i ++) {
        let members = ourMilitiaList[i].map((member: any) => ({
            ...member,
            combo: 1
        }))
        metadataWithComboList = [
            ...metadataWithComboList,
            ...members,    
        ]
    }

    for (let i = 0; i < unexpectedEssentialList.length; i ++) {
        let members = unexpectedEssentialList[i].map((member: any) => ({
            ...member,
            combo: 1
        }))
        metadataWithComboList = [
            ...metadataWithComboList,
            ...members,    
        ]
    }

    let affectedByUnexpectedEssentialList: any[] = [];
    for (let i = 0; i < unexpectedEssentialList.length; i ++) {
        affectedByUnexpectedEssentialList = [
            ...affectedByUnexpectedEssentialList,
            ...unexpectedEssentialList[i]
        ]
    }
    return { metadataWithComboList, affectedByUnexpectedEssentialList };
}

export const getMultiplier = (id: any, metadataList: any[]) => {
    const metadata = metadataList.find((metadata: any) => metadata.id === id);
    if (metadata) return metadata.combo;
    return 0;
}

export const getHasAffected = (id: any, metadataList: any[]) => {
    const metadata = metadataList.find((metadata: any) => metadata.id === id);
    if (metadata) return 1;
    return 0;
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))