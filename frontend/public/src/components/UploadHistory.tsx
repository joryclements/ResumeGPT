import React, { useState } from 'react';
import { Container, Row, Col, Form, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactMarkdown from 'react-markdown';

const UploadHistory: React.FC = () => {
    // Retrieve the saved responses from localStorage
    const [savedResponses, setSavedResponses] = useState(JSON.parse(localStorage.getItem('savedResponses') || '[]'));
    const [selectedResponse, setSelectedResponse] = useState('');

    // Event handler for selecting a response
    const handleSelectResponse = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const responseIndex = parseInt(event.target.value, 10); // Parse the index as a number
        setSelectedResponse(savedResponses[responseIndex]);
    };

    return (
        <Container fluid className="d-flex vh-100 pt-3 bg-dark text-white">
            <Row className="w-100">
                <Col  className={'align-items-center '}>

                <h1 className="text-center">Upload History</h1>
                    <div className={'ps-5'}>
                    {savedResponses.length > 0 ? (
                        <>
                            <Form.Select onChange={handleSelectResponse}>
                                <option value="">Select a response</option>
                                {savedResponses.map((response: string, index: number) => (
                                    <option key={index} value={index}>
                                        Response {index + 1} - {response.length} characters
                                    </option>
                                ))}
                            </Form.Select>
                            {selectedResponse && (
                                <Card className="bg-dark-subtle text-dark rounded p-3 mt-3">
                                    <Card.Body>
                                        <ReactMarkdown>{selectedResponse}</ReactMarkdown>
                                    </Card.Body>
                                </Card>
                            )}

                        </>
                    ) : (
                        <p>No saved responses.</p>
                    )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default UploadHistory;
