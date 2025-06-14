import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Lock, LogOut, Save, Shield, UserCircle } from "lucide-react";
import {
  BACK_BUTTON,
  DANGER_BTN,
  FULL_BUTTON,
  INPUT_WRAPPER,
  personalFields,
  SECTION_WRAPPER,
  securityFields,
} from "../assets/dummy"; // Adjust the path as needed
import axios from "axios";

const API_URl = "http://localhost:4000";
export const Profile = ({ setCurrentUser, onLogout }) => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }
    axios
      .get(`${API_URl}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        if (data.success) {
          setProfile({
            name: data.user.name,
            email: data.user.email,
          });
        } else {
          toast.error(data.message);
        }
      })
      .catch(() => toast.error("unable to load profile "));
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_URl}/api/user/profile`,
        {
          name: profile.name,
          email: profile.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        setCurrentUser((prev) => ({
          ...prev,
          name: profile.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile.name
          )}&background=random`,
        }));
        toast.success("profile updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "pofile updatation failed!");
    }
  };

  const changePassword = async (e) =>{
    e.preventDefault();
    if(passwords.new !== passwords.confirm){
        return toast.error("password do not match")
    }

    try {
        const token = localStorage.getItem("token")

        const {data} = await axios.put(`${API_URl}/api/user/password`,
            {currentPassword:passwords.current,newPassword :passwords.new},
            {headers:{Authorization :`Bearer ${token}`}}
        )
        if(data.success){
            toast.success("password updated successfully")
            setPasswords({
                current:"",
                new:"",
                confirm:""
            })
        }else toast.error(data.message)

    } catch (err) {
      toast.error(err.response?.data?.message || "password updatation failed!");
    }

  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        // hideProgressBar
        // closeOnClick
        // pauseOnHover
        // draggable
      />
      <div className="max-w-4xl mx-auto p-6">
        <button onClick={() => navigate(-1)} className={BACK_BUTTON}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-16 h-16 rounded-full 
                bg-gradient-to-br from-fuchsia-500 to-purple-600 
                flex items-center justify-center
                 text-white text-2xl font-bold shadow-md"
          >
            {profile.name ? profile.name[0].toUpperCase() : "U"}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Account Settings
            </h1>
            <p className="text-gray-500 text-sm">Manage your profile</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <section className={SECTION_WRAPPER}>
            <div className="flex items-center gap-2 mb-6">
              <UserCircle className="text-purple-500 w-5 h-5" />
              <h2 className="text-xl font-semibold text-gray-800">
                Personal Information
              </h2>
            </div>
            {/* personal information name email */}
            <form onSubmit={saveProfile} className="space-y-4">
              {personalFields.map(({ name, type, placeholder, icon: Icon }) => (
                <div key={name} className={INPUT_WRAPPER}>
                  <Icon className="text-purple-500 w-5 h-5 mr-2" />
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={profile[name]}
                    onChange={(e) =>
                      setProfile({ ...profile, [name]: e.target.value })
                    }
                    className="w-full focus:outline-none text-sm"
                    required
                  />
                </div>
              ))}
              <button className={FULL_BUTTON}>
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </form>
          </section>

          <section className={SECTION_WRAPPER}>
            <div className="flex items-center gap-2 mb-6">
              <Shield className="text-purple-500 w-5 h-5" />
              <h2 className="text-xl font-semibold text-gray-800">Security</h2>
            </div>

            <form onSubmit={changePassword} className="space-y-4">
              {securityFields.map(({ name, placeholder }) => (
                <div key={name} className={INPUT_WRAPPER}>
                  <Lock className="text-purple-500 w-5 h-5 mr-2" />
                  <input
                    type="password"
                    placeholder={placeholder}
                    value={passwords[name]}
                    onChange={(e) =>
                      setPasswords({ ...passwords, [name]: e.target.value })
                    }
                    className="w-full focus:outline-none text-sm"
                    required
                  />
                </div>
              ))}
              <button className={FULL_BUTTON}>
                <Shield className="w-4 h-4" /> Change Password
              </button>

              <div className="mt-8 pt-6 border-t
              border-purple-100">
                <h3 className="text-red-600 font-semibold
                mb-4 flex items-center
                gap-2">
                    <LogOut className="w-4 h-4" />
                    Danger Zone

                </h3>
                <button className={DANGER_BTN} 
                onClick={onLogout}>
                    Logout
                </button>
              </div>
              
            </form>
          </section>

        </div>
      </div>
    </div>
  );
};
