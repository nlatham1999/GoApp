import React, {useState, useEffect} from 'react';

import axios from "axios";

import {Button, Form, Container, Modal } from 'react-bootstrap'

import Order from './single-order.component';

const Orders = () => {

    const [orders, setOrders] = useState([])
    const [refreshData, setRefreshData] = useState(false)

    const [changeOrder, setChangeOrder] = useState({"change": false, "id": 0})
    const [changeWaiter, setChangeWaiter] = useState({"change": false, "id": 0})
    const [newWaiterName, setNewWaiterName] = useState("")

    const [addNewOrder, setAddNewOrder] = useState(false)
    const [newOrder, setNewOrder] = useState({"dish": "", "server": "", "table": 0, "price": 0})

    //gets run at initial loadup
    useEffect(() => {
        getAllOrders();
    }, [])

    //refreshes the page
    if(refreshData){
        setRefreshData(false);
        getAllOrders();
    }

    return (
        <div>
            
            {/* add new order button */}
            <Container>
                <Button onClick={() => setAddNewOrder(true)}>Add new order</Button>
            </Container>

            {/* list all current orders */}
            <Container>
                {orders != null && orders.map((order, i) => (
                    <Order orderData={order} deleteSingleOrder={deleteSingleOrder} setChangeWaiter={setChangeWaiter} setChangeOrder={setChangeOrder}/>
                ))}
            </Container>
            
            {/* popup for adding a new order */}
            <Modal show={addNewOrder} onHide={() => setAddNewOrder(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Order</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group>
                        <Form.Label >dish</Form.Label>
                        <Form.Control onChange={(event) => {newOrder.dish = event.target.value}}/>
                        <Form.Label>waiter</Form.Label>
                        <Form.Control onChange={(event) => {newOrder.server = event.target.value}}/>
                        <Form.Label >table</Form.Label>
                        <Form.Control onChange={(event) => {newOrder.table = event.target.value}}/>
                        <Form.Label >price</Form.Label>
                        <Form.Control type="number" onChange={(event) => {newOrder.price = event.target.value}}/>
                    </Form.Group>
                    <Button onClick={() => addSingleOrder()}>Add</Button>
                    <Button onClick={() => setAddNewOrder(false)}>Cancel</Button>
                </Modal.Body>
            </Modal>
            
            {/* popup for changing a waiter */}
            <Modal show={changeWaiter.change} onHide={() => setChangeWaiter({"change": false, "id": 0})} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Change Waiter</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group>
                        <Form.Label >new waiter</Form.Label>
                        <Form.Control onChange={(event) => {setNewWaiterName(event.target.value)}}/>
                    </Form.Group>
                    <Button onClick={() => changeWaiterForOrder()}>Change</Button>
                    <Button onClick={() => setChangeWaiter({"change": false, "id": 0})}>Cancel</Button>
                </Modal.Body>
            </Modal>

            {/* popup for changing an order */}
            <Modal show={changeOrder.change} onHide={() => setChangeOrder({"change": false, "id": 0})} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Change Order</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group>
                        <Form.Label >dish</Form.Label>
                        <Form.Control onChange={(event) => {newOrder.dish = event.target.value}}/>
                        <Form.Label>waiter</Form.Label>
                        <Form.Control onChange={(event) => {newOrder.server = event.target.value}}/>
                        <Form.Label >table</Form.Label>
                        <Form.Control onChange={(event) => {newOrder.table = event.target.value}}/>
                        <Form.Label >price</Form.Label>
                        <Form.Control type="number" onChange={(event) => {newOrder.price = parseFloat(event.target.value)}}/>
                    </Form.Group>
                    <Button onClick={() => changeSingleOrder()}>Change</Button>
                    <Button onClick={() => setChangeOrder({"change": false, "id": 0})}>Cancel</Button>
                </Modal.Body>
            </Modal>
        </div>
        
    );

    //changes the waiter
    function changeWaiterForOrder(){
        changeWaiter.change = false
        var url = "http://localhost:5000/waiter/update/" + changeWaiter.id
        axios.put(url, {
            "server": newWaiterName
        }).then(response => {
            console.log(response.status)
            if(response.status == 200){
                setRefreshData(true)
            }
        })
        
    }

    //changes the order
    function changeSingleOrder(){
        changeOrder.change = false;
        var url = "http://localhost:5000/order/update/" + changeOrder.id
        axios.put(url, newOrder)
            .then(response => {
            if(response.status == 200){
                setRefreshData(true)
            }
        })
    }

    //creates a new order
    function addSingleOrder(){
        setAddNewOrder(false)
        var url = "http://localhost:5000/order/create"
        axios.post(url, {
            "server": newOrder.server,
            "dish": newOrder.dish,
            "table": newOrder.table,
            "price": parseFloat(newOrder.price)
        }).then(response => {
            if(response.status == 200){
                setRefreshData(true)
            }
        })
    }

    //gets all the orders
    function getAllOrders(){
        var url = "http://localhost:5000/orders"
        axios.get(url, {
            responseType: 'json'
        }).then(response => {
            if(response.status == 200){
                setOrders(response.data)
            }
        })
    }

    //deletes a single order
    function deleteSingleOrder(id){
        var url = "http://localhost:5000/order/delete/" + id
        axios.delete(url, {

        }).then(response => {
            if(response.status == 200){
                setRefreshData(true)
            }
        })
    }

}

export default Orders