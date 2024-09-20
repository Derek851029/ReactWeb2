import React, { useState, useEffect, useRef } from 'react';
import {
    PlusCircleOutlined,
    EditOutlined, DeleteOutlined, SearchOutlined, UnorderedListOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Table, Breadcrumb, message, Input, Space } from 'antd';

const { Title, Text } = Typography;

const StoreList = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [storeList, setStoreList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={dataIndex === "store_name" ? " 查詢門市名稱" : "查詢門市代號"}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        查詢
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        重置
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                    fontSize: 16
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const columns = [
        {
            title: '品牌',
            dataIndex: 'brand',
            filters: [
                {
                    text: 'Pizzahut',
                    value: 'Pizzahut'
                },
                {
                    text: 'Kfc',
                    value: 'Kfc'
                }
            ],
            onFilter: (value, record) => record.brand.includes(value)
        },
        {
            title: '門市代號',
            dataIndex: 'store_code',
            ...getColumnSearchProps('store_code'),
        },
        {
            title: '門市類別',
            dataIndex: 'store_type_title',
        },
        {
            title: '門市名稱',
            dataIndex: 'store_name',
            ...getColumnSearchProps('store_name'),
        },
        {
            title: '動態連結',
            dataIndex: 'dynamic_link',
        },
        {
            title: '狀態',
            dataIndex: 'status',
            render: (value) => {
                let str;
                value === 1 ? str = '發佈' : str = '不發佈';
                return str;
            }
        },
        {
            title: '版本號',
            dataIndex: 'version',
        },
        //{
        //    title: '歷史版本',
        //    dataIndex: 'app_store_id',
        //    render: (value) => {
        //        return (
        //            < Button type="primary" shape="round" icon={<HistoryOutlined />} size='small' onClick={() => { navigate('/store/edit/' + value) }}> 檢視版本</Button >
        //        )
        //    }
        //},
        {
            title: '操作',
            dataIndex: 'app_store_id',
            render: (value, array, index) => {
                return (
                    <>
                        < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate('/store/edit/' + value, { state: { type: 'edit' } }); }}> 編輯</Button >
                        < Button type="primary" shape="round" icon={<DeleteOutlined />} size='small' onClick={() => { deletStore(value, 1); }}> 刪除</Button >
                    </>
                );

            }
        },
    ];

    useEffect(() => {
        getStore();
    }, []);

    const getStore = () => {
        setLoading(true);

        fetch('../api/store' + '?type=list&id=0', {
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
                var storeData = [];
                console.log(data);
                data.forEach((value, index, arr) => {
                    var jsonObject = {
                        key: index,
                        brand: value.brand,
                        app_store_id: value.app_store_id,
                        store_code: value.store_code,
                        store_type_title: value.store_type_title,
                        store_name: value.store_name,
                        dynamic_link: value.dynamic_link,
                        status: value.status,
                        version: value.version,
                    };

                    storeData.push(jsonObject);
                });
                setStoreList(storeData);
                setLoading(false);

            });
    };

    const deletStore = (id, status) => {
        fetch('../api/store', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify({ Status: status }), Type: 'delete', StoreID: id, })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                console.log("data:", data);
                messageBox("success", "刪除成功!");

                getStore();
            })
            .catch(error => {
                messageBox("error", "刪除失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const messageBox = (type, text) => {
        messageApi.open({
            type: type,
            content: text,
        });
    };

    return (
        <>
            {contextHolder}
            <Title level={2}>門市列表</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>門市列表</Breadcrumb.Item>
            </Breadcrumb>

            <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={() => { navigate('/store/new'); }}>
                新增門市
            </Button>


            <Table columns={columns} dataSource={storeList} loading={loading} onChange={onChange}></Table>
        </>
    );
};

export default StoreList;