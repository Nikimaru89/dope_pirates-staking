import { Link } from 'react-router-dom';

import { getImg } from "../../../utils/Helper";
import './SideMenu.css'

export const SideMenu = (props: { menu: any[]; }) => {

    return (
        <div className="frontend_menu">
            {props?.menu && Array.isArray(props.menu) && 
                props.menu.map((_item: { menu_url: string; menu_link: string; menu_icon: string }, _index: number) => {
                    return(
                        <div key={_index} className="d_flex align_items_center nav_menu">
                            <img src={getImg(`frontend/icons/${_item.menu_icon}`)} alt="Menu"/>
                            <Link to={_item.menu_url} className="fontsize_40 standard_font ml_16">{_item.menu_link}</Link>
                        </div>
                        
                        );
                })
            }
        </div>
    );
}
