import React from 'react';

import { FaUserCheck, FaPhoneSquare, FaComment  } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { AiOutlineHome } from 'react-icons/ai';

import banner from './banner.jpg';



const Footer = () => {
    return <>
		<div className="footer">
            <div className="discription">
            <div className="left-footer">
                <h4>Trang thông tin điện tử</h4>
                <p> Hưởng ứng sự phát triển mạnh mẽ của cuộc Cách mạng công nghiệp 4.0, trang thông tin điện tử Đội Công tác CC và CNCH được xây dựng nhằm đáp ứng quá trình chuyển đổi số, tạo điều kiện thuận lợi cho việc thu thập, tìm kiếm, lưu trữ và chia sẻ thông tin. Từ đó, góp phần nâng cao hiệu quả hoạt động của đơn vị.</p>
            </div>

            <div className="middle-footer"> 
                <h4 >Phát triển bởi</h4>
                <p>
                <ul>
                    <li><a href="/person/"><FaUserCheck /> Trung úy Đặng Bá Dương</a></li>
                    <li><a href="callto:0965881681"><FaPhoneSquare /> 0965.881.681</a></li>
                    <li><a href="mailto:duong.ht96@gmail.com"><FiMail /> duong.ht96@gmail.com</a></li>
                    <li><span><AiOutlineHome /> Hà Tĩnh, Việt Nam</span></li>
                </ul>
                </p>
            </div>

            <div className="right-footer">
                <h4>Góp ý nội dung</h4>
                
                    <p>Quá trình phát triển trang thông tin dựa trên ý tưởng cá nhân khó tránh khỏi những bất cập, thiếu sót. Hi vọng nhận được sự phản hồi, góp ý của các đồng chí để từng bước hoàn thiện và đáp ứng tốt hơn.</p>
                    <p className="follow-me-icons">
                        <a href="#"><i className="fa fa-twitter fa-2"></i></a>
                        <a href="#"><i className="fa fa-dribbble fa-2"></i></a>
                        <a href="#"><i className="fa fa-github fa-2"></i></a>
                        <a href="#"><i className="fa fa-facebook fa-2"></i></a>
                        <a href="#"><i className="fa fa-youtube fa-2"></i></a>
                        <a href="#"><i className="fa fa-pinterest fa-2"></i></a>
                    </p>
            </div>
            </div>

            <div className="banner">
        <img src={banner} alt="" width="100%"/>
		</div>

			<span className="license">Design by Bad, 6/2021</span>

		</div>
    </>
}

export default Footer;