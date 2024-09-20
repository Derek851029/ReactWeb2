import React, { useState, useEffect } from 'react';
import Icon, {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
    FileOutlined,
    RotateLeftOutlined,
    SearchOutlined,
    BookOutlined,
    SettingOutlined,
    UnorderedListOutlined,
    UserOutlined,
    MessageOutlined,
    TagOutlined,
    PictureOutlined,
    BellOutlined,
    AliwangwangOutlined,
    ShopOutlined,
    HistoryOutlined,
    FieldTimeOutlined,
    ClockCircleOutlined,
    CrownOutlined,
    ShoppingOutlined,
    PaperClipOutlined,
    StarOutlined,
    GiftOutlined,
    PayCircleOutlined,
    PhoneOutlined,
    ScheduleOutlined,
    MobileOutlined,
    FileTextOutlined,
    BarChartOutlined,
    LogoutOutlined,
    OrderedListOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Modal, Button } from 'antd';
import { Link, Outlet, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

import PKIconSrc from '../images/pkicon.png';
import PKLogoSrc from '../images/logo.png';

const { Header, Content, Footer, Sider } = Layout;

const PKIcon = (props) => <Icon component={() => (<img src={PKIconSrc} style={{ width: 14, height: 14 }}></img>)} {...props} />;

const icons = {
    HomeOutlined: < HomeOutlined />,
    UnorderedListOutlined: <UnorderedListOutlined></UnorderedListOutlined>,
    OrderedListOutlined: < OrderedListOutlined />,
    FileOutlined: <FileOutlined></FileOutlined>,
    RotateLeftOutlined: <RotateLeftOutlined></RotateLeftOutlined>,
    SearchOutlined: <SearchOutlined></SearchOutlined>,
    BookOutlined: <BookOutlined></BookOutlined>,
    SettingOutlined: <SettingOutlined></SettingOutlined>,
    UserOutlined: <UserOutlined></UserOutlined>,
    MessageOutlined: <MessageOutlined></MessageOutlined>,
    TagOutlined: <TagOutlined />,
    PictureOutlined: <PictureOutlined />,
    BellOutlined: < BellOutlined />,
    AliwangwangOutlined: < AliwangwangOutlined />,
    ShopOutlined: < ShopOutlined />,
    PKIcon: <PKIcon></PKIcon>,
    HistoryOutlined: <HistoryOutlined />,
    FieldTimeOutlined: < FieldTimeOutlined />,
    ClockCircleOutlined: < ClockCircleOutlined />,
    CrownOutlined: < CrownOutlined />,
    ShoppingOutlined: < ShoppingOutlined />,
    PaperClipOutlined: <PaperClipOutlined />,
    StarOutlined: < StarOutlined />,
    PayCircleOutlined: < PayCircleOutlined />,
    GiftOutlined: < GiftOutlined />,
    PhoneOutlined: < PhoneOutlined />,
    ScheduleOutlined: < ScheduleOutlined />,
    SettingOutlined: < SettingOutlined />,
    MobileOutlined: < MobileOutlined />,
    FileTextOutlined: < FileTextOutlined />,
    BarChartOutlined: < BarChartOutlined />,
};

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const App = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menus, setMenus] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const cookies = new Cookies();
    const homeSrc = "/home/" + cookies.get('AccountAid');
    const [selectPage, setSelectPage] = useState([]);

    const [timeInterval, setTimeInterval] = useState(null);
    const [userNmae, setUserName] = useState("");

    useEffect(() => {
        setSelectPage([location.pathname]);
        setUserName(cookies.get('Name'));

        getMenus();
        /*  console.log(token)*/
        const tokenCheck = setInterval(() => {
            var cookieToken = cookies.get('Token');

            if (cookieToken === undefined) {
                Modal.warning({
                    title: '連線逾時',
                    content: '登入權限已逾時，請重新登入。',
                    okText: "登出",
                    onOk() {
                        /*resetToken()*/
                        navigate("/login", { replace: true });
                    },
                    
                });
                clearInterval(tokenCheck);
            }
            //console.log(cookies.get("AgentID"))
            /* console.log(cookieToken)*/
        }, 1000);
        setTimeInterval(tokenCheck);
        return () => {
            clearInterval(tokenCheck);
        };
    }, []);

    const resetToken = () => {
        fetch('api/login/resetToken', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then((data) => {
                console.log(data)
            })
            .catch(error => {
         
                console.error('Unable to add item.', error);
            });
    }

    const getMenus = () => {
        const items = [];
        const children = [];
        children.push(getItem('帳號列表', '/administrator/list'));
        children.push(getItem('角色列表', '/roleGroup/list'));

        items.push(getItem('首頁', homeSrc, icons.HomeOutlined));
        items.push(getItem('最新消息', '/appNews/list', icons.BellOutlined));
        items.push(getItem('自訂訊息', '/appMessage/list', icons.AliwangwangOutlined));
        items.push(getItem('首頁輪播', '/appBanner/list', icons.PictureOutlined));

        items.push(getItem('App區塊管理', '/appBlock/list', icons.OrderedListOutlined));
        items.push(getItem('活動管理', '/activity/list', icons.PKIcon));
        items.push(getItem('站外活動管理', '/webactivity/list', icons.PKIcon));
        items.push(getItem('限時秒殺管理', '/seckill/list', icons.FieldTimeOutlined));
        items.push(getItem('送禮專區管理', '/vouchersetting/list', icons.ShoppingOutlined));
        items.push(getItem('當下時刻時段設定', '/currentMoment/list', icons.ClockCircleOutlined));
        items.push(getItem('當下時刻管理', '/momentManager/list', icons.ClockCircleOutlined));
        items.push(getItem('熱銷推薦管理', '/instantOffer/list', icons.CrownOutlined));
        items.push(getItem('點數兌換', '/redeemcoupon/list', icons.GiftOutlined));
        items.push(getItem('點數提醒', '/offertips/list', icons.StarOutlined));

        const children3 = [];
        children3.push(getItem('支付設定', '/appPayment/list'));
        items.push(getItem('商品卷設定', '15', icons.PayCircleOutlined, children3));
        items.push(getItem('時段問候', '/greeting/list', icons.ScheduleOutlined));
        items.push(getItem('動態連結管理', '/dynamiclink/list', icons.PaperClipOutlined));



        const children2 = [];
        children2.push(getItem('門市列表', '/store/list'));
        children2.push(getItem('類別列表', '/storeType/list'));
        items.push(getItem('門市管理', '28', icons.ShopOutlined, children2));

        
        items.push(getItem('聯絡我們', '/contactus/list', icons.PhoneOutlined));
        items.push(getItem('APP設定', '/appsetting/list', icons.SettingOutlined));
        items.push(getItem('APP版本控制', '/appupdatenotice/list', icons.MobileOutlined));
        items.push(getItem('APP會員管理', '/member/list', icons.FileTextOutlined));
        items.push(getItem('優惠券轉移紀錄', '/coupontransferrecord/list', icons.UnorderedListOutlined));
        items.push(getItem('標籤', '/tag/list', icons.TagOutlined));
        items.push(getItem('查看報表', '/statistical/list', icons.BarChartOutlined));
        items.push(getItem('後台帳號管理', '1', icons.SettingOutlined, children));
        /* console.log(items)*/
        setMenus(items);
    };

    //const getMenus = () => {
    //    fetch('/api/menu', {
    //        method: 'GET',
    //        headers: {
    //            'Accept': 'application/json',
    //            'Content-Type': 'application/json'
    //        }
    //    })
    //        .then(response => response.json())
    //        .then(data => {
    //            var items = [];

    //            var PARENT_ID;
    //            var itemsData = [];
    //            var groupPARENT_ID = [];

    //            data.forEach((value, index, arr) => {
    //                if (PARENT_ID == undefined) {
    //                    PARENT_ID = value.PARENT_ID
    //                }

    //                if (PARENT_ID != value.PARENT_ID) {
    //                    groupPARENT_ID.push(itemsData)

    //                    itemsData = []
    //                    PARENT_ID = value.PARENT_ID
    //                }

    //                itemsData.push(value)
    //            })

    //            groupPARENT_ID.forEach((value, index, arr) => {
    //                var label;
    //                var key;
    //                var icon;
    //                var children = [];

    //                value.forEach((value, index2, arr2) => {
    //                    const MyComponent = icons[value.AntDesignIcon]
    //        /*            console.log(MyComponent)*/
    //                    if (value.LEVEL_ID == 2) {
    //                        label = value.TREE_NAME;
    //                        key = index.toString()
    //                        icon = MyComponent
    //                    }
    //                    else if (value.LEVEL_ID == 3) {
    ///*                        console.log(value.ReactRouter)*/
    //                        children.push(getItem(value.TREE_NAME, value.ReactRouter))
    //                    }
    //                    else {

    //                    }
    //                })
    //                items.push(getItem(label, key, icon, children))
    //            })
    //            if (menus.length == 0) {
    //                setMenus(items)
    //            }

    //            console.log("items:",items)
    //        })
    //        .catch(Error => console.log(Error))
    //}

    const logOut = () => {
        clearInterval(timeInterval);
        cookies.remove("Aid");
        cookies.remove("Account");
        cookies.remove("Token");
        navigate("/login", { replace: true });
    };

    const linkTo = (item) => {
        navigate(item.key);
        setSelectPage([item.key]);
    };


    return (

        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}

            >

                <div className="logo">

                    <Link to={homeSrc}><img src={PKLogoSrc} style={{ width: '100%', height: '100%' }}></img></Link>
                    <div style={{ color: "white", display: "flex", alignItems: "center", fontSize: 16 }}>
                        <p>Hi, {userNmae}</p>
                        <div style={{ flexGrow: 1 }}></div>
                        <Button ghost size="small" onClick={logOut} icon={<LogoutOutlined />}>登出</Button>
                    </div>
                </div>

                <Menu theme="dark" selectedKeys={selectPage} mode="inline" items={menus} onClick={linkTo}></Menu>
            </Sider>
            <Layout
                className="site-layout"
                style={{
                    padding: 0,
                    background: colorBgContainer
                }}
            >
                <Header
                    style={{
                        background: colorBgContainer,
                    }}
                >
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                    })}
                </Header>
                <Content
                    style={{
                        margin: '0px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                    }}
                >
                    <Outlet></Outlet>

                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                </Footer>
            </Layout>
        </Layout>
    );
};
export default App;