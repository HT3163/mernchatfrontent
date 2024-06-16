import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";

function Home() {
    return (
        <Row>
            <Col md={6} className="d-flex flex-direction-column align-items-center justify-content-center">
                <div style={{ padding: '1rem' }}>
                    <h1>Share the world with your friends</h1>
                    <p>Chat App lets you connect with the world</p>
                    {/* <stripe-buy-button
                        buy-button-id="buy_btn_1NJvygKwigfufFxYCNZE0Z5V"
                        publishable-key="pk_test_51LTpuNKwigfufFxYI6qzFYobARBNHYu3o4Ca3NUCvGb3lqIIGopBsLmMq8Vezut54pjFRtMpPds4BJxhjuNbjlur00yfssBfSX"
                    >
                    </stripe-buy-button> */}
                    <LinkContainer to="/chat">
                        <Button variant="success">
                            Get Started <i className="fas fa-comments home-message-icon"></i>
                        </Button>
                    </LinkContainer>
                </div>
            </Col>
            <Col md={6} className="home__bg"></Col>
        </Row>
    );
}

export default Home;
