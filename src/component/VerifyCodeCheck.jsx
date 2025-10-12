import { useRef, useState } from "react";

const OTPInput = ({ length = 6, onChangeOTP }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    onChangeOTP?.(newOtp.join(""));

    // move focus to next input automatically
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(paste)) return;

    const digits = paste.split("").slice(0, length);
    const newOtp = [...otp];
    digits.forEach((d, i) => {
      newOtp[i] = d;
    });
    setOtp(newOtp);
    onChangeOTP?.(newOtp.join(""));

    // focus last filled box
    const lastIndex = digits.length < length ? digits.length : length - 1;
    inputRefs.current[lastIndex].focus();
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {otp.map((digit, i) => (
        <input
          key={i}
          type="text"
          value={digit}
          ref={(el) => (inputRefs.current[i] = el)}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          maxLength={1}
          style={{
            width: "40px",
            height: "50px",
            textAlign: "center",
            fontSize: "24px",
            border: "2px solid #ccc",
            borderRadius: "8px",
          }}
        />
      ))}
    </div>
  );
};

export default OTPInput;
