import React from 'react';
import {Col, Container, Row} from "react-bootstrap";

const LearnMore: React.FC = () => {
    return (
        <Container fluid className="d-flex vh-100 align-items-center justify-content-center bg-dark text-white">
            <Row className="w-100 p-3">
                <Col className="text-center">
                    <h1>Thanks for your interest.</h1>
                    <p>We're a team of students working to help everyone learn how to improve their resume.</p>
                </Col>
            </Row>
        </Container>
    );
};

export default LearnMore;
