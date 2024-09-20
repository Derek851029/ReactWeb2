import React, { useState, useEffect, useRef } from 'react';
import {
    CaretUpOutlined, CaretDownOutlined, PlusCircleOutlined, EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined,
    MenuOutlined, OrderedListOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Space, Typography, Table, Breadcrumb, message, Divider, Menu, DatePicker, Col } from 'antd';
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

const MomentManagerList = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [firstBrand, setFirstBrand] = useState("");

    const [current, setCurrent] = useState('list');

    const [momentActivtyList, setMomentActivtyList] = useState([]);
    const [sortMomentList, setSortMomentList] = useState([]);
    const [sortDate, setSortDate] = useState(dayjs().unix())
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
            dataIndex: 'app_moment_activity_id',
        },
        {
            title: '時段名稱',
            dataIndex: 'name',
            ...getColumnSearchProps('moment_name'),
        },
        {
            title: '當下時刻活動名稱',
            dataIndex: 'act_title',
            ...getColumnSearchProps('act_title'),
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
            dataIndex: 'app_moment_activity_id',
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
            dataIndex: 'app_moment_activity_id',
            render: (value, array, index) => {
                return (
                    <>
                        < Button type="primary" shape="round" icon={<EditOutlined />} size='small' onClick={() => { navigate('/momentManager/edit/' + value, { state: { type: 'edit' } }); }}> 編輯</Button >
                        < Button type="primary" shape="round" icon={<DeleteOutlined />} size='small' onClick={() => { deleteMoment(value, 1); }}> 刪除</Button >
                    </>
                );

            }
        },
    ];

    const sortColumns = [
        {
            title: '品牌',
            dataIndex: 'brand',
        },
        {
            title: '名稱',
            dataIndex: 'act_title',
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
        getMomentData();
        getSortMoment(dayjs().unix())

        const dayOfMonth = dayjs().date();

        if (dayOfMonth % 2 === 0) {
            setFirstBrand("Pizzahut");
        } else {
            setFirstBrand("Kfc");
        }
    }, []);

    const getMomentData = () => {
        setLoading(true);

        fetch('../api/momentmanager?type=list&id=0', {
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
                setMomentActivtyList(data);
                setLoading(false);

            });
    };

    const getSortMoment = (day) => {
        setLoading(true);

        fetch('../api/momentmanager' + '?type=sort&day=' + day + '', {
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
                const id = []
                setSortMomentList(
                    data.map((value, index) => {
                        if (id.includes(value.app_moment_activity_id)) {
                            return null;
                        }
                        else {
                            id.push(value.app_moment_activity_id);
                            value.key = index;
                            return value;
                        }
                    }).filter((obj) => obj !== null)
                );
               /* setFirstBrand(data[0].brand);*/
                setLoading(false);

            });
    }

    const changeStatus = (id, status) => {
        fetch('../api/momentmanager', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify({ Status: status }), Type: 'status', app_moment_activity_id: id, })
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
                getMomentData();
            })
            .catch(error => {
                messageBox("error", "活動編輯失敗!");
                console.error('Unable to add item.', error);
            });
    };

    const deleteMoment = (id, status) => {

        fetch('../api/momentmanager', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataInfo: JSON.stringify({ Status: status }), type: 'delete', app_moment_activity_id: id })
        })
            .then(res => { if (!res.ok) { throw new Error(`API error - Status: ${res.status}`); } return res.json(); })
            .then(data => {
                messageBox("success", "刪除當下時刻活動成功!");
                getMomentData();
            })
            .catch(error => {
                messageBox("error", "刪除當下時刻活動失敗!");
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

    const saveSort = () => {
        if (sortDate === null || sortDate === '') {
            messageBox('error', '請選擇日期!');
            return;
        }
        const sortData = {
            SortData: JSON.stringify(sortMomentList)
        };
        console.log(sortMomentList);
        fetch('../api/momentmanager', {
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
                getSortMoment(sortDate ?? dayjs().unix());
                console.log(data);
            })
            .catch(error => {
                messageBox("error", "排序儲存失敗!");
                console.error('Unable to add item.', error);
            });
    }

    const menuOnClick = (e) => {
        console.log('click ', e);
        if (e.key === 'sort') {
            getSortMoment(dayjs().unix());
        }
        setCurrent(e.key);
    };


    const sortDateOnChange = (date, dateString) => {
        if (date) {
            getSortMoment(dayjs(dateString).add(1, 'day').unix());
            const dayOfMonth = dayjs(dateString).date();

            if (dayOfMonth % 2 === 0) {
                setFirstBrand("Pizzahut");
            } else {
                setFirstBrand("Kfc");
            }
        }
        else {
            getSortMoment(dayjs().unix());
        }
        setSortDate(dayjs(dateString).add(1, 'day').unix());
    };

    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
            setSortMomentList((prev) => {
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
                    items={sortMomentList.map((i) => i.key)}
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
                        dataSource={sortMomentList}
                        pagination={{ defaultPageSize: 100 } }
                    />
                </SortableContext>
            </DndContext>

            <Col span={8} offset={10}>
                <Button type="primary" shape="round" icon={<CheckCircleOutlined />} size='large' onClick={() => { saveSort(); }}>儲存</Button>
            </Col>


        </>
    )

    return (
        <>
            {contextHolder}
            <Title level={2}>當下時刻活動列表</Title>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
            >
                <Breadcrumb.Item>當下時刻活動</Breadcrumb.Item>
            </Breadcrumb>

            <Button type="primary" shape="round" icon={<PlusCircleOutlined />} size='large' onClick={() => { navigate('/momentManager/new'); }}>
                新增當下時刻活動
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
                    <Table columns={columns} dataSource={momentActivtyList} loading={loading} onChange={onChange}></Table>
                )
                : sortTable
            }
        </>
    );
};

export default MomentManagerList;