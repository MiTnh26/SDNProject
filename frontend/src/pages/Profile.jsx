import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../utils/config';
import { Container, Row, Col, Form, Button, Image, Alert } from 'react-bootstrap';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        avatar: null,
        fullname: '',
        address: '',
        phone: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user || !user._id) return; // Kiểm tra xem user có tồn tại không
            try {
                const res = await axios.get(`${BASE_URL}/users/${user._id}`, { withCredentials: true });
                setProfile(res.data.data);
                setFormData({
                    username: res.data.data.username,
                    email: res.data.data.email,
                    avatar: res.data.data.avatar,
                    fullname: res.data.data.fullname,
                    address: res.data.data.address,
                    phone: res.data.data.phone,
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'avatar') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleSave = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('fullname', formData.fullname);
            formDataToSend.append('address', formData.address);
            formDataToSend.append('phone', formData.phone);
            if (formData.avatar && typeof formData.avatar !== 'string') {
                formDataToSend.append('avatar', formData.avatar);
            }

            const res = await axios.put(`${BASE_URL}/users/${user._id}`, formDataToSend, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setProfile(res.data.data);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New password and confirm password do not match');
            return;
        }

        try {
            const res = await axios.put(`${BASE_URL}/auth/${user._id}/change-password`, passwordData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setPasswordSuccess('Password changed successfully');
            setIsChangingPassword(false);
            setPasswordError('');
        } catch (err) {
            setPasswordError('Error changing password: ' + err.response.data.message);
        }
    };

    return (
        <Container>
            <h2 className="my-4">User Profile</h2>
            {isEditing ? (
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Avatar</Form.Label>
                        <Form.Control
                            type="file"
                            name="avatar"
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Button className="me-2" variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>
                        Cancel
                    </Button>
                </Form>
            ) : (
                <Row>
                    <Col md={6}>
                        <p><strong>Username:</strong> {profile.username}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <p><strong>Full Name:</strong> {profile.fullname}</p>
                        <p><strong>Address:</strong> {profile.address}</p>
                        <p><strong>Phone:</strong> {profile.phone}</p>
                    </Col>
                    <Col md={6}>
                        <Image src={`${BASE_URL}/user_images/${profile.avatar}`} alt="Avatar" roundedCircle />
                    </Col>
                    <Col md={12}>
                        <Button className="me-2" variant="primary" onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </Button>
                        <Button variant="secondary" onClick={() => setIsChangingPassword(true)}>
                            Change Password
                        </Button>
                    </Col>
                </Row>
            )}

            {isChangingPassword && (
                <Form className="mt-4">
                    <h4>Change Password</h4>
                    {passwordError && <Alert variant="danger">{passwordError}</Alert>}
                    {passwordSuccess && <Alert variant="success">{passwordSuccess}</Alert>}
                    <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                        />
                    </Form.Group>
                    <Button className="me-2" variant="primary" onClick={handleChangePassword}>
                        Change Password
                    </Button>
                    <Button variant="secondary" onClick={() => setIsChangingPassword(false)}>
                        Cancel
                    </Button>
                </Form>
            )}
        </Container>
    );
}

export default Profile;
