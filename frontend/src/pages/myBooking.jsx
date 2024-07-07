import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";

import TourCard from "../shared/TourCard";

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [tours, setTours] = useState([]);
    const userId = user ? user._id : null;

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                return; // Do not fetch if user is not logged in
            }

            try {
                const bookingsResponse = await axios.get(`${BASE_URL}/booking/user/${userId}`, {
                    withCredentials: true,
                });
                const toursResponse = await axios.get(`${BASE_URL}/tours`, {
                    withCredentials: true,
                });
                setBookings(bookingsResponse.data.data);
                setTours(toursResponse.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [user, userId]);

    const mapBookingToTour = (booking) => {
        const tourInfo = tours.find((tour) => tour.title === booking.tourName);
        return { ...booking, tourInfo: tourInfo || null };
    };

    const bookingsWithTourInfo = bookings.map(mapBookingToTour);

    if (!user || !user._id) {
        return <p>Please log in to view your bookings.</p>;
    }

    const canCancelBooking = (booking) => booking.status === "pending";

    const handleCancelBooking = async (bookingId) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
        if (!confirmCancel) {
            return;
        }

        try {
            const response = await axios.delete(`${BASE_URL}/bookings/${bookingId}`, {
                withCredentials: true,
            });

            if (response.status === 204) {
                setBookings(bookings.filter((booking) => booking._id !== bookingId));
            } else {
                console.error("Failed to cancel booking");
            }
        } catch (error) {
            console.error("Error canceling booking:", error);
        }
    };

    return (
        <Container>
            <h2 className="mt-4 mb-4">My Bookings</h2>
            {bookingsWithTourInfo.length === 0 ? (
                <p>You don't have any booked tours yet.</p>
            ) : (
                <Row>
                    {bookingsWithTourInfo.map((booking) => (
                        <Col lg="3" md="6" sm="6" className="mb-4" key={booking._id}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        {booking.tourName || "Tour not found"}
                                    </Card.Title>
                                    {booking.tourInfo ? (
                                        <TourCard tour={booking.tourInfo} />
                                    ) : (
                                        <p>Tour information not available</p>
                                    )}
                                    <Card.Text>
                                        <strong>Date:</strong> {booking.bookAt}
                                        <br />
                                        <strong>Status:</strong> {booking.status}
                                        <br />
                                        <strong>Price:</strong> ${booking.price}
                                        <br />
                                        <strong>Max Group Size:</strong> {booking.guestSize}
                                    </Card.Text>

                                    {canCancelBooking(booking) && (
                                        <Button
                                            variant="danger"
                                            onClick={() => handleCancelBooking(booking._id)}
                                        >
                                            Cancel Booking
                                        </Button>
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
