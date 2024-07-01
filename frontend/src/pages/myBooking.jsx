import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';


const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [tours, setTours] = useState({});
    const [reviews, setReviews] = useState([]);
    const [users, setUsers] = useState([]);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingsResponse, toursResponse, reviewsResponse, usersResponse] = await Promise.all([
                    axios.get('http://localhost:8000/bookings'),
                    axios.get('http://localhost:8000/tours'),
                    axios.get('http://localhost:8000/reviews'),
                    axios.get('http://localhost:8000/users')
                ]);

                setBookings(bookingsResponse.data);
                setReviews(reviewsResponse.data);
                setUsers(usersResponse.data);

                // Reduce tours data into a map for quick lookup
                const toursMap = toursResponse.data.reduce((acc, tour) => {
                    acc[`${tour.id}`] = tour;
                    return acc;
                }, {});
                setTours(toursMap);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const userBookings = bookings.filter(booking => `${booking.userId}` === '1');

    const handleRatingChange = event => {
        setNewRating(parseInt(event.target.value));
    };

    const handleCommentChange = event => {
        setNewComment(event.target.value);
    };

    const canRateAndComment = booking => {
        return booking.status === 'confirmed';
    };

    const canCancelBooking = booking => {
        return booking.status === 'pending';
    };

    const handleCancelBooking = async bookingId => {
        try {
            const response = await axios.delete(`http://localhost:8000/bookings/${bookingId}`);
            if (response.status === 204) {
                setBookings(bookings.filter(booking => booking.id !== bookingId));
            } else {
                console.error('Failed to cancel booking');
            }
        } catch (error) {
            console.error('Error canceling booking:', error);
        }
    };

    const handleReviewSubmit = async (tourId, bookingId) => {
        try {
            // Validate input
            if (!newRating || !newComment) {
                console.error('Please provide both rating and comment.');
                return;
            }

            const booking = bookings.find(b => `${b.id}` === `${bookingId}`);
            if (!booking || booking.status !== 'confirmed') {
                console.error('Cannot add review to unconfirmed booking.');
                return;
            }

            const newReview = {
                userId: '1', // Assuming user ID 1 for demo purposes
                tourId: `${tourId}`,
                rating: newRating,
                comment: newComment
            };

            const response = await axios.post('http://localhost:8000/reviews', newReview);

            if (response.status === 201) {
                const addedReview = response.data;
                setReviews([...reviews, addedReview]);
                setNewRating(5);
                setNewComment('');
            } else {
                console.error('Failed to add review');
            }
        } catch (error) {
            console.error('Error adding review:', error);
        }
    };

    return (
        <Container>
            <h2 className="mt-4 mb-4">My Bookings</h2>
            {userBookings.length === 0 ? (
                <p>You don't have any booked tours yet.</p>
            ) : (
                <Row>
                    {userBookings.map(booking => (
                        <Col key={booking.id} md={6} className="mb-4">
                            <Card>
                                <img src={`./public/${tours[`${booking.tourId}`]?.photo}`} alt={tours[`${booking.tourId}`]?.title} className="card-img-top" />
                                <Card.Body>
                                    <Card.Title>{tours[`${booking.tourId}`]?.title || 'Tour not found'}</Card.Title>
                                    <Card.Text>
                                        <strong>City:</strong> {tours[`${booking.tourId}`]?.city || 'Unknown City'}<br />
                                        <strong>Address:</strong> {tours[`${booking.tourId}`]?.address || 'Unknown Address'}<br />
                                        <strong>Date:</strong> {booking.date}<br />
                                        <strong>Status:</strong> {booking.status}<br />
                                        <strong>Price:</strong> ${tours[`${booking.tourId}`]?.price || 'Unknown Price'}<br />
                                        <strong>Max Group Size:</strong> {tours[`${booking.tourId}`]?.maxGroupSize || 'Unknown Size'}
                                    </Card.Text>

                                    <Card.Title>Reviews:</Card.Title>
                                    <ul className="list-unstyled">
                                        {reviews
                                            .filter(review => `${review.tourId}` === `${booking.tourId}`)
                                            .map(review => {
                                                const user = users.find(user => `${user.id}` === `${review.userId}`);
                                                return (
                                                    <li key={review.id}>
                                                        <strong>{review.rating} stars by {user ? user.name : 'Unknown User'}:</strong> {review.comment}
                                                    </li>
                                                );
                                            })}
                                    </ul>

                                    {canRateAndComment(booking) && (
                                        <>
                                            <Form className="mb-4">
                                                <Form.Group>
                                                    <Form.Label>Rating:</Form.Label>
                                                    <Form.Control as="select" value={newRating} onChange={handleRatingChange}>
                                                        <option value="5">5 stars</option>
                                                        <option value="4">4 stars</option>
                                                        <option value="3">3 stars</option>
                                                        <option value="2">2 stars</option>
                                                        <option value="1">1 star</option>
                                                    </Form.Control>
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label>Comment:</Form.Label>
                                                    <Form.Control as="textarea" rows={3} value={newComment} onChange={handleCommentChange} />
                                                </Form.Group>
                                                <Button variant="primary" onClick={() => handleReviewSubmit(booking.tourId, booking.id)}>Submit Review</Button>
                                            </Form>
                                        </>
                                    )}

                                    {canCancelBooking(booking) && (
                                        <Button variant="danger" onClick={() => handleCancelBooking(booking.id)}>Cancel Booking</Button>
                                    )}

                                    {!canRateAndComment(booking) && !canCancelBooking(booking) && (
                                        <p>You can only view details for this booking.</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default MyBookings;
