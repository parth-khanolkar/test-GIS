"use client";

import React, { useEffect, useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import jwt_decode from "jwt-decode";
import axios from "axios";
import Image from "next/image";
import logo from "../../assets/images/logo.png";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";
import { useInfoContext } from "@/context/info";
import ForgotPassEmailModal from "@/components/UserAuth/ForgotPassEmailModal";
import HomePage from "..";
import { toast } from "react-toastify";

const LoginPage = () => {
  const router = useRouter();
  const { uid, setUid } = useInfoContext();

  const [isLogin, setIsLogin] = useState(true);

  const [ isLoading,setIsLoading ] = useState(false);
  const [ isOTPFieldVisible,setIsOTPFieldVisible ] = useState(false);
  const [ isGenerateOTPDisabled,setIsGenerateOTPDisabled ] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [OTPMatch, setOTPMatch] = useState(true);

  const [GeneratedOTP, setGeneratedOTP] = useState(123456);
  const [userOTPInput, setUserOTPInput] = useState("");

  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [OTPGenerationMessage, setOTPGenerationMessage] = useState(false);

  const [forgotType,setForgotType] = useState("password");
  const [isForgotPassEmailModalOpen,setIsForgotPassEmailModalOpen] = useState(false);
  const openForgotPassEmailModal = () => {
    setIsForgotPassEmailModalOpen(true);
  }
  const closeForgotPassEmailModal = () => {
    setIsForgotPassEmailModalOpen(false);
  }

  const handleOTPDisabling = () => {
    setIsGenerateOTPDisabled(true);

    // Countdown logic
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Enable the button after 30 seconds
    setTimeout(() => {
      clearInterval(intervalId);
      setIsGenerateOTPDisabled(false);
      setCountdown(30);
    }, 30000);
  };

  const handleLogInSubmit = async () => {
    setIncorrectPassword(false);
    setIsLoading(true);
    try {
      const result = await axios.post("/api/loginPage/getUser", {
        email: email,
        password: password,
      });
      
      setUid(result.data.UserId);
      window.localStorage.setItem("UserId", result.data.UserId);
      window.localStorage.setItem("UserEmail", result.data.UserEmail);
      window.localStorage.setItem("UserName", result.data.FullName);
      setIsLoading(false);
      router.push("/");
    } catch (error) {
      setIncorrectPassword(true);
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async () => {
    setOTPMatch(true);
    setPasswordsMatch(true);
    setIsLoading(true);
    
    if (password === confirmPassword) {
      if (userOTPInput == GeneratedOTP) {
        try {
          const result = await axios.post("/api/loginPage/addUser", {
            fullname: username,
            email: email,
            password: password,
          });
          
          setUid(result.data.UserId);
          window.localStorage.setItem("UserId", result.data.UserId);
          window.localStorage.setItem("UserEmail", email);
          window.localStorage.setItem("UserName", username);
          router.push("/");


          setIsLoading(false);
        } catch (error) {
          toast.error('Email already registered.', {
            position: "bottom-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light",
          });
          setIsLoading(false);
          console.log(error);
        }
      } else {
        setIsLoading(false);
        setOTPMatch(false);
        return;
      }
    } else {
      setIsLoading(false);
      setPasswordsMatch(false);
    }
  };

  const handleOTPGeneration = async () => {
    setPasswordsMatch(true);
    setOTPGenerationMessage(false);
    if(password === confirmPassword){
      const NewOTP = Math.floor(100000 + Math.random() * 900000);
      setGeneratedOTP(NewOTP);
      try {
        const result = await axios.post("https://transcriptanalyser.com/gis/send_otp_new",{
            email_id: email,
            otp: NewOTP.toString(),
          }
        );
        handleOTPDisabling();
        setOTPGenerationMessage(true);
        setIsOTPFieldVisible(true);
      } catch (error) {
        console.log(error);
      }
    } else {
      setPasswordsMatch(false);
    }
  };

  const GoogleLoginHandler = async (credentialResponse) => {
    setIsLoading(true);
    let userdata = jwt_decode(credentialResponse.credential);
    window.localStorage.setItem("UserEmail", userdata.email);
    window.localStorage.setItem(
      "UserName",
      userdata.given_name + " " + userdata.family_name
    );

    try {
      const result = await axios.post("/api/loginPage/getGoogleuser", {
        fullname: userdata.given_name + " " + userdata.family_name,
        email: userdata.email,
      });

      setUid(result.data.UserId);
      window.localStorage.setItem("UserId", result.data.UserId);
      if (result?.signedUp) {
        router.push("/");
        return;
      }
      router.push("/");
    } catch (error) {
      toast.error('Error fetching data from Google. Please try again.', {
        position: "bottom-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (uid !== -1) {
      router.push('/');
    }
  }, [uid, router]);

  return (
    <>
      <div className="md:h-[calc(100vh-43px)] overflow-y-auto overflow-x-hidden bg-gray-50 flex items-center justify-center">
        {
          isLogin ? (<>
            <div className="bg-gray-100 flex flex-col md:flex-row rounded-2xl shadow-lg max-w-3xl p-5 items-center">
              <Image
                src={logo}
                alt="Logo"
                height="300"
                width="300"
                className="hidden md:block p-10"
              />
              <Image
                src={logo}
                alt="Logo"
                height="225"
                width="225"
                className="md:hidden p-10"
              />

              <div className="px-8 md:px-16 md:border-l md:border-gray-400">
                <h2 className="font-bold text-2xl text-[#002D74] flex justify-center">
                  {"Log In"}
                </h2>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={(e)=>{
                    e.preventDefault();
                    handleLogInSubmit();
                  }}
                >
                  <input
                    required
                    className="p-2 mt-8 rounded-xl border"
                    type="email"
                    name="email"
                    placeholder="Email ID"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />

                  <input
                    required
                    className="p-2 rounded-xl border"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />

                  {incorrectPassword ? (
                    <span className="text-red-700">
                      {"Invalid email id or password!"}
                    </span>
                  ) : (
                    <></>
                  )}

                  <button
                    type="submit"
                    className="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300"
                  >
                    {"Login"}
                  </button>
                </form>

                <div className="my-6 grid grid-cols-3 items-center text-gray-500">
                  <hr className="border-gray-400" />
                  <p className="text-center text-sm">OR</p>
                  <hr className="border-gray-400" />
                </div>

                <div className="w-full flex items-center justify-center">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      GoogleLoginHandler(credentialResponse);
                    }}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                  />
                </div>

                <hr className="border-gray-400 mt-6" />

                <div className="mt-3 text-xs flex justify-between items-center text-[#002D74]">
                  <p>{"Don't have an account?"}</p>
                  <button
                    className="py-2 px-3 bg-white border font-semibold text-sm rounded-xl hover:scale-110 duration-300"
                    onClick={() => {
                      setIsLogin(false);
                      setEmail("");
                      setPassword("");
                      setUsername("");
                    }}
                  >
                    {"Sign Up"}
                  </button>
                </div>

                <div className="mt-2 text-xs  py-4 text-[#002D74] flex flex-col gap-1.5">
                  <button className="hover:underline"
                    onClick={()=>{
                      setForgotType("password")
                      openForgotPassEmailModal();
                    }}
                  >
                    {"Forgot your password?"}
                  </button>
                  <button className="hover:underline"
                    onClick={()=>{
                      setForgotType("email")
                      openForgotPassEmailModal();
                    }}
                  >
                    {"Forgot your email?"}
                  </button>
                </div>
              </div>
            </div>
          </>) : (<>
            <div className="bg-gray-100 flex flex-col md:flex-row rounded-2xl shadow-lg max-w-3xl p-5 items-center">
              <Image
                src={logo}
                alt="Logo"
                height="300"
                width="300"
                className="hidden md:block p-10"
              />
              <Image
                src={logo}
                alt="Logo"
                height="225"
                width="225"
                className="md:hidden p-10"
              />

              <div className="px-8 md:px-16 md:border-l md:border-gray-400">
                <h2 className="font-bold text-2xl text-[#002D74] flex justify-center">
                  {"Sign Up"}
                </h2>

                {/* OTP Generation */}
                <form
                  className="flex flex-col gap-4"
                  onSubmit={(e)=>{
                    e.preventDefault();
                    handleOTPGeneration();
                  }}
                >
                  <input
                    required
                    className="p-2 mt-8 rounded-xl border"
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />

                  <input
                    required
                    className="p-2 rounded-xl border"
                    type="email"
                    name="email"
                    placeholder="Email ID"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <input
                    required
                    className="p-2 rounded-xl border"
                    type="password"
                    name="Password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <input
                    required
                    className="p-2 rounded-xl border"
                    type="password"
                    name="ConfirmPassword"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                  />

                  <button
                    type="submit"
                    disabled={isGenerateOTPDisabled}
                    className="bg-[#002D74] rounded-xl text-white py-2 enabled:hover:scale-105 duration-300 disabled:bg-gray-600"
                  >
                    {"Generate OTP"}
                  </button>
                </form>
                {passwordsMatch ? (<>
                      {
                        OTPGenerationMessage ? (
                          <div className="flex flex-col gap-1 items-center justify-center">
                            <div className="flex justify-center text-green-700 font-semibold mt-2">
                              {`OTP generated. Check Email.`}
                            </div>
                            <div className={`flex justify-center text-gray-700 font-semibold
                              ${
                               !isGenerateOTPDisabled  && "hidden"
                              }`}>
                              {` Resend OTP in ${countdown}s`}
                            </div>
                          </div>
                        ) : (
                          <></>
                        )
                      }
                    </>) : (
                      <div className="flex justify-center text-red-700 mt-2">
                        {"Passwords don't match!"}
                      </div>
                  )
                }

                {
                  isOTPFieldVisible && 
                  <form
                    className="flex flex-col gap-4 mt-4"
                    onSubmit={(e)=>{
                      e.preventDefault();
                      handleSignUpSubmit()
                    }}
                  >
                    <input
                      required
                      className="p-2 rounded-xl border"
                      type="password"
                      name="OTP"
                      placeholder="OTP"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      inputMode="numeric"
                      autoComplete="off"
                      value={userOTPInput}
                      onChange={(e) => {
                        const input = e.target.value;
                        if (/^[0-9]*$/.test(input) && input.length <= 6) {
                          setUserOTPInput(input);
                        }
                      }}
                    />
                    {OTPMatch ? (
                      <></>
                    ) : (
                      <div className="flex justify-center text-red-700">
                        {"Invalid OTP!"}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300"
                    >
                      {" Sign Up"}
                    </button>
                  </form>
                }

                <div className="my-6 grid grid-cols-3 items-center text-gray-500">
                  <hr className="border-gray-400" />
                  <p className="text-center text-sm">OR</p>
                  <hr className="border-gray-400" />
                </div>

                <div className="w-full flex items-center justify-center">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      // console.log(jwt_decode(credentialResponse.credential));
                    }}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                  />
                </div>

                <div className="mt-3 text-xs flex justify-between items-center text-[#002D74]">
                  <p>{"Already have an account?"}</p>
                  <button
                    className="py-2 px-3 bg-white border rounded-xl hover:scale-110 duration-300"
                    onClick={() => {
                      setIsLogin(true);
                      setIncorrectPassword(false);
                      setEmail("");
                      setPassword("");
                      setUsername("");
                      setConfirmPassword("");
                    }}
                  >
                    {"Log In"}
                  </button>
                </div>
              </div>
            </div>
          </>)
        }
      </div>
      {
        isLoading && (
          <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center" style={{zIndex:9999}}>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="flex items-center justify-center h-[5vh] gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse [animation-delay:-0.3s] bg-black" style={{ animationDuration: '0.8s' }}></div>
                  <div className="w-2 h-2 rounded-full animate-pulse [animation-delay:-0.15s] bg-black" style={{ animationDuration: '0.8s' }}></div>
                  <div className="w-2 h-2 rounded-full animate-pulse bg-black" style={{ animationDuration: '0.8s' }}></div>
              </div>
            </div>
          </div>
        )
      }


      <ForgotPassEmailModal isOpen={isForgotPassEmailModalOpen} closeModal={closeForgotPassEmailModal} type={forgotType} />
    </>
  );
};

export default LoginPage;
