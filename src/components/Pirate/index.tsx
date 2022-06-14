import { useState } from "react";
import { getEnglishNumber } from "../../utils/Helper";
import Button from "../Button"

import './index.css';

const Pirate = (props: any) => {
    const [isHover, setIsHover] = useState(false);

    const { 
        name, 
        image, 
        bounty, 
        status, 
        showStatus, 
        showButton, 
        index, 
        enableState, 
        attributes, 
        showJob, 
        rewardPerDay,
        totalReward, 
        multiButton,
    } = props;

    const crewJob = attributes?.find((attribute: any) => attribute.trait_type === 'Crew Job');
    return (
        <div className="text_center pirate_nft" 
            onMouseEnter={() => setIsHover(true)} 
            onMouseLeave={() => setIsHover(false)}
        >
            <p className="fontsize_30 name">{name}</p>
            {showJob && <p className="fontsize_25 name">{crewJob?.value}</p>}
            <div className={/*rewardPerDay === 0 ? "img_box danger" : */"img_box"}>
                <img src={image} alt="Pirate NFT" className="mt_8" />
                {
                    totalReward !== undefined && isHover &&
                    <div className="mask">
                        <div>Daily Reward:</div>
                        <div> {getEnglishNumber(rewardPerDay)} </div>
                        <div>Rum earned: {getEnglishNumber(totalReward)}</div>
                    </div>
                }
            </div>
            {showStatus && 
                <p className="mt_8 fontsize_25 bounty">
                    Bounty: {getEnglishNumber(bounty)}
                </p>
            }
            {showButton && 
                <div>
                    { multiButton ?
                        <div className="d_flex justify_content_center">
                            <Button status={status === 2 ? 1: status} enableState={status !== 2 && enableState} onClick={() => props.onClickButton(index, status === 2 ? 1: status)}/>
                            {
                                status !== 0  &&
                                <Button status={2} enableState={status !== 1 && enableState} onClick={() => props.onClickButton(index, 2)}/>
                            }
                        </div>
                        :
                        <div className="d_flex justify_content_center">
                            <Button status={status} enableState={enableState} onClick={() => props.onClickButton(index)} className={"fontsize_30"}/>
                        </div>
                    }
                </div>
             }
        </div>
    )
}

export default Pirate