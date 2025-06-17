import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Card, Nav, Modal, Spinner, ListGroup, InputGroup } from 'react-bootstrap';

// This should be the base URL of your deployed backend
const API_URL = 'http://localhost:5000/api'; 

// --- SVG Icons (to remove external dependency) ---
const PlusCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>;
const PencilSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/></svg>;
const EyeSlashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.94 5.94 0 0 1 8 4.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.288.822.822.056.056.056.056.822.822 1.288-2.943.028.028.028.028zm-3.174.12.822.822.028.028.028.028.822.822-2.943 1.288-.028-.028-.028-.028zm-3.174.12.822.822.028.028.028.028.822.822zm-2.943 1.288.822.822.056.056.056.056.822.822l.822.822.056.056.056.056.822.822l.822.822.056.056.056.056.822.822zM1 8s3-5.5 8-5.5a7.027 7.027 0 0 1 2.79.588l-.77-.771A5.94 5.94 0 0 0 8 4.5C5.88 4.5 4.12 5.668 2.83 6.957A13.133 13.133 0 0 0 1.172 8l.001.001.001.001.001.001.001.001zM1 8s3 5.5 8 5.5a7.027 7.027 0 0 1 2.79.588l-.77-.771A5.94 5.94 0 0 0 8 11.5c-2.12 0-3.879-1.168-5.168-2.457A13.133 13.133 0 0 1 1.172 8z"/><path d="M1.36 1.36a.5.5 0 0 1 .708 0l12 12a.5.5 0 0 1-.708.708l-12-12a.5.5 0 0 1 0-.708z"/></svg>;


const AdminPanel = () => {
    // --- STATE MANAGEMENT ---
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('about');

    // Data states
    const [about, setAbout] = useState([]);
    const [projects, setProjects] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [skills, setSkills] = useState([]);
    const [badges, setBadges] = useState([]);
    const [cv, setCv] = useState([]);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    // --- INLINE STYLES ---
    // Styles are now more component-focused rather than for a full page
    const styles = {
        loginCard: {
            backgroundColor: '#1b1b2f',
            border: '1px solid #c770f0',
            color: 'white',
            borderRadius: '0.5rem',
        },
        contentCard: {
            backgroundColor: '#1b1b2f',
            border: '1px solid #c770f0',
            color: 'white',
            marginBottom: '1rem',
            borderRadius: '0.5rem',
        },
        listItem: {
            backgroundColor: 'transparent',
            borderBottom: '1px solid #333',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white',
        },
        listItemTitle: {
            color: '#c770f0',
            marginBottom: '0.25rem',
        },
        listItemText: {
            color: 'rgba(255, 255, 255, 0.7)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
        },
        navTabs: {
            marginBottom: '1.5rem',
        },
        navLink: {
            color: '#c770f0',
            border: '1px solid transparent',
            borderBottom: '1px solid #333',
        },
        navLinkActive: {
            color: 'white',
            backgroundColor: '#c770f0',
            borderColor: '#c770f0',
            fontWeight: 'bold',
        },
        buttonPrimary: {
            backgroundColor: '#c770f0',
            borderColor: '#c770f0',
            color: 'white',
        },
        formControl: {
            backgroundColor: '#2a2a3a',
            color: 'white',
            border: '1px solid #444',
        },
        modalHeader: {
            backgroundColor: '#1b1b2f',
            color: 'white',
            borderBottom: '1px solid #333',
        },
        modalBody: {
            backgroundColor: '#1b1b2f',
            color: 'white',
        },
        closeButton: {
            filter: 'invert(1) grayscale(100%) brightness(200%)',
        }
    };


    // --- DATA FETCHING & API CALLS ---

    const getAuthToken = () => localStorage.getItem('admin_token');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            if (!response.ok) throw new Error('Invalid password.');
            
            localStorage.setItem('admin_token', password);
            setIsLoggedIn(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const fetchData = useCallback(async (type, setter) => {
        try {
            const response = await fetch(`${API_URL}/${type}`);
            if (!response.ok) throw new Error(`Could not fetch ${type}`);
            const data = await response.json();
            setter(data);
        } catch (err) {
            console.error(err);
            setError(`Failed to load ${type}.`);
        }
    }, []);

    const getSetterForType = (type) => {
        const setters = {
            about: setAbout,
            projects: setProjects,
            experience: setExperiences,
            certificates: setCertificates,
            skills: setSkills,
            badges: setBadges,
            cv: setCv,
        };
        return setters[type];
    };

    useEffect(() => {
        if (isLoggedIn) {
            const dataTypes = ['about', 'projects', 'experience', 'certificates', 'skills', 'badges', 'cv'];
            dataTypes.forEach(type => fetchData(type, getSetterForType(type)));
        }
    }, [isLoggedIn, fetchData]);

    // --- MODAL & FORM HANDLING ---
    
    const handleShowModal = (item = null) => {
        setIsEditing(item !== null);
        setCurrentItem(item || {});
        setShowModal(true);
        setError('');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentItem(null);
        setError('');
    };

    const handleFormChange = (e) => {
        setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const fields = getFieldsForType(activeTab);
        for (const field of fields) {
            if (field.required && (!currentItem || !currentItem[field.name])) {
                setError(`${field.label} is required.`);
                return;
            }
        }

        setLoading(true);
        setError('');
        const url = isEditing ? `${API_URL}/${activeTab}/${currentItem._id}` : `${API_URL}/${activeTab}`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`,
                },
                body: JSON.stringify(currentItem),
            });
            if (!response.ok) throw new Error('Save operation failed.');
            fetchData(activeTab, getSetterForType(activeTab));
            handleCloseModal();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            try {
                const response = await fetch(`${API_URL}/${activeTab}/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${getAuthToken()}` },
                });
                if (!response.ok) throw new Error('Delete operation failed.');
                fetchData(activeTab, getSetterForType(activeTab));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    // --- DYNAMIC CONTENT RENDERING ---

    const getFieldsForType = (type) => {
        const fieldConfig = {
            about: [{ name: 'content', label: 'Content', type: 'textarea', required: true }],
            projects: [
                { name: 'title', label: 'Title', required: true },
                { name: 'description', label: 'Description', type: 'textarea', required: true },
                { name: 'image', label: 'Image URL', required: true },
                { name: 'githubLink', label: 'GitHub Link' },
                { name: 'demoLink', label: 'Demo Link' },
            ],
            experience: [
                { name: 'role', label: 'Role', required: true },
                { name: 'company', label: 'Company', required: true },
                { name: 'date', label: 'Date', required: true },
                { name: 'description', label: 'Description', type: 'textarea', required: true },
            ],
            certificates: [
                { name: 'title', label: 'Title', required: true },
                { name: 'image', label: 'Image URL', required: true },
            ],
            skills: [
                { name: 'name', label: 'Skill Name', required: true },
                { name: 'iconClass', label: 'Icon Class (e.g., devicon-react-original)', required: true },
            ],
            badges: [
                { name: 'name', label: 'Badge Name', required: true },
                { name: 'image', label: 'Image URL', required: true },
            ],
            cv: [{ name: 'fileUrl', label: 'CV File URL', required: true }],
        };
        return fieldConfig[type] || [];
    };
    
    // Login Page
    if (!isLoggedIn) {
        return (
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                <Row>
                    <Col>
                        <Card style={styles.loginCard}>
                            <Card.Body className="p-4">
                                <h2 className="text-center mb-4">Admin Panel Login</h2>
                                <Form onSubmit={handleLogin}>
                                    <Form.Group>
                                        <Form.Label>Password</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                style={styles.formControl}
                                                placeholder="Enter admin password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <EyeSlashIcon/> : <EyeIcon/>}
                                            </Button>
                                        </InputGroup>
                                    </Form.Group>
                                    <Button style={{ ...styles.buttonPrimary, width: '100%', marginTop: '1.5rem' }} type="submit" disabled={loading}>
                                        {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Login'}
                                    </Button>
                                    {error && <p className="text-danger mt-3 text-center">{error}</p>}
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
    
    // Main Admin Panel
    return (
        // The main container is now a standard react-bootstrap Container
        // with vertical padding (py-5) to push it down from the navbar.
        <Container fluid className="py-5">
            <h1 className="mb-4 text-white">Portfolio Content Manager</h1>

            <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} style={styles.navTabs}>
                {['About', 'Projects', 'Experience', 'Certificates', 'Skills', 'Badges', 'CV'].map(tab => (
                    <Nav.Item key={tab}>
                        <Nav.Link eventKey={tab.toLowerCase()} style={activeTab === tab.toLowerCase() ? styles.navLinkActive : styles.navLink}>{tab}</Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>

            <Card style={styles.contentCard}>
                <Card.Header className="d-flex justify-content-between align-items-center" style={{backgroundColor: 'transparent', borderBottom: '1px solid #333'}}>
                    <h4 className="mb-0">Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h4>
                    <Button style={styles.buttonPrimary} onClick={() => handleShowModal()}>
                       <PlusCircleIcon /> Add New
                    </Button>
                </Card.Header>
                <Card.Body>
                    <ListGroup variant="flush">
                        {[...{
                            about: about,
                            projects: projects,
                            experience: experiences,
                            certificates: certificates,
                            skills: skills,
                            badges: badges,
                            cv: cv
                        }[activeTab]].map(item => (
                            <ListGroup.Item key={item._id} style={styles.listItem}>
                                <div>
                                    <h5 style={styles.listItemTitle}>{item.title || item.role || item.name || 'About Content'}</h5>
                                    <p style={styles.listItemText}>{item.company || item.description || item.content || item.fileUrl}</p>
                                </div>
                                <div>
                                    <Button variant="outline-light" className="me-2" onClick={() => handleShowModal(item)}><PencilSquareIcon /></Button>
                                    <Button variant="outline-danger" onClick={() => handleDelete(item._id)}><TrashIcon /></Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>

            {/* --- Add/Edit Modal --- */}
            <Modal show={showModal} onHide={handleCloseModal} centered data-bs-theme="dark">
                <Modal.Header closeButton style={styles.modalHeader}>
                    <Modal.Title>{isEditing ? 'Edit' : 'Add'} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={styles.modalBody}>
                    <Form onSubmit={handleSave}>
                        {getFieldsForType(activeTab).map(field => (
                            <Form.Group key={field.name} className="mb-3">
                                <Form.Label>{field.label}</Form.Label>
                                <Form.Control
                                    as={field.type === 'textarea' ? 'textarea' : 'input'}
                                    rows={field.type === 'textarea' ? 4 : undefined}
                                    type={field.type || 'text'}
                                    name={field.name}
                                    style={styles.formControl}
                                    // This line pre-populates the form with the current item's data for editing
                                    value={currentItem?.[field.name] || ''}
                                    onChange={handleFormChange}
                                    required={field.required}
                                />
                            </Form.Group>
                        ))}
                        {error && <p className="text-danger">{error}</p>}
                         <Button style={{ ...styles.buttonPrimary, width: '100%'}} type="submit" disabled={loading}>
                            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Save Changes'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AdminPanel;
