import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Lock, ArrowRight, Shield, CheckCircle } from "lucide-react";
import axios from "axios";
export default function LoginPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Mobile Input, 2: OTP Verification
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [resendTimer, setResendTimer] = useState(0);

    // Start countdown timer for resend OTP
    const startResendTimer = () => {
        setResendTimer(60);
        const interval = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Step 1: Send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();

        // Validate mobile number
        if (!mobile || mobile.length !== 10) {
            setMessage({ type: "error", text: "Please enter a valid 10-digit mobile number" });
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/customer/auth/send-otp`,
                { phone: mobile }
            );

            if (response.data.success) {

                setMessage({ type: "success", text: `OTP sent successfully to your mobile number! otp is ${response.data.otp}` });
                setStep(2);
                startResendTimer();
            }
        } catch (error) {
            console.error("Send OTP Error:", error);
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Failed to send OTP. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            setMessage({ type: "error", text: "Please enter a valid 6-digit OTP" });
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/customer/auth/verify-otp`,
                {
                    phone: mobile,
                    otp: otp
                }
            );

            if (response.data.success) {
                // Store token and admin info
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.customer));
                localStorage.setItem("cart", JSON.stringify(response.data.customer.carts));


                // Store login timestamp for auto-logout (7 days)
                localStorage.setItem("loginTime", Date.now().toString());

                setMessage({ type: "success", text: "Login successful! Redirecting..." });
                setTimeout(() => navigate("/"), 1000);
            }
        } catch (error) {
            console.error("Verify OTP Error:", error);
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Invalid OTP. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        if (resendTimer > 0) return;

        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/customer/resend-otp`,
                { phone: mobile }
            );

            if (response.data.success) {
                setMessage({ type: "success", text: `OTP resent successfully! otp is ${response.data.otp}` });
                setOtp("");
                startResendTimer();
            }
        } catch (error) {
            console.error("Resend OTP Error:", error);
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Failed to resend OTP."
            });
        } finally {
            setLoading(false);
        }
    };

    // Go back to mobile input
    const handleBackToMobile = () => {
        setStep(1);
        setOtp("");
        setMessage({ type: "", text: "" });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center ">
            <div className="w-full ">


                <section
                    id="home"
                    className="relative max-w-7xl mx-auto text-white py-32 overflow-hidden min-h-[400px]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(15,23,43,.9),rgba(15,23,43,.9)), url('/hero-bg.jpg')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    <div className="container mx-auto px-4 text-center gap-10">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center leading-tight">
                            Sign In
                        </h1>
                    </div>
                </section>
                {/* Hero Section */}

                <div className="w-full mb-8 max-w-md mx-auto">
                    <div className="text-center my-2 ">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Customer Login
                        </h1>
                        <p className="text-gray-600">
                            {step === 1
                                ? "Enter your mobile number to receive OTP"
                                : "Enter the OTP sent to your mobile"}
                        </p>
                    </div>

                    {/* Login Form Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                        {/* Step 1: Mobile Number Input */}
                        {step === 1 && (
                            <form onSubmit={handleSendOTP} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Mobile Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            value={mobile}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "");
                                                if (value.length <= 10) {
                                                    setMobile(value);
                                                }
                                            }}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                                            placeholder="Enter 10-digit mobile number"
                                            maxLength="10"
                                            required
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        We'll send you a 6-digit OTP for verification
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || mobile.length !== 10}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            <span>Sending OTP...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Send OTP</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Step 2: OTP Verification */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        OTP sent to <span className="font-semibold text-gray-900">+91 {mobile}</span>
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleBackToMobile}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-1"
                                    >
                                        Change Number
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Enter OTP
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "");
                                                if (value.length <= 6) {
                                                    setOtp(value);
                                                }
                                            }}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg tracking-widest text-center font-semibold"
                                            placeholder="Enter 6-digit OTP"
                                            maxLength="6"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            <span>Verifying...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Verify & Login</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                {/* Resend OTP */}
                                <div className="text-center">
                                    {resendTimer > 0 ? (
                                        <p className="text-sm text-gray-500">
                                            Resend OTP in <span className="font-semibold text-blue-600">{resendTimer}s</span>
                                        </p>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleResendOTP}
                                            disabled={loading}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-semibold disabled:opacity-50"
                                        >
                                            Resend OTP
                                        </button>
                                    )}
                                </div>
                            </form>
                        )}

                        {/* Message Display */}
                        {message.text && (
                            <div
                                className={`mt-6 p-4 rounded-xl border-2 ${message.type === "success"
                                    ? "bg-green-50 border-green-200 text-green-800"
                                    : "bg-red-50 border-red-200 text-red-800"
                                    }`}
                            >
                                <p className="text-sm font-medium text-center">{message.text}</p>
                            </div>
                        )}
                    </div>
                </div>


                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        Secure admin authentication powered by OTP verification
                    </p>
                </div>
            </div>
        </div>
    );
}