import React, { useState, useEffect, useRef } from 'react';
import {
    CaretUpOutlined, CaretDownOutlined, PlusCircleOutlined, EyeOutlined, SearchOutlined,
    EditOutlined, DeleteOutlined, MenuOutlined, OrderedListOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Space, Typography, Table, Breadcrumb, message, Divider, Menu, Col, Row, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { DndContext } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
const { Title, Text } = Typography;

const InstantOfferList = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [firstBrand, setFirstBrand] = useState("");

    const [instantOfferList, setinstantOfferList] = useState([]);

    const [sortDate, setSortDate] = useState(dayjs().unix());
    const [sortInstantOfferList, setSortInstantOfferList] = useState([]);

    const [loading, setLoading] = useState(false);

    const [current, setCurrent] = useState('list');

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
                    placeholder="查詢檔期名稱"
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
            title: 'ID',
            dataIndex: 'app_instant_offer_id',
        },
        {
            title: '熱銷推薦名稱',
            dataIndex: 'app_instant_offer_name',
            ...getColumnSearchProps('app_instant_offer_name'),
        },
        {
            title: '活動時間區間(起迄日期)',
            dataIndex: 'start_time',
            sorter: (a, b) => a.start_time - b.start_time,
            render: (value, array, index) => {
                const start_time = dayjs(array.start_time * 1000).format('YYYY-MM-DD HH:mm:ss');
                const end_time = dayjs(array.end_time * 1000).format('YYYY-MM-DD HH:mm:ss');

                const str = start_time + " ~ " + end_time;

                return str;

            }
        },
        {
            title: '活動狀態',
            dataIndex: 'app_instant_offer_id',
            render: (value, array, index) => {
                const start_time = new Date(array.start_time * 1000);
                const end_time = new Date(array.end_time * 1000);

                if (new Date() - end_time > 0) {
                    return "活動已結束";
                }
                else {
                    if (array.status == 0) {
                        return (
                            <>
                                活動已下架 <br></br>
                                < Button type="default" shape="round" icon={< CaretUpOutlined />} size='small' onClick={() => { changeStatus(value, 1); }}> 上架活動</Button >
                            </>
                        );
                    }
                    else {

                        if (new Date() - start_time > 0 && new Date() - end_time < 0) {
                            return (
                                <>
                                    活動進行中<br></br>
                                    < Button danger type="default" shape="round" icon={< CaretDownOutlined />} size='small' onClick={() => { changeStatus(value, 0); }}> 下架活動</Button >
                                </>

                            );
                        }
                        else {
                            if (new Date() - start_time < 0) {
                                return (
                                    <>
                                        未開始<br></br>
                                        < Button danger type="default" shape="round" icon={< CaretDownOutlined />} size='small' onClick={() => { changeStatus(value, 0); }}> 下架活動</Button >
                                    </>
                                );
                            }

                        }

                    }
                }

            }
        },
        {
            title: '操作',
            dataIndex: 'app_instant_offer_id',
            render: (value, array, index) => (
                <>
                    < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate('/instantOffer/edit/' + value, { state: { type: 'edit' } }); }}> 編輯</Button >
                    < Button type="primary" shape="round" icon={<DeleteOutlined />} size='small' onClick={() => { deleteInstantOffer(value, 1); }}> 刪除</Button >
                </>
            )
        },
    ];

    const sortColumns = [
        {
            title: '品牌',
            dataIndex: 'brand',
        },
        {
            title: '熱銷推薦名稱',
            dataIndex: 'app_instant_offer_name',
        },
        {
            title: '活動時間區間(起迄日期)',
            dataIndex: 'start_time',
            render: (value, array, index) => {
                const start_time =
                    new Date(array.start_time * 1000).toISOString().split('T')[0] + " " +
                    new Date(array.start_time * 1000).toTimeString().split(' ')[0];

                const end_time =
                    new Date(array.end_time * 1000).toISOString().split('T')[0] + " " +
                    new Date(array.end_time * 1000).toTimeString().split(' ')[0];

                const str = start_time + " ~ " + end_time;

                return str;

            }
        },
        {
            title: '活動狀態',
            dataIndex: 'app_instant_offer_id',
            render: (value, array, index) => {
                const start_time = new Date(array.start_time * 1000);
                const end_time = new Date(array.end_time * 1000);

                if (new Date() - start_time > 0 && new Date() - end_time < 0) {
                    return (
                        <>活動進行中</>
                    );
                }
                else {
                    if (new Date() - start_time < 0) {
                        return (
                            <>未開始</>
                        );
                    }

                }

            }
        },
    ];

    const Row = (props) => {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
            id: props['data-row-key'],
        });
        const style = {
            ...props.style,
            transform: CSS.Transform.toString(
                transform && {
                    ...transform,
                    scaleY: 1,
                },
            ),
            transition,
            cursor: 'move',
            ...(isDragging
                ? {
                    position: 'relative',
                    zIndex: 9999,
                }
                : {}),
        };
        return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
    };

    const items = [
        {
            label: '列表',
            key: 'list',
            icon: <MenuOutlined />,
        },
        {
            label: '排序',
            key: 'sort',
            icon: <OrderedListOutlined />,
        }
    ];

    useEffect(() => {
        getInstantOffersData();
        getSortInstantOffer(dayjs().unix());

        const dayOfMonth = dayjs().date();

        if (dayOfMonth % 2 === 0) {
            setFirstBrand("Kfc");
        } else {
            setFirstBrand("Pizzahut");
        }
    }, []);

    const getInstantOffersData = () => {
        setLoading(true);

        fetch('../api/instantoffer?type=list&id=0', {
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
                setinstantOfferList(data);
                setLoading(false);

            });
    };

    const getSortInstantOffer = (day) => {
        setLoading(true);

        fetch('../api/instantoffer' + '?type=sort&id=' + day + '', {
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
                const id = [];
                setSortInstantOfferList(
                    data.map((value, index) => {
                        if (id.includes(value.app_instant_offer_id)) {
                            return null;
                        }
                        else {
                            id.push(value.app_instant_offer_id);
                            value.key = index;
                            return value;
                        }
                    }).filter((obj) => obj !== null)
                );
                /* setFirstBrand(data[0].brand)*/
                setLoading(false);

            });
    };

    const changeStatus = (id, status) => {
        fetch('../api/instantoffer', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify({ Status: status }), Type: 'status', app_instant_offer_id: id, })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                console.log("data:", data);
                if (status == 0) {
                    messageBox("success", "活動已下架!");
                }
                else {
                    messageBox("success", "活動已上架!");
                }
                getInstantOffersData();
            })
            .catch(error => {
                messageBox("error", "活動編輯失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const deleteInstantOffer = (id, status) => {

        fetch('../api/instantoffer', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify({ Status: status }), type: 'delete', app_instant_offer_id: id })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                messageBox("success", "刪除熱銷推薦成功!");
                getInstantOffersData();
            })
            .catch(error => {
                messageBox("error", "刪除熱銷推薦失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const saveSort = () => {
        if (sortDate === null || sortDate === '') {
            messageBox('error', '請選擇日期!');
            return;
        }
        const sortData = {
            SortData: JSON.stringify(sortInstantOfferList)
        };
        console.log(sortDate);
        console.log(sortInstantOfferList);
        fetch('../api/instantoffer', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(sortData), type: 'sort', sortDate: sortDate })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                messageBox("success", "排序儲存成功!");
                getSortInstantOffer(sortDate ?? dayjs().unix());
                console.log(data);
            })
            .catch(error => {
                messageBox("error", "排序儲存失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const menuOnClick = (e) => {
        console.log('click ', e);
        if (e.key === 'sort') {
            getSortInstantOffer(dayjs().unix());
        }
        setCurrent(e.key);
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const sortDateOnChange = (date, dateString) => {
        if (date) {
            getSortInstantOffer(dayjs(dateString).add(1, 'day').unix());
            const dayOfMonth = dayjs(dateString).date();

            if (dayOfMonth % 2 === 0) {
                setFirstBrand("Kfc");
            } else {
                setFirstBrand("Pizzahut");
            }
        }
        else {
            getSortInstantOffer(dayjs().unix());
        }
        setSortDate(dayjs(dateString).add(1, 'day').unix());
    };

    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
            setSortInstantOfferList((prev) => {
                const activeIndex = prev.findIndex((i) => i.key === active.id);
                const overIndex = prev.findIndex((i) => i.key === over?.id);
                return arrayMove(prev, activeIndex, overIndex);
            });
        }
    };

    const sortTable = (
        <>
            <Title
                level={3}>
                排序日期: <DatePicker defaultValue={dayjs()} size='large' placement='topLeft' onChange={sortDateOnChange} />
            </Title>

            <Text mark>當前開頭品牌:{firstBrand}</Text>

            <DndContext onDragEnd={onDragEnd}>
                <SortableContext
                    // rowKey array
                    items={sortInstantOfferList.map((i) => i.key)}
                    strategy={verticalListSortingStrategy}
                >
                    <Table
                        components={{
                            body: {
                                row: Row,
                            },
                        }}
                        rowKey="key"
                        loading={loading}
                        columns={sortColumns}
                        dataSource={sortInstantOfferList}
                        pagination={{ defaultPageSize: 100 }}
                    />
                </SortableContext>
            </DndContext>

            <Col span={8} offset={10}>
                <Button type="primary" shape="round" icon={<CheckCircleOutlined />} size='large' onClick={() => { saveSort(); }}>儲存</Button>
            </Col>


        </>
    );

    const messageBox = (type, text) => {
        messageApi.open({
            type: type,
            content: text,
        });
    };

    return (
        <>
            {contextHolder}
            <Title level={2}>熱銷推薦列表</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>熱銷推薦</Breadcrumb.Item>
            </Breadcrumb>

            <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={() => { navigate('/instantOffer/new'); }}>
                新增熱銷推薦
            </Button>

            <Divider />
            <Menu
                onClick={menuOnClick}
                selectedKeys={[current]}
                mode="horizontal"
                items={items}
                style={{ fontSize: 20 }}
            >
            </Menu>
            <Divider />

            {current == 'list' ?
                (
                    <Table columns={columns} dataSource={instantOfferList} loading={loading} onChange={onChange}></Table>
                )
                : sortTable
            }
        </>
    );
};

export default InstantOfferList;