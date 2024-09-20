import React, { useState, useEffect } from 'react';
import {
    EditOutlined, HistoryOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Table, Breadcrumb, message } from 'antd';

const { Title, Text } = Typography;

const AppSettingList = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [appSettingList, setAppSettingList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [listItem, setListItem] = useState(["setting_url", "membership_terms", "win_invoices_terms","e_red_voucher_terms", "e_invoices_terms", "winning_receipt", "membership_del_terms"]);

    const columns = [
        {
            title: '項目',
            dataIndex: 'setting_title',
        },
        //{
        //    title: '歷史版本',
        //    dataIndex: 'setting_key',
        //    render: (value) => {
        //        return (
        //            < Button type="primary" shape="round" icon={<HistoryOutlined />} size='small' onClick={() => { navigate(`/appsetting/version/${value}`); }}> 檢視版本</Button >
        //        );
        //    }
        //},
        {
            title: '操作',
            dataIndex: 'setting_key',
            render: (value, array, index) => {
                return (
                    < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate(`/appsetting/edit/${value}`); }}> 編輯</Button >
                );

            }
        },
    ];

    useEffect(() => {
        getAppSetting();
    }, []);

    const getAppSetting = () => {
        setLoading(true);

        fetch('../api/appsetting' + '?type=list&id=0', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log(data);

                const appSettingData = [];

                //資料庫沒有中獎發票網址, 額外處理
                appSettingData.push(
                    {
                        key: 200,
                        setting_key: "setting_url",
                        setting_title: "相關網址設定",
                    },
                );
                //Strollet異常處理
                appSettingData.push(
                    {
                        key: 200,
                        setting_key: "strolletStatus",
                        setting_title: "Strollet異常管理",
                    },
                );

                data.forEach((value, index) => {
                    var jsonObject = {
                        key: index,
                        setting_key: value.setting_key,
                        setting_title: value.setting_title,
                    };
                    if (listItem.indexOf(value.setting_key) > 0) {
                        appSettingData.push(jsonObject);
                    }

                });


                setAppSettingList(appSettingData);
                setLoading(false);

            });
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <>
            {contextHolder}
            <Title level={2}>APP設定</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>APP設定</Breadcrumb.Item>
            </Breadcrumb>


            <Table columns={columns} dataSource={appSettingList} loading={loading} onChange={onChange}></Table>
        </>
    );
};

export default AppSettingList;