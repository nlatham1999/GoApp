import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.css';

import {Button, Card, Row, Col} from 'react-bootstrap'

const Order = ({orderData, setChangeWaiter, deleteSingleOrder, setChangeOrder}) => {

    return (
        <Card>
            <Row>
                <Col>Dish:{ orderData !== undefined && orderData.dish}</Col>
                <Col>Server:{ orderData !== undefined && orderData.server}</Col>
                <Col>Table:{ orderData !== undefined && orderData.table}</Col>
                <Col>Price: ${orderData !== undefined && orderData.price}</Col>
                <Col><Button onClick={() => deleteSingleOrder(orderData._id)}>delete order</Button></Col>
                <Col><Button onClick={() => changeWaiter()}>change waiter</Button></Col>
                <Col><Button onClick={() => changeOrder()}>change order</Button></Col>
            </Row>
        </Card>
    )

    function changeWaiter(){
        setChangeWaiter(
            {
                "change": true,
                "id": orderData._id
            }
        )
    }

    function changeOrder(){
        setChangeOrder(
            {
                "change": true,
                "id": orderData._id
            }
        )
    }

}

export default Order