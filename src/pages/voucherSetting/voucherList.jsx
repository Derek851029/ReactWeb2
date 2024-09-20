import React, { useState, useEffect, useRef } from 'react';
import {
    PlusCircleOutlined, MenuOutlined, OrderedListOutlined, CheckCircleOutlined,
    EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Space, Typography, Table, Breadcrumb, message, DatePicker, Col, Divider, Menu } from 'antd';
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

const VoucherList = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [firstBrand, setFirstBrand] = useState("");

    const [current, setCurrent] = useState('list');

    const [voucherList, setVoucherList] = useState([]);
    const [sortVoucherList, setSortVoucherList] = useState([]);
    const [sortDate, setSortDate] = useState(dayjs().unix());
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
            dataIndex: 'app_voucher_id',
        },
        {
            title: '類別代碼',
            dataIndex: 'category_id',
        },
        {
            title: '類別名稱',
            dataIndex: 'category_name',
            ...getColumnSearchProps('category_name'),
        },
        {
            title: '隨饗券名稱',
            dataIndex: 'group_name',
            ...getColumnSearchProps('group_name'),
        },
        {
            title: '標題',
            dataIndex: 'title',
        },
        {
            title: '副標題',
            dataIndex: 'sub_title',
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
            title: '操作',
            dataIndex: 'app_voucher_id',
            render: (value, array, index) => (
                <>
                    < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate('/vouchersetting/edit/' + value, { state: { type: 'edit' } }); }}> 編輯</Button >
                    < Button type="primary" shape="round" icon={<DeleteOutlined />} size='small' onClick={() => { deleteVoucher(value, 1); }}> 刪除</Button >
                </>
            )


        },
    ];

    const sortColumns = [
        {
            title: '類別代碼',
            dataIndex: 'category_id',
        },
        {
            title: '隨饗券名稱',
            dataIndex: 'group_name',
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
    ];

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

    useEffect(() => {
        getVoucher();
        getSortVoucher(dayjs().unix());
    }, []);

    const getVoucher = () => {
        setLoading(true);
        fetch('../api/vouchersetting?type=list', {
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

                setVoucherList(data.map((value, index) => {
                    value.key = index;
                    return value;
                }));
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    };

    const getSortVoucher = (day) => {
        setLoading(true);

        fetch('../api/vouchersetting' + '?type=sort&day=' + day + '', {
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
                setSortVoucherList(
                    data.map((value, index) => {
                        if (id.includes(value.app_voucher_id)) {
                            return null;
                        }
                        else {
                            id.push(value.app_voucher_id);
                            value.key = index;
                            return value;
                        }
                    }).filter((obj) => obj !== null)
                );
                /*   setFirstBrand(data[0].category_id);*/
                setLoading(false);

            });
    };

    const deleteVoucher = (id, status) => {
        fetch('../api/vouchersetting', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify({ Status: status }), voucherID: id, })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log("data:", data);
                messageBox("success", "刪除成功!");

                getVoucher();
            })
            .catch(error => {
                messageBox("error", "刪除失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const saveSort = () => {
        if (sortDate === null || sortDate === '') {
            messageBox('error', '請選擇日期!');
            return;
        }
        const sortData = {
            SortData: JSON.stringify(sortVoucherList)
        };
        console.log(sortVoucherList);
        fetch('../api/vouchersetting', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify(sortData), type: 'sort', SortDate: sortDate })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error - Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                messageBox("success", "排序儲存成功!");
                getSortVoucher(sortDate ?? dayjs().unix());
                console.log(data);
            })
            .catch(error => {
                messageBox("error", "排序儲存失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const sortDateOnChange = (date, dateString) => {
        if (date) {
            getSortVoucher(dayjs(dateString).add(1, 'day').unix());
        }
        else {
            getSortVoucher(dayjs().unix());
        }
        setSortDate(dayjs(dateString).add(1, 'day').unix());
    };

    const menuOnClick = (e) => {
        console.log('click ', e);
        if (e.key === 'sort') {
            getSortVoucher(dayjs().unix());
        }
        setCurrent(e.key);
    };

    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
            setSortVoucherList((prev) => {
                const activeIndex = prev.findIndex((i) => i.key === active.id);
                const overIndex = prev.findIndex((i) => i.key === over?.id);
                return arrayMove(prev, activeIndex, overIndex);
            });
        }
    };

    const messageBox = (type, text) => {
        messageApi.open({
            type: type,
            content: text,
        });
    };

    const sortTable = (
        <>
            <Title
                level={3}>
                排序日期: <DatePicker defaultValue={dayjs()} size='large' placement='topLeft' onChange={sortDateOnChange} />
            </Title>



            <DndContext onDragEnd={onDragEnd}>
                <SortableContext
                    // rowKey array
                    items={sortVoucherList.map((i) => i.key)}
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
                        dataSource={sortVoucherList}
                        pagination={{ defaultPageSize: 100 }}
                    />
                </SortableContext>
            </DndContext>

            <Col span={8} offset={10}>
                <Button type="primary" shape="round" icon={<CheckCircleOutlined />} size='large' onClick={() => { saveSort(); }}>儲存</Button>
            </Col>


        </>
    );

    return (
        <>
            {contextHolder}
            <Title level={2}>首頁隨饗券列表</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>首頁隨饗券列表</Breadcrumb.Item>
            </Breadcrumb>

            <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={() => { navigate('/vouchersetting/new'); }}>
                新增首頁隨饗券
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
                    <Table columns={columns} dataSource={voucherList} loading={loading} onChange={onChange}></Table>
                )
                : sortTable
            }
        </>
    );
};

export default VoucherList;