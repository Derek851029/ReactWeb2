import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import AppSettingUrl from './appSettingUrl';
import AppSettingStrolletStatus from './appStrolletStatus';
import AppSettingMemberShip from './appSettingMemberShip'
import AppSettingFAQ from './appSettingFAQ'
import AppSettingReceipt from './appSettingReceipt'
import AppSettingMemberDelete from './appSettingMemberDelete'
import AppSettingPhoneBarcode from './appSettingPhoneBarcode'

const AppSettingEdit = () => {
    const { settingKey } = useParams();

    const [showPage, setShowPage] = useState(null)

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        fetch('/api/appsetting?type=edit&id=' + settingKey, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                initPage(data);
            })
            .catch(error => console.error('Unable to add item.', error));
    };

    const initPage = (data) => {
        let componet;
        switch (settingKey) {
            case "setting_url":
                componet = <AppSettingUrl data={data} settingKey={settingKey }></AppSettingUrl>
                break;
            case "strolletStatus":
                componet = <AppSettingStrolletStatus data={data} settingKey={settingKey}></AppSettingStrolletStatus>
                break;
            case "membership_terms":
                componet = <AppSettingMemberShip data={data[0]} settingKey={settingKey}></AppSettingMemberShip>
                break;
            case "e_red_voucher_terms":
                componet = <AppSettingFAQ data={data[0]} settingKey={settingKey}></AppSettingFAQ>
                break;
            case "win_invoices_terms":
                componet = <AppSettingReceipt data={data[0]} settingKey={settingKey}> </AppSettingReceipt>
                break;
            case "membership_del_terms":
                componet = <AppSettingMemberDelete data={data[0]} settingKey={settingKey}></AppSettingMemberDelete>
                break;
            case "e_invoices_terms":
                componet = <AppSettingPhoneBarcode data={data[0]} settingKey={settingKey}></AppSettingPhoneBarcode>
                break;
        }

        setShowPage(componet)
    };

    return (
        <>
            {showPage }
        </>
    );
};

export default AppSettingEdit;