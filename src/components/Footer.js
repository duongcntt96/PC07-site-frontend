import React from "react";
import { FaUserCheck, FaPhoneSquare, FaFacebook, FaYoutube, FaGithub } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { FiMail } from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import { Stack, Box, Typography, Link, Container, IconButton } from '@mui/material';

const contactInfo = [
  { icon: <FaUserCheck />, text: "Đặng Bá Dương", type: "text" },
  { icon: <FaPhoneSquare />, text: "0965.881.681", type: "link", href: "tel:0965881681" },
  { icon: <FiMail />, text: "duong.ht96@gmail.com", type: "link", href: "mailto:duong.ht96@gmail.com" },
  { icon: <AiOutlineHome />, text: "Hà Tĩnh, Việt Nam", type: "text" },
];

const socialLinks = [
  { icon: <SiZalo />, label: "zalo", href: "https://zalo.me/@0965881681" },
  { icon: <FaYoutube />, label: "youtube", href: "https://www.youtube.com/@dangbaduong" },
  { icon: <FaFacebook />, label: "facebook", href: "#" },
  { icon: <FaGithub />, label: "github", href: "#" },
];

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: '#394d69ff', 
        color: 'white', 
        py: 4, 
        mt: 'auto' // Pushes footer to bottom if using Flexbox on parent
      }}
    >
      <Container maxWidth="lg">
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          justifyContent="space-between" 
          spacing={4}
        >
          {/* Left Side: Description */}
          <Stack spacing={1} sx={{ maxWidth: { md: '70%' } }}>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 'bold' }}>
              Quản lý phương tiện PCCC và CNCH
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6, textAlign: 'justify'}}>
              Website được xây dựng với mục tiêu đẩy mạnh chuyển đổi số nhằm nâng cao hiệu quả công tác quản lý phương tiện phòng cháy, chữa cháy và cứu nạn cứu hộ của lực lượng Cảnh sát PCCC và CNCH Công an tỉnh Tây Ninh. Chung sức xây dựng lực lượng vững mạnh bước vào kỷ nguyên mới – kỷ nguyên vươn mình của dân tộc!
            </Typography>
          </Stack>

          {/* Right Side: Contact & Socials */}
          <Stack spacing={1}>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 'bold' }}>
              Liên hệ, góp ý
            </Typography>
            <Stack spacing={0.5} sx={{ opacity: 0.8, fontWeight: 'bold' }}>
              {contactInfo.map((item, index) => (
                <Stack key={index} direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>{item.icon}</Box>
                  {item.type === "link" ? (
                    <Link 
                      href={item.href} 
                      color="inherit" 
                      underline="hover" 
                      variant="body2"
                    >
                      {item.text}
                    </Link>
                  ) : (
                    <Typography variant="body2">{item.text}</Typography>
                  )}
                </Stack>
              ))}
            </Stack>

            {/* Social Icons */}
            <Stack direction="row" spacing={1}>
              {socialLinks.map((link, index) => (
                <IconButton 
                  key={index} 
                  href={link.href} 
                  size="small" 
                  sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                  {link.icon}
                </IconButton>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;