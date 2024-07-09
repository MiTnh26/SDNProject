import React from 'react';
import '../../styles/contact.css';
import CommonSection from '../../shared/CommonSection';

const ContactPage = () => {
  return (
    <>
      <CommonSection title={"Contact"} />
      <div className="contact-container">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h2>Thông tin liên hệ</h2>
              <p><strong>Địa chỉ:</strong> Km29, Đại lộ Thăng Long, Hà Nội</p>
              <p><strong>Email:</strong> quanghiennguyen.business@fpt.edu.vn</p>
              <p><strong>Phone:</strong> 0123456789</p>
            </div>
            <div className="col-md-6">
              <h2>Gửi tin nhắn cho chúng tôi</h2>
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Tên</label>
                  <input type="text" className="form-control" id="name" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Tin nhắn</label>
                  <textarea className="form-control" id="message" rows="5" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Gửi</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;