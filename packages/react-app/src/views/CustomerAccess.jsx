import React, { useState } from "react";
import { Row, Col, Button, Divider } from "antd";



export default function CustomerAccess(){
    return (
    <div>
        <Divider orientation="left" ></Divider>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={6}>
                <div>Ambulance Ticket</div>
                <Button>Pay 0.01 ETH</Button>
            </Col>
            <Col className="gutter-row" span={6}>
                <div>NestCoin Cap</div>
                <Button>Pay 0.01 ETH</Button>
            </Col>
             <Col className="gutter-row" span={6}>
                <div>NestCoin Hoodie</div>
                <Button>Pay 0.01 ETH</Button>
            </Col>
            <Col className="gutter-row" span={6}>
                <div>SpiderMan 3 Tickets</div>
                <Button>Pay 0.01 ETH</Button>
            </Col>
            
        </Row>
    </div>
    );
}