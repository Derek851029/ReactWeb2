import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button, Typography, Table, Breadcrumb, message, Menu } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;


const TakeAmountList = () => {
    const location = useLocation();
    const [messageApi, contextHolder] = message.useMessage();
    const [searchData, setSearchData] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: '品牌',
            dataIndex: 'brand',

        },
        {
            title: '優惠券ID',
            dataIndex: 'coupon_id',
        },
        {
            title: '獎品數量',
            dataIndex: 'prize_amount',
        },
        {
            title: '被抽取數量',
            dataIndex: 'prize_take_amount',
        },
    ];

    useEffect(() => {
        getAmount(location.state.activity,location.state.id);
    }, []);

    const getAmount = (activity, id) => {
        setLoading(true);

        fetch(`../api/webactivity?type=amount&activity=${activity}&id=${id}`, {
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
                setSearchData(
                    data.map((obj, index) => {
                        obj.key = index;
                        return obj;
                    })
                );
                setLoading(false);

            });
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <>
            {contextHolder}
            <Title level={2}>獎品抽取數列表</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item><Link to='/webactivity/list'>站外活動管理</Link></Breadcrumb.Item>
                <Breadcrumb.Item>獎品抽取數列表</Breadcrumb.Item>
            </Breadcrumb>

            <br></br>
            <Table columns={columns} dataSource={searchData} loading={loading} onChange={onChange}></Table>
        </>
    );
};

export default TakeAmountList;