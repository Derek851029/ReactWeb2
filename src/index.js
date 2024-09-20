import React from 'react';
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import Root from "./routers/router";
import ErrorPage from "./routers/error-page";
import {ConfigProvider } from 'antd';
import zhTW from 'antd/locale/zh_TW';
import Login from './pages/login/Login'
import Home from './pages/Home/Home';

import AdministratorList from './pages/administrator/administratorList';
import AdministratorNew from './pages/administrator/administratorNew';
import AdministratorEdit from './pages/administrator/administratorEdit';

import RoleGroupList from './pages/administrator/roleGroupList';
import RoleGroupNew from './pages/administrator/roleGroupNew';
import RoleGroupEdit from './pages/administrator/roleGroupEdit';

import TagList from './pages/tag/tagList';
import TagNew from './pages/tag/tagNew';

import AppBannerList from './pages/appBanner/appBannerList'
import AppBannerNew from './pages/appBanner/appBannerNew'
import AppBannerEdit from './pages/appBanner/appBannerEdit'

import AppNewsList from './pages/appNews/appNewsList'
import AppNewsVersion from './pages/appNews/appNewsVersion'
import AppNewsNew from './pages/appNews/appNewsNew'
import AppNewsEdit from './pages/appNews/appNewsEdit'

import AppMessageList from './pages/appMessage/appMessageList'
import AppMessageVersion from './pages/appMessage/appMessageVersion'
import AppMessageDeliveryList from './pages/appMessage/appMessageDeliveryList'
import AppMessageNew from './pages/appMessage/appMessageNew'
import AppMessageEdit from './pages/appMessage/appMessageEdit'

import StoreList from './pages/store/storeList'
import StoreNew from './pages/store/storeNew'
import StoreEdit from './pages/store/storeEdit'
import StoreVersion from './pages/store/storeVersion'

import StoreTypeList from './pages/store/storeTypeList'
import StoreTypeNew from './pages/store/storeTypeNew'
import StoreTypeEdit from './pages/store/storeTypeEdit'

import ActivityList from './pages/activity/activityList';
import ActivityNew from './pages/activity/activityNew';
import ActivityEdit from './pages/activity/activityEdit'
import ActivityVersion from './pages/activity/activityVersion'

import WebActivityList from './pages/webactivity/webactivityList'
import WebActivityNew from './pages/webactivity/WebActivityNew'
import WebActivityTakeAmount from './pages/webactivity/TakeAmountList'

import ActivityOffsiteList from './pages/activityOffsite/activityOffsiteList';
import ActivityOffsiteNew from './pages/activityOffsite/activityOffsiteNew';
import ActivityOffsiteEdit from './pages/activityOffsite/activityOffsiteEdit';

import DynamicLinkList from './pages/dynamicLink/dynamicLinkList'
import DynamicLinkNew from './pages/dynamicLink/dynamicLinkNew'
import DynamicLinkEdit from './pages/dynamicLink/dynamicLinkEdit'
import DynamicLinkVersion from './pages/dynamicLink/dynamicLinkVersion'

import OfferTipsList from './pages/offerTips/offerTipsList';
import OfferTipsNew from './pages/offerTips/offerTipsNew';
import OfferTipsEdit from './pages/offerTips/offerTipsEdit';
import OfferTipsVersion from './pages/offerTips/offerTipsVersion'

import RedeemCouponList from './pages/redeemCoupon/redeemCouponList';
import RedeemCouponNew from './pages/redeemCoupon/redeemCouponNew';
import RedeemCouponEdit from './pages/redeemCoupon/redeemCouponEdit';
import RedeemCouponVersion from './pages/redeemCoupon/redeemCouponVersion'

import Payment from './pages/appPayment/payment'

import AppContactusList from './pages/appContactus/appContactusList';
import AppContactusEdit from './pages/appContactus/appContactusEdit';
import AppContactusVersion from './pages/appContactus/appContactusVersion'

import AppGreetingList from './pages/appGreeting/appGreetingList';
import AppGreetingEdit from './pages/appGreeting/appGreetingEdit';

import AppSettingList from './pages/appSettings/appSettingList';
import AppSettingEdit from './pages/appSettings/appSettingEdit'

import AppUpatenoticeList from './pages/appUpdatenotice/appUpdatenoticeList';
import AppUpdatenoticeEdit from './pages/appUpdatenotice/appUpdatenoticeEdit'
import AppUpdatenoticeVersion from './pages/appUpdatenotice/appUpdatenoticeVersion';

import MemberList from './pages/member/memberList';
import MemberEdit from './pages/member/memberEdit'

import CouponTransferRecordList from './pages/couponTransferRecord/couponTransferRecordList';
import CouponTransferRecordView from './pages/couponTransferRecord/couponTransferRecordView'

import StatisticalList from './pages/statistical/statisticalList';
import StatisticalView from './pages/statistical/statisticalView';

import AppBlockList from './pages/appBlock/appBlockList'

import SeckillList from './pages/activity/seckillList';
import SeckillNew from './pages/activity/seckillNew';
import SeckillEdit from './pages/activity/seckillEdit';

import MomentSettingList from './pages/currentMoment/momentSettingList';
import MomentSettingNew from './pages/currentMoment/momentSettingNew';
import MomentSettingEdit from './pages/currentMoment/momentSettingEdit';

import MomentManagerList from './pages/currentMoment/momentManagerList'
import MomentManagerNew from './pages/currentMoment/momentManagerNew'
import MomentManagerEdit from './pages/currentMoment/momentManagerEdit'

import InstantOfferList from './pages/instantOffer/instantOfferList'
import InstantOfferNew from './pages/instantOffer/instantOfferNew'
import InstantOfferEdit from './pages/instantOffer/instantOfferEdit'
import dayjs from 'dayjs'
import AppUpdatenoticeList from "./pages/appUpdatenotice/appUpdatenoticeList";

import VoucherList from './pages/voucherSetting/voucherList'
import VoucherNew from './pages/voucherSetting/voucherNew'
import VoucherEdit from './pages/voucherSetting/voucherEdit'

const localeData = require('dayjs/plugin/localeData');
require('dayjs/locale/zh-tw');

dayjs.locale('zh-tw');
dayjs.extend(localeData);

const JsonPlugin = (option, dayjsClass, dayjsFactory) => {
    // overriding existing API
    dayjsClass.prototype.toJSON = function () {
        return this.format()
    }
}
dayjs.extend(JsonPlugin)

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "home/:userID",
                element: <Home />,
                errorElement: <ErrorPage />,
            },
            {
                path: "administrator/list",
                element: <AdministratorList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "administrator/new",
                element: <AdministratorNew />,
                errorElement: <ErrorPage />,
            },
            {
                path: "administrator/edit/:aid",
                element: <AdministratorEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "roleGroup/list",
                element: <RoleGroupList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "roleGroup/new",
                element: <RoleGroupNew />,
                errorElement: <ErrorPage />,
            },
            {
                path: "roleGroup/edit/:rid",
                element: <RoleGroupEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "tag/list",
                element: <TagList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "tag/new",
                element: <TagNew />,
                errorElement: <ErrorPage />,
            },
            {
                path: "appBanner/list",
                element: <AppBannerList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "appBanner/new",
                element: <AppBannerNew />,
                errorElement: <ErrorPage />,
            },
            {
                path: "appBanner/edit/:bannerID",
                element: <AppBannerEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "appNews/list",
                element: <AppNewsList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "appNews/version/:newsID",
                element: <AppNewsVersion />,
                errorElement: <ErrorPage />,
            },
            {
                path: "appNews/new",
                element: <AppNewsNew />, 
                errorElement: <ErrorPage />,
            },
            {
                path: "appNews/edit/:newsID",
                element: <AppNewsEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "appMessage/list",
                element: <AppMessageList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "appMessage/version/:messageID",
                element: <AppMessageVersion />,
                errorElement: <ErrorPage />,
            },
            {
                path: "appMessage/deliveryList/:messageID",
                element: <AppMessageDeliveryList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "appMessage/new",
                element: <AppMessageNew />,
                errorElement: <ErrorPage />,
            },
            {
                path: "appMessage/edit/:messageID",
                element: <AppMessageEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "store/list",
                element: <StoreList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "store/version/:storeID",
                element: <StoreVersion />,
                errorElement: <ErrorPage />,
            },
            {
                path: "store/new",
                element: <StoreNew />,
                errorElement: <ErrorPage />,
            },
            {
                path: "store/edit/:storeID",
                element: <StoreEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "storeType/list",
                element: <StoreTypeList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "storeType/new",
                element: <StoreTypeNew />,
                errorElement: <ErrorPage />,
            },
            {
                path: "storeType/edit/:storeTypeID",
                element: <StoreTypeEdit />,
                errorElement: <ErrorPage />,
            }, 
            {
                path: "activity/list",
                element: <ActivityList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "activity/new",
                element: <ActivityNew />,
                errorElement: <ErrorPage />,
            },
            {
                path: "webactivity/list",
                element: <WebActivityList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "webactivity/new",
                element: <WebActivityNew />,
                errorElement: <ErrorPage />,
            }, 
            {
                path: "webactivity/edit/:webactivityID",
                element: <WebActivityNew />,
                errorElement: <ErrorPage />,
            },
            {
                path: "webactivity/takeamount",
                element: <WebActivityTakeAmount />,
                errorElement: <ErrorPage />,
            },
            {
                path: "activity/edit/:activityID",
                element: <ActivityEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "activityOffsite/list",
                element: <ActivityOffsiteList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "activityOffsite/new",
                element: <ActivityOffsiteNew />,
                errorElement: <ErrorPage />,
            },
            {
                path: "activityOffsite/edit/:activityID",
                element: <ActivityOffsiteEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "dynamiclink/list",
                element: <DynamicLinkList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "dynamiclink/new",
                element: <DynamicLinkNew />,
                errorElement: <ErrorPage />,
            },
            {
                path: "dynamiclink/edit/:dynamicLinkID",
                element: <DynamicLinkEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "dynamiclink/version/:dynamicLinkID",
                element: <DynamicLinkVersion />,
                errorElement: <ErrorPage />,
            },
            {
                path: "offertips/list",
                element: <OfferTipsList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "offertips/new",
                element: <OfferTipsNew />,
                errorElement: <ErrorPage />,
            },
            {
                path: "offertips/edit/:offerTipsID",
                element: <OfferTipsEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "offertips/version/:offerTipsID",
                element: <OfferTipsVersion />,
                errorElement: <ErrorPage />,
            },
            {
                path: "redeemcoupon/list",
                element: <RedeemCouponList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "redeemcoupon/new",
                element: <RedeemCouponNew />,
                errorElement: <ErrorPage />,
            },
            {
                path: "redeemcoupon/edit/:redeemCouponID",
                element: <RedeemCouponEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "redeemcoupon/version/:redeemCouponID",
                element: <RedeemCouponVersion />,
                errorElement: <ErrorPage />,
            },
            {
                path: "appPayment/list",
                element: <Payment />,
                errorElement: <ErrorPage />,
            },
            {
                path: "contactus/list",
                element: <AppContactusList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "contactus/edit/:contactusID",
                element: <AppContactusEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "contactus/version/:contactusID",
                element: <AppContactusVersion />,
                errorElement: <ErrorPage />,
            },
            {
                path: "greeting/list",
                element: <AppGreetingList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "greeting/edit/",
                element: <AppGreetingEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "greeting/edit/:greetingID",
                element: <AppGreetingEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "appsetting/list",
                element: <AppSettingList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "appsetting/edit/:settingKey",
                element: <AppSettingEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "appupdatenotice/list",
                element: <AppUpatenoticeList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "appupdatenotice/edit/:updateNoticeID",
                element: <AppUpdatenoticeEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "appupdatenotice/version/:updateNoticeID",
                element: <AppUpdatenoticeVersion />,
                errorElement: <ErrorPage />,
            },
            {
                path: "member/list",
                element: <MemberList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "member/edit/:memberID",
                element: <MemberEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "coupontransferrecord/list",
                element: <CouponTransferRecordList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "coupontransferrecord/view/:transferRecordID",
                element: <CouponTransferRecordView />,
                errorElement: <ErrorPage />,
            },
            {
                path: "statistical/list",
                element: <StatisticalList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "statistical/view/:value",
                element: <StatisticalView />,
                errorElement: <ErrorPage />,
            },
            {
                path: "activity/version/:activityID",
                element: <ActivityVersion />,
                errorElement: <ErrorPage />, 
            },
            {
                path: "appBlock/list",
                element: <AppBlockList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "seckill/list",
                element: <SeckillList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "seckill/new",
                element: <SeckillNew />,
                errorElement: <ErrorPage />,
            },
            {
                path: "seckill/edit/:seckillID",
                element: <SeckillEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "currentMoment/list",
                element: <MomentSettingList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "currentMoment/new",
                element: <MomentSettingNew />,
                errorElement: <ErrorPage />,
            },
            {
                path: "currentMoment/edit/:momentID",
                element: <MomentSettingEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "momentManager/list",
                element: <MomentManagerList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "momentManager/new",
                element: <MomentManagerNew />,
                errorElement: <ErrorPage />,
            },
            {
                path: "momentManager/edit/:momentManagerID",
                element: <MomentManagerEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "instantOffer/list",
                element: <InstantOfferList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "instantOffer/new",
                element: <InstantOfferNew />,
                errorElement: <ErrorPage />,
            },
            {
                path: "instantOffer/edit/:instantOfferID",
                element: <InstantOfferEdit />,
                errorElement: <ErrorPage />,
            }, 
            {
                path: "vouchersetting/list",
                element: <VoucherList />,
                errorElement: <ErrorPage />,
            },
            {
                path: "vouchersetting/new",
                element: <VoucherNew />,
                errorElement: <ErrorPage />,
            },
            {
                path: "vouchersetting/edit/:voucherID",
                element: <VoucherEdit />,
                errorElement: <ErrorPage />,
            },
            {
                path: "contacts/:contactId",
                element: <Home />,
            },
            
        ],
    },
    {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorPage />,
    }
    
    //{
    //    path: "contacts/:contactId",
    //    element: <Contact />,
    //},
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ConfigProvider locale={zhTW}>
        <RouterProvider router={router} />
    </ConfigProvider>
    
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals();
