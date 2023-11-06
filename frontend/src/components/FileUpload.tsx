import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {Button, Form, Container, Spinner, Row, Col, Modal, Alert} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useNavigate} from "react-router-dom";

const FileUpload: React.FC = () => {
    const navigate = useNavigate();

    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [industry, setIndustry] = useState<string>('');
    const [style, setStyle] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [responseText, setResponseText] = useState<string>('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFile(acceptedFiles[0]);
        setFileName(acceptedFiles[0].name);
    }, []);

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc', '.docx'],
            'text/plain': ['.txt'],
        },
    });

    const handleSubmit = async () => {
        if (file && industry && style) {
            setIsUploading(true);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('industry', industry);
            formData.append('style', style);

            try {
                const response = await fetch('http://127.0.0.1:5000/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data)
                console.log(data['response_text'])
                console.log(data.responseText)
                // Pass the response text to the navigate function
                navigate('/response', { state: { responseText: data['response_text'] } });

            } catch (error) {
                console.error('There was an error!', error);
            } finally {
                setIsUploading(false);
            }
        } else {
            alert('Please select a file along with industry and style.');
        }
    };

    // const handleSubmit = async () => {
    //     if (file && industry && style) {
    //         setIsUploading(true);
    //
    //         // Mock server response after a set delay
    //         setTimeout(() => {
    //             // Replace this with the mocked response you expect from your server
    //             const mockResponse = {
    //                 responseText: "Thank you for submitting your resume for review. You have a strong background in software engineering with a variety of experiences across different companies and projects. Here are some areas of strength and suggestions for improvement:\n" +
    //                     "\n" +
    //                     "**Strengths:**\n" +
    //                     "\n" +
    //                     "1. **Diverse Experience:** Your resume shows a wide range of experiences across different companies and roles. This demonstrates your adaptability and ability to work in different environments.\n" +
    //                     "\n" +
    //                     "2. **Quantifiable Achievements:** You have done a good job of quantifying your achievements in your roles. For example, in your role at DarwinAI, you mention that you decreased average inspection time by 40%. This gives a clear picture of the impact you had in your roles.\n" +
    //                     "\n" +
    //                     "3. **Projects:** Your projects section is strong and shows that you have taken the initiative to apply your skills outside of work. This is a great way to demonstrate your passion and dedication to software engineering.\n" +
    //                     "\n" +
    //                     "**Areas for Improvement:**\n" +
    //                     "\n" +
    //                     "1. **Relevant Courses:** In the education section, you mention \"Relevant Courses: Algorithms and Data Structures, Systems Programming and Concurrency, Real-Time Systems\". It would be beneficial to include grades or any achievements related to these courses to further demonstrate your proficiency.\n" +
    //                     "\n" +
    //                     "2. **Skills Section:** While you have listed a lot of skills, it would be helpful to provide some context or examples of where you have used these skills. For example, under Languages, you could mention a project or role where you used a specific language.\n" +
    //                     "\n" +
    //                     "3. **Role at Epoch App:** In your role at Epoch App, you mention that you \"played a key role in preparing for SOC-2 audit\". It would be helpful to provide more details about what this involved and the impact it had.\n" +
    //                     "\n" +
    //                     "4. **Role at BetterUp:** In your role at BetterUp, you mention that you \"increased on-call efficiency by 20% by creating automations in Python\". It would be beneficial to provide more details about what these automations were and how they led to increased efficiency.\n" +
    //                     "\n" +
    //                     "5. **Role at OpenText:** In your role at OpenText, you mention that you \"raised API test success rate notably from 67% to 98%\". It would be helpful to provide more details about how you achieved this.\n" +
    //                     "\n" +
    //                     "Overall, your resume is strong and demonstrates a wide range of skills and experiences. By providing more details and context in some areas, you can further strengthen your resume and give potential employers a clearer picture of your abilities and achievements. \n" +
    //                     "\n" +
    //                     "Best of luck with your job search!\n" +
    //                     "\n" +
    //                     "Best Regards,\n"
    //             };
    //             navigate('/response', { state: { responseText: mockResponse.responseText } })
    //         }, 1000); // 1 second delay to mimic server response time
    //
    //     } else {
    //         alert('Please select a file along with industry and style.');
    //     }
    // };

    const removeFile = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setFile(null);
        setFileName('');
    };

    const handleNewUpload = () => {
        setFile(null);
        setFileName('');
        setIndustry('');
        setStyle('');
        setResponseText('');
    }
    return (
        <Container fluid className="d-flex vh-100 align-items-center justify-content-center bg-dark text-white">
            <Row className="w-100">
                <Col md={{ span: 6, offset: 3 }}>
                    <Form>
                        {responseText ? (
                            // If responseText is available, display it instead of the dropzone
                            <Alert variant="success" className="text-center">
                                {responseText}
                            </Alert>
                        ) : (
                            // Otherwise, display the dropzone
                            <Form.Group controlId={'dropzone'} className={'mb-3'}>
                                <div {...getRootProps({ className: 'dropzone' })} style={{
                                    height: '200px',
                                    cursor: 'pointer',
                                    borderRadius: '5px',
                                    border: '1px dashed #aaa',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <input {...getInputProps()} />
                                    {isUploading ? (
                                        <Spinner animation="border" />
                                    ) : fileName ? (
                                        // Display the file name and a remove button
                                        <div style={{ textAlign: 'center' }}>
                                            <p className="mb-0">{fileName}</p>
                                            <Button variant="danger" size="sm" onClick={removeFile} className="mt-2">
                                                Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        // Display the dropzone message
                                        <p>Drag 'n' drop resume here, or click to select file</p>
                                    )}
                                </div>
                            </Form.Group>
                        )}
                        <Row>
                            <Col md={6} className={'mb-3'}>
                                <Form.Control as="select" className={'bg-dark text-white'}
                                              onChange={(e) => setIndustry(e.target.value)} value={industry}>
                                    <option value="">Select Industry</option>
                                    <option value="software">Software</option>
                                    {/* More options */}
                                </Form.Control>
                            </Col>
                            <Col md={6} className={'mb-3'}>
                                <Form.Control as="select" className={'bg-dark text-white'}
                                              onChange={(e) => setStyle(e.target.value)} value={style}>
                                    <option value="">Select Style</option>
                                    <option value="modern">Modern</option>
                                </Form.Control>
                            </Col>
                        </Row>
                        <Row hidden={!!responseText}>
                            <Col md={{span: 6, offset: 3}} className="text-center">
                                <Button variant="primary" type="button" className={'m-2'} onClick={handleSubmit}
                                        disabled={isUploading}>
                                    {isUploading ? 'Processing...' : 'Submit'}
                                </Button>
                            </Col>
                        </Row>
                        <Row hidden={!responseText} >
                            <Col md={{span: 6, offset: 3}} className="text-center">
                                <Button variant="secondary " type="button" className={'m-2'} onClick={handleNewUpload}>
                                    {'Upload New Resume'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default FileUpload;
