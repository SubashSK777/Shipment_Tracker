import React, { useEffect, useState } from "react";
// import data from '../data/dummyData.json';
import Center from "../animated-components/Center";
import Star from "../components/dashboard/Star";
import Sva from "../components/dashboard/Sva";
import LDA from "../components/dashboard/LDA";
import TextField from "@mui/material/TextField";
import { Spin as Hamburger } from "hamburger-react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Api from "../api";
import { CircularProgress, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useSelector, useDispatch } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import { setCurrProd } from "../redux/features/userslice";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import axios from "axios";
import { toast } from "react-toastify";
import ChartComponent from "../components/dashboard/LDA";
import SeasonalVariationChart from "../components/dashboard/Sva";

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
}));

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
    label: "Very Dissatisfied",
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
    label: "Dissatisfied",
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: "Neutral",
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: "Satisfied",
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: "Very Satisfied",
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

const Dashboard = () => {
  const dispatch = useDispatch();
  // const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  // const [data, setData] = useState();
  const [state, setState] = useState(false);
  const prod = useSelector((state) => state.user.currProd);
  // const [loadingLink, setLoadingLink] = useState(false);
  // const [loadingText, setLoadingText] = useState("Fetching Data");

  // const [url, setUrl] = useState("");
  // console.log(data);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     await Api.sendProducts({ email: user.email })
  //       .then((res) => {
  //         console.log(res.data);
  //         setData(res.data.products);
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         // setLoading(false);
  //       });
  //   };
  //   fetchData();
  // }, []);

  // const handleUrl = async () => {
  //   if (!url) {
  //     toast.error("URL cannot be empty");
  //     return;
  //   }
  //   setLoadingLink(true);
  //   const formData = new FormData();
  //   formData.append("url", url);
  //   formData.append("email", user.email);
  //   await axios
  //     .post("http://127.0.0.1:5000/start", formData)
  //     .then((res) => {
  //       console.log(res.data);
  //       dispatch(setCurrProd(res.data));
  //       setLoadingLink(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       toast.error("Error in fetching data");
  //     });
  // };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  return (
    
        <Center>
          <div className="w-full h-full p-4 flex flex-col items-start gap-4">
            <div className="fixed">
              {/* <IconButton>
                <Hamburger
                  size={30}
                  color="black"
                  toggled={state}
                  toggle={setState}
                />
              </IconButton> */}
            </div>
            <>
              {!prod ? (
                <>
                  <div className="w-full flex flex-col items-center justify-center gap-4 text-center font-bold text-3xl">
                    <div>Dashboard</div>
                    <div className="w-[60%] flex items-center gap-2">
                      <TextField
                        label="Enter URL"
                        variant="outlined"
                        fullWidth
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                      <IconButton
                        color="primary"
                        onClick={() => {
                          console.log(url);
                          handleUrl();
                        }}
                      >
                        <SendIcon
                          sx={{
                            fontSize: 40,
                            color: "#33006F",
                          }}
                        />
                      </IconButton>
                    </div>
                  </div>
                 
                  <button></button>
                </>
              ) : (
                <div className="w-full flex flex-col items-center gap-8 justify-center">
                  <div className="flex items-center justify-between p-2 bg-white shadow-xl rounded-xl text-center w-[90%]">
                    <div className="w-[20%]">
                      <img
                        src={prod.image}
                        alt="product"
                        width="100%"
                        className="cursor-pointer"
                        onClick={() => {
                          window.open(prod.url);
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          </div>
        </Center>
    
  );
};

export default Dashboard;
