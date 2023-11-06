import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import LearnMore from './components/LearnMore';
import UploadHistory from './components/UploadHistory';
import ResponsePage from './components/ResponsePage';
import {Navbar, Nav} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
    return (
        <Router>
            <Navbar bg="dark-subtle" expand="lg" className={'p-2'}>
                    <Navbar.Brand as={Link} to="/" className={'fw-bold text-dark'}>ResumeGPT</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">New Upload</Nav.Link>
                            <Nav.Link as={Link} to="/history">View History</Nav.Link>
                            <Nav.Link as={Link} to="/learn-more">Learn More</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
            </Navbar>
                <Routes>
                    <Route path="/" element={<FileUpload />} />
                    <Route path="/history" element={<UploadHistory />} />
                    <Route path="/learn-more" element={<LearnMore />} />
                    <Route path="/response" element={<ResponsePage />} />
                </Routes>
        </Router>
    );
};

export default App;
