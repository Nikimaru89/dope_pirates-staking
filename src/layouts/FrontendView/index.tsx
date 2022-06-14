import { Outlet } from "react-router-dom";
import { FrontendHeader } from "./FrontendHeader";
import { SideMenu } from "./SideMenu";

import { getImg } from "../../utils/Helper";
import "./index.css";

interface Menu {
    menu_icon: string,
    menu_url: string,
    menu_link: string,
}

const site_menu: Array<Menu> = [{
    'menu_icon': "clock.png",
    'menu_url': "dashboard",
    'menu_link': 'Dashboard'
},
{
    'menu_icon': "skull.png",
    'menu_url': "pirates",
    'menu_link': 'Pirates'
},
{
    'menu_icon': "skull.png",
    'menu_url': "marines",
    'menu_link': 'Marines'
},
{
    'menu_icon': "skull.png",
    'menu_url': "missions",
    'menu_link': 'Missions'
}
];

export const FrontendView = () => {
    return (
        <div className="frontend">
            <img className="wrapper-img" src={getImg('frontend/background.png')} alt="Background" />
            <div className="container">
                
                <div className="header">
                    <div className="skeleton">
                        <img src={getImg('frontend/logo.svg')} alt="Logo" />
                    </div>
                </div>

                <div className="panel">
                    <img className="back-img" src={getImg('frontend/panel.png')} alt="Panel" />
                    <FrontendHeader/>
                    <SideMenu menu={site_menu}/>

                    <div className="main_content">
                        <div className="content">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}