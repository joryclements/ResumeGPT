import React from 'react';
import {Button, Container, Row, Col, Card} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from "react-router-dom";
import ReactMarkdown from 'react-markdown';

const ResponsePage: React.FC = () => {
    const location = useLocation();
    const responseText = location.state?.responseText || 'Default response text if none provided';

    const handleNewUpload = () => {
        window.location.href = '/';
    };

    const handleCopyText = async () => {
        try {
            await navigator.clipboard.writeText(responseText);
            alert('Text copied to clipboard');
        } catch (error) {
            console.error('Failed to copy text: ', error);
        }
    };

    const handleSave = () => {
        // Save the response to localStorage
        const savedResponses = JSON.parse(localStorage.getItem('savedResponses') || '[]'); // Get the existing responses
        savedResponses.push(responseText); // Add the new response
        localStorage.setItem('savedResponses', JSON.stringify(savedResponses)); // Save back to localStorage
        alert('Response saved'); // Inform the user
    };



    return (
        <Container fluid style={{ minHeight: '100vh' }} className="bg-dark text-white d-flex flex-column p-3">
            <Row className="mb-3 align-items-center text-center">
                <Col>
                    <h1>Resume Feedback</h1>
                </Col>
                <Col>
                    <Button variant="primary" className="me-2" onClick={handleSave}>
                        Save
                    </Button>
                    <Button variant="secondary" className="me-2" onClick={handleNewUpload}>
                        Upload New Resume
                    </Button>
                    <Button variant="outline-secondary" onClick={handleCopyText}>
                        Copy
                    </Button>
                </Col>
            </Row>
            <Row className="flex-grow-1 justify-content-center">
                <Col md={10} className="markdown-container">
                    <Card className="bg-dark-subtle text-dark rounded p-3">
                        <Card.Body>
                            <ReactMarkdown>{responseText}</ReactMarkdown>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ResponsePage;
