import React from "react";
import { useDispatch } from "react-redux";
import PageTitle from "components/PageTitle";
import TTSControls from "components/TTSControls";
import { Box, Grid, Typography, Card, CardContent, styled } from "@mui/material";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";


const StyledVideoCard = styled(Card)({
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  overflow: "hidden",
  marginBottom: '8px',
});

const VideoResponsiveContainer = styled(Box)({
  position: "relative",
  width: "100%",
  paddingTop: "56.25%", // 16:9 aspect ratio
  overflow: "hidden",
  borderRadius: "6px",
  "& iframe": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: 0,
  },
});

const SidebarStyled = styled(Grid)({
  position: "sticky",
  top: '16px',
  justifyContent: "center",
  alignSelf: "start",
});

function Home() {
  const dispatch = useDispatch();

  const videos = [
    {
      id: "robot",
      title: "Robot chữa cháy và cứu nạn, cứu hộ",
      src: "https://www.youtube.com/embed/QocEbM-IhN4?si=_jE7_TMiaORTkWTu",
    },
    {
      id: "uav",
      title: "UAV chữa cháy và cứu nạn, cứu hộ",
      src: "https://www.youtube.com/embed/SelIpemhIow?si=DkT0Nt40CohZIqku",
    },
    {
      id: "sensord",
      title: "Thiết bị cảm biến tìm kiếm người bị nạn - Savox LD3",
      src: "https://www.youtube.com/embed/_h4dhKWj4j4?si=TH1I7TCGy7n4WTtk",
      note: "Cảm biến địa chấn: Savox Delsar Life Detector LD3",
    },
    {
      id: "sensorav",
      title: "Thiết bị cảm biến âm thanh/hình ảnh - Savox SC3000",
      src: "https://www.youtube.com/embed/32dxkPw7bDI?si=iQxnxK2OnunEnzLm",
      note: "Cảm biến âm thanh, hình ảnh: Savox SearchCam SC3000",
    },
    {
      id: "gis",
      title: "Hệ thống quản lý, giám sát thông minh trên nền tảng bản đồ số",
      src: "https://www.youtube.com/embed/snO9q1tt68Q?si=-ypFOaqVhNnbaPlh",
    },
  ];



  const VideoCard = ({ v }) => (
    <StyledVideoCard>
      <CardContent sx={{ padding: '12px' }}>
        <Typography variant="h5" component="h4" sx={{ mb: 1 }}>
          {v.title}
        </Typography>
        {v.note && (
          <Typography variant="subtitle2" component="h5" color="text.secondary" sx={{ mb: 1 }}>
            {v.note}
          </Typography>
        )}
        <VideoResponsiveContainer>
          <iframe
            src={v.src}
            title={v.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </VideoResponsiveContainer>
      </CardContent>
    </StyledVideoCard>
  );

  return (
    <Box onMouseOver={() => dispatch(closeSubMenu())} sx={{ flexGrow: 1, p: '16px' }}>
      <PageTitle title="Trang chủ" />
      <Grid container spacing={2} sx={{ mt: '16px' }}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: '16px' }}>
            {videos.map((v) => (
              <VideoCard v={v} key={v.id} />
            ))}
          </Box>
        </Grid>
        <SidebarStyled item xs={12} md={4}>
          <Box sx={{ mb: '16px' }}>
            <TTSControls />
          </Box>
          <StyledVideoCard>
            <CardContent sx={{ padding: '12px' }}>
              <Typography variant="h6" component="h4" sx={{ mb: 1 }}>
                Tài liệu & Liên kết
              </Typography>
              <ul>
                <li>
                  <a href="/thuvien/tspl">Tủ sách pháp luật</a>
                </li>
                <li>
                  <a href="/thuvien/tlnv">Tài liệu nghiệp vụ</a>
                </li>
                <li>
                  <a href="/phuongtien/huhong">Báo cáo phương tiện hư hỏng</a>
                </li>
              </ul>
            </CardContent>
          </StyledVideoCard>
        </SidebarStyled>
      </Grid>
    </Box>
  );
}

export default Home;
