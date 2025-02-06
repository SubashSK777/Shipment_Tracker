import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TextField, Button, Autocomplete } from "@mui/material";
import {
  EmailOutlined,
  PhoneOutlined,
  LockClockOutlined,
} from "@mui/icons-material";
import Left from "../animated-components/Left";
import Right from "../animated-components/Right";
import Center from "../animated-components/Center";
import DCenter from "../animated-components/DCenter";
import Api from "../api/index.js";


const Bookings = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const ifuser = JSON.parse(localStorage.getItem("user"));
    if (!ifuser) {
      toast.error("Please login to book cargo.");
      navigate("/login");
    }
    setUser(ifuser);
    setFormData({ ...formData, email: ifuser.email });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    from: "",
    to: "",
    height: "",
    width: "",
    breadth: "",
    description: "",
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState("Click to check availability");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDropdownChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.bookCargo(formData);
      if (response.data.proceedToPayment) {
        toast.success(response.data.message);
        toast.success(`Pay ₹${response.data.cost} to proceed.`, {
          autoClose: 10000,
        });
        setMessage("Redirecting to payment...");
        navigate(`/payment/${response.data.bookingID}`);
      } else {
        toast.error("No space available for the specified dimensions.");
      }
    } catch (error) {
      toast.error(error.response?.data.message || "Booking failed. Try again.");
    }
  };

  const [cities, setCities] = useState([]);

  useEffect(() => {
    // Fetch cities from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.cities) {
      setCities(user.cities);
    } else {
      toast.error("Unable to load cities from localStorage.");
    }
  }, []);
  


  return (
    <div className="bg-[#0e1b4d] text-white min-h-screen flex flex-col items-center justify-center">
      <div className="container mx-auto p-10">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 flex flex-col items-start space-y-4">
            <DCenter>
              <h2 className="text-3xl font-bold">Place your order</h2>
            </DCenter>
            <Center>
              <div className="flex items-center space-x-3">
                <EmailOutlined />
                <div>
                  <p className="text-lg">Email</p>
                  <p>contact@logistics.com</p>
                </div>
              </div>
            </Center>
            <Center>
              <div className="flex items-center space-x-3">
                <PhoneOutlined />
                <div>
                  <p className="text-lg">Call Us</p>
                  <p>+91 123 456 7890</p>
                </div>
              </div>
            </Center>
            <Center>
              <div className="flex items-center space-x-3">
                <LockClockOutlined />
                <div>
                  <p className="text-lg">Daily</p>
                  <p>9.00 – 18.00</p>
                </div>
              </div>
            </Center>
          </div>

          <div className="w-full lg:w-2/3 mt-8 lg:mt-0 lg:pl-10">
            <Right>
              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={handleSubmit}
              >
                {/* <TextField
                  label="From"
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#FFF" } }}
                  InputProps={{
                    style: { color: "#FFF", borderColor: "#FFF" },
                  }}
                  className="bg-[#1E2247] border border-white"
                  fullWidth
                  name="from"
                  onChange={handleInputChange}
                />
                <TextField
                  label="To"
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#FFF" } }}
                  InputProps={{
                    style: { color: "#FFF", borderColor: "#FFF" },
                  }}
                  className="bg-[#1E2247] border border-white"
                  fullWidth
                  name="to"
                  onChange={handleInputChange}
                /> */}

                <Autocomplete
                  options={cities}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="From"
                      variant="outlined"
                      InputLabelProps={{ style: { color: "#FFF" } }}
                      InputProps={{
                        ...params.InputProps,
                        style: { color: "#FFF", borderColor: "#FFF" },
                      }}
                      className="bg-[#1E2247] border border-white"
                      fullWidth
                    />
                  )}
                  onChange={(event, value) => handleDropdownChange("from", value)}
                />

                <Autocomplete
                  options={cities}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="To"
                      variant="outlined"
                      InputLabelProps={{ style: { color: "#FFF" } }}
                      InputProps={{
                        ...params.InputProps,
                        style: { color: "#FFF", borderColor: "#FFF" },
                      }}
                      className="bg-[#1E2247] border border-white"
                      fullWidth
                    />
                  )}
                  onChange={(event, value) => handleDropdownChange("to", value)}
                />


                <div className="flex flex-wrap gap-4">
                  <TextField
                    inputProps={{
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      style: { color: "#FFF", borderColor: "#FFF" },
                    }}
                    type="number"
                    label="Height of the Parcel"
                    variant="outlined"
                    InputLabelProps={{ style: { color: "#FFF" } }}
                    className="bg-[#1E2247] border border-white"
                    fullWidth
                    name="height"
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Width of the Parcel"
                    variant="outlined"
                    type="number"
                    InputLabelProps={{ style: { color: "#FFF" } }}
                    InputProps={{
                      style: { color: "#FFF", borderColor: "#FFF" },
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    }}
                    className="bg-[#1E2247] border border-white"
                    fullWidth
                    name="width"
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Breadth of the Parcel"
                    variant="outlined"
                    type="number"
                    InputLabelProps={{ style: { color: "#FFF" } }}
                    InputProps={{
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      style: { color: "#FFF", borderColor: "#FFF" },
                    }}
                    className="bg-[#1E2247] border border-white"
                    fullWidth
                    name="breadth"
                    onChange={handleInputChange}
                  />
                </div>

                <TextField
                  label="Parcel Description"
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#FFF" } }}
                  InputProps={{
                    style: { color: "#FFF", borderColor: "#FFF" },
                  }}
                  className="bg-[#1E2247] border border-white"
                  rows={7}
                  multiline
                  fullWidth
                  name="description"
                  onChange={handleInputChange}
                />
              </form>
            </Right>

            <div className="mt-6">
              <Left>
                <Button
                  variant="contained"
                  className="bg-[#f4b41a] text-white px-8 py-3"
                  onClick={handleSubmit}
                >
                  {message}
                </Button>
              </Left>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Left>
          <div className="text-center mt-16">
            <p>We will send Tracker ID to registered Email</p>
          </div>
        </Left>
      </div>
    </div>
  );
};

export default Bookings;
