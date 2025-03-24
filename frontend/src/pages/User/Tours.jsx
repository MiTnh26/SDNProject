import React, { useState, useEffect } from 'react';
import CommonSection from '../../shared/CommonSection';
import '../../styles/tour.css';
import TourCard from '../../shared/TourCard';
import SearchBar from '../../shared/SearchBar';
import { Col, Container, Row } from 'reactstrap';
import useFetch from '../../hooks/useFetch';
import { BASE_URL } from '../../utils/config';

const Tours = () => {
   const [pageCount, setPageCount] = useState(0);
   const [page, setPage] = useState(0);
   const [sortCriteria, setSortCriteria] = useState('');
   const [sortedTours, setSortedTours] = useState([]);

   const { data: tours, loading, error } = useFetch(`${BASE_URL}/tours?page=${page}`);
   const { data: tourCount } = useFetch(`${BASE_URL}/tours/search/getTourCount`);

   useEffect(() => {
      const pages = Math.ceil(tourCount / 8);
      setPageCount(pages);
      window.scrollTo(0, 0);
   }, [page, tourCount]);

   useEffect(() => {
      if (tours) {
         let sortedArray = [...tours];
         if (sortCriteria === 'location') {
            sortedArray.sort((a, b) => a.city.localeCompare(b.city));
         } else if (sortCriteria === 'priceAsc') {
            sortedArray.sort((a, b) => a.price - b.price);
         } else if (sortCriteria === 'priceDesc') {
            sortedArray.sort((a, b) => b.price - a.price);
         } 
         else if (sortCriteria === 'rating') {
            sortedArray.sort((a, b) => b.rating - a.rating);
         }
         
         setSortedTours(sortedArray);
      }
   }, [tours, sortCriteria]);

   return (
      <>
         <CommonSection title={"All Tours Available"} />
         <section>
            <Container>
               <Row>
                  <SearchBar />
                  <Col lg="3" md="6" sm="6">
                     <select
                        onChange={(e) => setSortCriteria(e.target.value)}
                        className="form-control sort-select"
                     >
                        <option value="">All</option>
                        <option value="priceAsc">Price: Low to High</option>
                        <option value="priceDesc">Price: High to Low</option>
                        <option value="location">Location</option>
                        <option value="rating">Most ratings</option>
                     </select>
                  </Col>
               </Row>
            </Container>
         </section>

         <section className='pt-0'>
            <Container>
               {loading && <h4 className='text-center pt-5'>LOADING..........</h4>}
               {error && <h4 className='text-center pt-5'>{error}</h4>}
               {
                  !loading && !error &&
                  <Row>
                     {
                        sortedTours?.map(tour => (
                           <Col lg='3' md='6' sm='6' className='mb-4' key={tour._id}>
                              <TourCard tour={tour} />
                           </Col>
                        ))
                     }

                     <Col lg='12'>
                        <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                           {[...Array(pageCount).keys()].map(number => (
                              <span key={number} onClick={() => setPage(number)}
                                 className={page === number ? 'active__page' : ''}
                              >
                                 {number + 1}
                              </span>
                           ))}
                        </div>
                     </Col>
                  </Row>
               }
            </Container>
         </section>
      </>
   );
};

export default Tours;
