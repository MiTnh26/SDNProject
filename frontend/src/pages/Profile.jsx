import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../utils/config';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', avatar: null });

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

    const handleSave = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('email', formData.email);
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

    return (
        <div>
            <h2>User Profile</h2>
            {isEditing ? (
                <div>
                    <label>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} />
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    <label>Avatar</label>
                    <input type="file" name="avatar" onChange={handleChange} />

                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <div>
                    <p>Username: {profile.username}</p>
                    <p>Email: {profile.email}</p>
                    <div>
                        <img src={`${BASE_URL}/user_images/${profile.avatar}`} alt="Avatar" />
                    </div>

                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                </div>
            )}
        </div>
    );
}

export default Profile;
