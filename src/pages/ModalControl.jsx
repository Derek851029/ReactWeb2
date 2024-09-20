import React, { useState } from 'react';
import {
    Input,
    Modal,
} from 'antd';

const ModalShow = (props) => {
    console.log("props:", props.page)

    return (
        <Modal
            title={props.title}
            open={props.open}
            onOk={props.handleOk}
            confirmLoading={props.confirmLoading}
            onCancel={props.onCancel}
            width={1000}
        >
            {props.formTable}

        </Modal>
    )
    //if (props.page == 'seckill') {
    //    return (
    //        <Modal
    //            title={props.title}
    //            open={props.open}
    //            onOk={props.handleOk}
    //            confirmLoading={props.confirmLoading}
    //            onCancel={props.onCancel}
    //            width={1000}
    //        >
    //            {props.formTable}

    //        </Modal>
    //    )
    //}
    //else if () {

    //}
}

export default ModalShow