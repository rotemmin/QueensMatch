"use client";
import { useState, useRef } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@lib/firebase/Connection";
import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { LanguageLevel, TechLevel } from "@/types";
import TechStackManager from "@components/signup/TechStackManager";


import BasicInfoFields from "@components/signup/BasicInfoFields";
import ProfessionalInfoFields from "@components/signup/ProfessionalInfoFields";
import ImageUploader from "@components/signup/ImageUploader";
import LanguageSelector from "@components/signup/LanguageSelector";

const storage = getStorage();

const SignUpPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
    job: "",
    workplace: "",
    experience: "",
    github: "",
    linkedin: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isAvatarMode, setIsAvatarMode] = useState<boolean>(false);
  const [selectedLanguages, setSelectedLanguages] = useState<LanguageLevel[]>([]);
  const [techStack, setTechStack] = useState<TechLevel[]>([]);
  const [newTech, setNewTech] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordHints, setPasswordHints] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailRegex.test(value) ? null : "Invalid email format");
    }

    if (name === "password") {
      validatePassword(value);
    }
    
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    setSelectedFile(null); // במידה ונבחר אווטאר, לא צריך את ה-file
  };
  
  const handleSwitchMode = (mode: "avatar" | "upload") => {
    if (mode === "avatar") {
      setIsAvatarMode(true);
      setSelectedFile(null);
    } else {
      setIsAvatarMode(false);
      setSelectedAvatar(null);
      fileInputRef.current?.click();
    }
  };

  const handleLanguageChange = (language: string) => {
    const exists = selectedLanguages.find((lang) => lang.language === language);
    if (exists) {
      setSelectedLanguages((prev) => prev.filter((lang) => lang.language !== language));
    } else {
      setSelectedLanguages((prev) => [...prev, { language, level: "Beginner" }]);
    }
  };
  
  const handleLevelChange = (
    arraySetter: React.Dispatch<React.SetStateAction<LanguageLevel[]>>,
    itemKey: string,
    level: string
  ) => {
    arraySetter((prev) =>
      prev.map((item) =>
        item.language === itemKey ? { ...item, level } : item
      )
    );
  };

  const handleAddTech = () => {
    if (newTech.trim()) {
      setTechStack((prev) => [...prev, { tech: newTech.trim(), level: "Beginner" }]);
      setNewTech("");
    }
  };
  
  const handleRemoveTech = (tech: string) => {
    setTechStack((prev) => prev.filter((item) => item.tech !== tech));
  };

  const validatePassword = (password: string) => {
    setPasswordHints({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    });
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password, firstName, lastName } = formData;
  
    // בדיקה לשדות החובה
    if (!email || !password || !firstName || !lastName || (!selectedFile && !selectedAvatar)) {
      alert("Email, password, first name, last name, and avatar are required!");
      return;
    }
  
    if (emailError) {
      alert("Please fix the email format before submitting.");
      return;
    }
  
    // בדיקה לחוזק הסיסמה
    if (Object.values(passwordHints).includes(false)) {
      alert("Password does not meet the required criteria.");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      let avatarUrl = "";
      if (selectedFile) {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, selectedFile);
        avatarUrl = await getDownloadURL(storageRef);
      } else if (selectedAvatar) {
        avatarUrl = `/avatars/${selectedAvatar}`;
      }
  
      await setDoc(doc(db, "users", user.uid), {
        email,
        firstName,
        lastName,
        avatarUrl,
      });
  
      alert("Account created successfully!");
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Sign up failed: " + (error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <BasicInfoFields
        handleChange={handleChange}
        emailError={emailError}
      />

      <div>
        <p>Password must include:</p>
        <ul>
          <li style={{ color: passwordHints.length ? "green" : "red" }}>At least 8 characters</li>
          <li style={{ color: passwordHints.uppercase ? "green" : "red" }}>At least one uppercase letter</li>
          <li style={{ color: passwordHints.lowercase ? "green" : "red" }}>At least one lowercase letter</li>
          <li style={{ color: passwordHints.number ? "green" : "red" }}>At least one number</li>
          <li style={{ color: passwordHints.specialChar ? "green" : "red" }}>At least one special character (@$!%*?&)</li>
        </ul>
      </div>

      <ProfessionalInfoFields handleChange={handleChange} />
      <ImageUploader
        fileInputRef={fileInputRef}
        selectedFile={selectedFile}
        selectedAvatar={selectedAvatar}
        isAvatarMode={isAvatarMode}
        handleFileChange={handleFileChange}
        handleAvatarSelect={handleAvatarSelect}
        handleSwitchMode={handleSwitchMode}
        />
      <LanguageSelector
        selectedLanguages={selectedLanguages}
        setSelectedLanguages={setSelectedLanguages}
        handleLanguageChange={handleLanguageChange}
        handleLevelChange={handleLevelChange}
      />
      <TechStackManager
        techStack={techStack}
        setTechStack={setTechStack}
        newTech={newTech}
        setNewTech={setNewTech}
        handleAddTech={handleAddTech}
        handleLevelChange={handleLevelChange}
        handleRemoveTech={handleRemoveTech}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUpPage;
