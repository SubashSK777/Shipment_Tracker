import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Api from "../api";
import { Container, Typography, Button, Box, CircularProgress, IconButton } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard"; // Credit Card Icon
import PayPalIcon from "@mui/icons-material/Payment"; // PayPal Icon
import QRCode from "react-qr-code"; // QR Code Library for generating barcode/QR Code

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await Api.makePayment(bookingId);

      if (response.status === 200) {
        setPaymentStatus("Payment Successful!");
        toast.success(response.data.message);
        navigate("/profile");
      } else {
        setPaymentStatus("Payment Failed.");
        toast.error(response.data.message);
      }
    } catch (error) {
      setPaymentStatus("Payment Failed. Try again.");
      toast.error(error.message);
      console.error("Payment Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { name: "Credit Card", icon: <CreditCardIcon /> },
    { name: "PayPal", icon: <PayPalIcon /> },
  ];

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", my: 8 }}>
      <Typography variant="h4" gutterBottom>
        Payment Page
      </Typography>
      <Typography variant="body1" gutterBottom>
        Booking ID: <strong>{bookingId}</strong>
      </Typography>

      {/* Payment Method Selection */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
        {paymentMethods.map((method, index) => (
          <Button
            key={index}
            variant={selectedPaymentMethod === method.name ? "contained" : "outlined"}
            color="primary"
            onClick={() => setSelectedPaymentMethod(method.name)}
            size="large"
            startIcon={method.icon}
          >
            {method.name}
          </Button>
        ))}
      </Box>

      {/* QR Code for Payment (e.g., UPI or Mobile Payment) */}
      {selectedPaymentMethod === "PayPal" && (
        <Box 
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"

        
         sx={{ mt: 4 }}>
          <Typography variant="body1">Scan the QR code to pay via PayPal:</Typography>
          <QRCode value={`https://paypal.com/${bookingId}`}   />
        </Box>
      )}

      {/* Proceed to Payment Button */}
      <Box sx={{ mt: 4 }}>
        {!isProcessing ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handlePayment}
            size="large"
            sx={{ px: 4, py: 1 }}
          >
            <CreditCardIcon sx={{ mr: 1 }} /> Proceed to Payment
          </Button>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography variant="body1">Processing Payment...</Typography>
          </Box>
        )}
      </Box>

      {/* Payment Status */}
      {paymentStatus && (
        <Typography
          variant="body1"
          sx={{
            mt: 3,
            color: paymentStatus.includes("Successful") ? "green" : "red",
          }}
        >
          {paymentStatus}
        </Typography>
      )}
    </Container>
  );
};

export default Payment;
