import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, ListGroup, Button, Form, Modal } from 'react-bootstrap';

const MyBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [review, setReview] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Fetch bookings from the server running on port 9999
        const fetchBookings = async () => {
            try {
                const response = await axios.get('http://localhost:9999/bookings');
                setBookings(response.data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchBookings();
    }, []);

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        setSelectedBooking(id);
        setShow(true);
    };

    const handleCancel = async (id) => {
        try {
            // Send a request to your server to cancel the booking
            await axios.delete(`http://localhost:9999/bookings/${id}`);
            setBookings(bookings.filter(booking => booking._id !== id));
        } catch (error) {
            console.error("Error canceling booking:", error);
        }
    };

    const handleReview = async (id) => {
        try {
            // Send a request to your server to update the review
            await axios.put(`http://localhost:9999/bookings/${id}`, { review });
            setBookings(bookings.map(booking =>
                booking._id === id ? { ...booking, review } : booking
            ));
            setReview("");
            setSelectedBooking(null);
            handleClose();
        } catch (error) {
            console.error("Error updating review:", error);
        }
    };

    return (
        <Container>
            <h1 className="my-4">My Bookings</h1>
            <ListGroup>
                {bookings.map(booking => (
                    <ListGroup.Item key={booking._id}>
                        <Row>
                            <Col md={8}>
                                <h5>{booking.tourName}</h5>
                                <p><strong>Full Name:</strong> {booking.fullName}</p>
                                <p><strong>Guest Size:</strong> {booking.guestSize}</p>
                                <p><strong>Phone:</strong> {booking.phone}</p>
                                <p><strong>Booked At:</strong> {new Date(booking.bookAt).toLocaleDateString()}</p>
                                <p><strong>Review:</strong> {booking.review}</p>
                            </Col>
                            <Col md={4} className="d-flex align-items-center justify-content-end">
                                <Button variant="danger" onClick={() => handleCancel(booking._id)} className="me-2">Cancel Booking</Button>
                                <Button variant="primary" onClick={() => handleShow(booking._id)}>Review</Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Write a Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="reviewTextarea">
                            <Form.Label>Review</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Write your review here"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleReview(selectedBooking)}>
                        Submit Review
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default MyBooking;
