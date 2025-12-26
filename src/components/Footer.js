import React from "react";
import {
  FaUserCheck,
  FaPhoneSquare,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";

const Footer = () => {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="footer footer--modern">
      <div className="container">
        <div className="footer__discription">
          <div className="footer__col footer__about">
            <h4>Quản lý phương tiện PCCC và CNCH</h4>
            <p>
              Bước vào kỷ nguyên mới – kỷ nguyên vươn mình của dân tộc, Website được xây dựng với sứ mệnh chuyển đổi số, đổi mới để bứt phá nâng cao hiệu quả công tác 
              quản lý phương tiện phòng cháy, chữa cháy và cứu nạn cứu hộ của lực lượng Cảnh sát PCCC và CNCH Công an tỉnh Tây Ninh
            </p>
          </div>



          <div className="footer__col footer__contact">
            <h4>Liên hệ, góp ý</h4>
            <ul>
              <li>
                <FaUserCheck /> <span>Trung úy Đặng Bá Dương</span>
              </li>
              <li>
                <FaPhoneSquare /> <a href="tel:0965881681">0965.881.681</a>
              </li>
              <li>
                <FiMail /> <a href="mailto:duong.ht96@gmail.com">duong.ht96@gmail.com</a>
              </li>
              <li>
                <AiOutlineHome /> <span>Hà Tĩnh, Việt Nam</span>
              </li>


            </ul>

            <div className="footer__social" aria-label="social media">
              <a href="#" aria-label="facebook">
                <FaFacebook />
              </a>
              <a href="#" aria-label="twitter">
                <FaTwitter />
              </a>
              <a href="#" aria-label="youtube">
                <FaYoutube />
              </a>
              <a href="#" aria-label="github">
                <FaGithub />
              </a>
              <a href="#" aria-label="linkedin">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span className="license">Copyright © Duongcntt96, 6/2021 - (Updating...)</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
