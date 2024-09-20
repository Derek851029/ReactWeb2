import React, { useState, useEffect } from 'react';
import {
    EditOutlined, EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Table, Breadcrumb, message } from 'antd';

const { Title, Text } = Typography;

const StatisticalList = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [statisticalList, setStatisticalList] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: '項目',
            dataIndex: 'label',
        },

        {
            title: '操作',
            dataIndex: 'value',
            render: (value, array, index) => {
                return (
                    < Button type="primary" shape="round" icon={<EyeOutlined />} size='small' onClick={() => { navigate(`/statistical/view/${value}`); }}> 檢視</Button >
                );

            }
        },
    ];

    useEffect(() => {
        initList();
    }, []);

    const initList = () => {

        const statisticalData = [
            {
                key: 1,
                label: "會員相關統計",
                value: "memberList",
            },
            //{
            //    label: "KFC地圖功能分析",
            //    value: "storeMonthKFC",
            //},
            //{
            //    label: "Pizzahut地圖功能分析",
            //    value: "storeMonthPizzahut",
            //},
            //{
            //    label: "會員活動範圍分析",
            //    value: "scopeOfActivity",
            //},
            //{
            //    label: "前往訂餐統計",
            //    value: "indexOrderMonth",
            //},
            {
                key:6,
                label: "最新消息查看率統計",
                value: "newsReadMonth",
            },
            //{
            //    label: "自定訊息查看率統計",
            //    value: "messageReadMonth",
            //},
            {
                key: 8,
                label: "APP下載次數",
                value: "downloadYear",
            },
            {
                key: 9,
                label: "遊玩遊戲人數",
                value: "gameplayer",
            },
            //{
            //    label: "裝置活躍度",
            //    value: "memberLiveness",
            //},
            //{
            //    label: "DAU與MAU",
            //    value: "reportDau",
            //},
            //{
            //    label: "第三類推播數據",
            //    value: "notificationMonth",
            //},
            //{
            //    label: "動態連結數據",
            //    value: "dynamicReport",
            //},
        ]

        setStatisticalList(statisticalData)
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <>
            {contextHolder}
            <Title level={2}>統計報表</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>統計報表</Breadcrumb.Item>
            </Breadcrumb>


            <Table columns={columns} dataSource={statisticalList} loading={loading} onChange={onChange}></Table>
        </>
    );
};

export default StatisticalList;