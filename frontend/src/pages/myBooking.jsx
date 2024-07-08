import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";
import TourCard from "../shared/TourCard";

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [tours, setTours] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
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

    const handleCancelBooking = async (bookingId) => {
        try {
            const response = await axios.put(`${BASE_URL}/booking/cancel/${bookingId}`, null, {
                withCredentials: true,
            });

            if (response.status === 200) {
                const updatedBookings = bookings.map((booking) =>
                    booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
                );
                setBookings(updatedBookings);
            } else {
                console.error("Failed to cancel booking");
            }
        } catch (error) {
            console.error("Error canceling booking:", error);
        }
    };

    const handleShowDetails = (booking) => {
        setSelectedBooking(booking);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBooking(null);
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
                                    {/* <Card.Text>
                                        <strong>Date:</strong> {booking.bookAt}
                                        <br />
                                        <strong>Status:</strong> {booking.status}
                                        <br />
                                        <strong>Price:</strong> ${booking.price}
                                        <br />
                                        <strong>Max Group Size:</strong> {booking.guestSize}
                                    </Card.Text> */}

                                    <Button variant="primary" onClick={() => handleShowDetails(booking)}>
                                        Details
                                    </Button>
                                    {booking.status === "pending" && (
                                        <Button
                                            variant="danger"
                                            onClick={() => handleCancelBooking(booking._id)}
                                            disabled={booking.status !== "pending"}
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

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Booking Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBooking && (
                        <>
                            <p><strong>Tour Name:</strong> {selectedBooking.tourName}</p>
                            <p><strong>Date:</strong> {selectedBooking.bookAt}</p>
                            <p><strong>Status:</strong> {selectedBooking.status}</p>
                            <p><strong>Price:</strong> ${selectedBooking.price}</p>
                            <p><strong>Max Group Size:</strong> {selectedBooking.guestSize}</p>
                            {selectedBooking.tourInfo && (
                                <>
                                    <h5>Tour Information</h5>
                                    <TourCard tour={selectedBooking.tourInfo} />
                                </>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default MyBookings;
