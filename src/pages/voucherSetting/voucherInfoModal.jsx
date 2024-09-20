import React, { useEffect, useState } from 'react';
import { Button, Modal, Descriptions, Typography } from 'antd';

const VoucherInfoModal = (props) => {
    const [data, setData] = useState({})

    const handleOk = () => {
        props.setVoucherOpen(false);
    };
    const handleCancel = () => {
        props.setVoucherOpen(false);
    };

    useEffect(() => {
        console.log(props.data)
        setData(props.data)
    }, [props.data])

  return (
      <>
          <Modal title="隨饗券基本資料" open={props.voucherOpen} onOk={handleOk} onCancel={handleCancel} width={1500}>
              <Descriptions title="基本資料" bordered>
                  <Descriptions.Item label="類別代碼">{data.categoryID}</Descriptions.Item>
                  <Descriptions.Item label="類別名稱">{data.categoryName}</Descriptions.Item>
                  <Descriptions.Item label="隨饗券ID">{data.groupID }</Descriptions.Item>
                  <Descriptions.Item label="隨饗券名稱">{data.groupName }</Descriptions.Item>
                  <Descriptions.Item label="照片" span={2 }><Typography.Link href={data.groupImage }>查看活動照片</Typography.Link></Descriptions.Item>
                  <Descriptions.Item label="內容">{data.groupDesc }</Descriptions.Item>
              </Descriptions>
          </Modal>
      </>
  );
}

export default VoucherInfoModal;