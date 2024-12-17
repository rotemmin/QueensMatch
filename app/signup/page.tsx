"use client";
import { useState, useRef } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebaseConnection";
import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  job: string;
  workplace: string;
  experience: string;
  github: string;
  linkedin: string;
}

interface LanguageLevel {
  language: string;
  level: string;
}

interface TechLevel {
  tech: string;
  level: string;
}

// Constants
const LANGUAGES = ["Python", "JavaScript", "HTML", "CSS", "Java", "C#", "C", "C++", "SQL", "TypeScript", "PHP", "Swift", "Kotlin", "Rust"];
const AVATAR_OPTIONS = [
  "Frame1.svg", "Frame2.svg", "Frame3.svg", "Frame4.svg",
  "Frame5.svg", "Frame6.svg", "Frame7.svg", "Frame8.svg",
  "Frame9.svg", "Frame10.svg", "Frame11.svg", "Frame12.svg",
  "Frame13.svg", "Frame14.svg", "Frame15.svg", "Frame16.svg"
];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

// Components
const BasicInfoFields = ({ handleChange }: { handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div>
    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
    <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
    <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
    <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
    <input type="text" name="username" placeholder="Username" onChange={handleChange} />
  </div>
);

const ProfessionalInfoFields = ({ handleChange }: { handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div>
    <input type="text" name="job" placeholder="Job Title" onChange={handleChange} />
    <input type="text" name="workplace" placeholder="Workplace" onChange={handleChange} />
    <input type="number" name="experience" placeholder="Years of Experience" onChange={handleChange} />
    <input type="url" name="github" placeholder="GitHub URL" onChange={handleChange} />
    <input type="url" name="linkedin" placeholder="LinkedIn URL" onChange={handleChange} />
  </div>
);

const LanguageSelector = ({
  selectedLanguages,
  setSelectedLanguages,
  handleLanguageChange,
  handleLevelChange
}: {
  selectedLanguages: LanguageLevel[];
  setSelectedLanguages: React.Dispatch<React.SetStateAction<LanguageLevel[]>>;
  handleLanguageChange: (language: string) => void;
  handleLevelChange: (arraySetter: React.Dispatch<React.SetStateAction<any[]>>, itemKey: string, level: string) => void;
}) => (
  <fieldset>
    <legend>Programming Languages</legend>
    {LANGUAGES.map((language) => (
      <div key={language}>
        <label>
          <input
            type="checkbox"
            value={language}
            checked={selectedLanguages.some((lang) => lang.language === language)}
            onChange={() => handleLanguageChange(language)}
          />
          {language}
        </label>
        {selectedLanguages.some((lang) => lang.language === language) && (
          <select
            onChange={(e) => handleLevelChange(setSelectedLanguages, language, e.target.value)}
            value={selectedLanguages.find((lang) => lang.language === language)?.level || "Beginner"}
          >
            {LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        )}
      </div>
    ))}
  </fieldset>
);

const TechStackManager = ({
  techStack,
  setTechStack,
  newTech,
  setNewTech,
  handleAddTech,
  handleLevelChange,
  handleRemoveTech,
}: {
  techStack: TechLevel[];
  setTechStack: React.Dispatch<React.SetStateAction<TechLevel[]>>;
  newTech: string;
  setNewTech: (value: string) => void;
  handleAddTech: () => void;
  handleLevelChange: (arraySetter: React.Dispatch<React.SetStateAction<any[]>>, itemKey: string, level: string) => void;
  handleRemoveTech: (tech: string) => void;
}) => (
  <div>
    <label>Tech Stack:</label>
    <div>
      <input
        type="text"
        placeholder="Add to Tech Stack"
        value={newTech}
        onChange={(e) => setNewTech(e.target.value)}
      />
      <button type="button" onClick={handleAddTech}>
        +
      </button>
    </div>
    <ul>
      {techStack.map((item) => (
        <li key={item.tech}>
          {item.tech}{" "}
          <select
            value={item.level}
            onChange={(e) => handleLevelChange(setTechStack, item.tech, e.target.value)}
          >
            {LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => handleRemoveTech(item.tech)}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  </div>
);

const ImageUploader = ({
    fileInputRef,
    selectedFile,
    selectedAvatar,
    isAvatarMode,
    handleFileChange,
    handleAvatarSelect,
    handleSwitchMode,
  }: {
    fileInputRef: React.RefObject<HTMLInputElement>;
    selectedFile: File | null;
    selectedAvatar: string | null;
    isAvatarMode: boolean;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleAvatarSelect: (avatar: string) => void;
    handleSwitchMode: (mode: 'avatar' | 'upload') => void;
  }) => (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button type="button" onClick={() => handleSwitchMode('upload')}>
          Upload File
        </button>
        <button type="button" onClick={() => handleSwitchMode('avatar')}>
          Choose Avatar
        </button>
      </div>
  
      {isAvatarMode && (
        <fieldset>
          <legend>Choose Avatar</legend>
          <div style={{ display: "flex", gap: "10px" }}>
            {AVATAR_OPTIONS.map((avatar) => (
              <img
                key={avatar}
                src={`/${avatar}`}
                alt={avatar}
                onClick={() => handleAvatarSelect(avatar)}
                style={{
                  width: "50px",
                  height: "50px",
                  border: selectedAvatar === avatar ? "2px solid blue" : "2px solid transparent",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </fieldset>
      )}
  
      {selectedFile && <p>Selected Image: {selectedFile.name}</p>}
      {selectedAvatar && <p>Selected Avatar: {selectedAvatar}</p>}
    </div>
  );

// Main Component
const SignUpPage = () => {
  const storage = getStorage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
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

  const [selectedLanguages, setSelectedLanguages] = useState<LanguageLevel[]>([]);
  const [techStack, setTechStack] = useState<TechLevel[]>([]);
  const [newTech, setNewTech] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isAvatarMode, setIsAvatarMode] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setSelectedAvatar(null);
        setSelectedFile(e.target.files[0]);
        setIsAvatarMode(false);
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

  const handleAddTech = () => {
    if (newTech.trim()) {
      setTechStack((prev) => [...prev, { tech: newTech.trim(), level: "Beginner" }]);
      setNewTech("");
    }
  };

  const handleAvatarSelect = (avatar: string) => {
    setSelectedFile(null);
    setSelectedAvatar(avatar);
  };

  const handleSwitchMode = (mode: 'avatar' | 'upload') => {
    if (mode === 'avatar') {
      setIsAvatarMode(true);
      setSelectedFile(null); 
    } else {
      setIsAvatarMode(false);
      setSelectedAvatar(null); 
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fileInputRef.current?.click();
    }
  };

  const handleLevelChange = (
    arraySetter: React.Dispatch<React.SetStateAction<any[]>>,
    itemKey: string,
    level: string
  ) => {
    arraySetter((prev) =>
      prev.map((item) =>
        item.tech === itemKey || item.language === itemKey
          ? { ...item, level }
          : item
      )
    );
  };

  const handleRemoveTech = (tech: string) => {
    setTechStack((prev) => prev.filter((item) => item.tech !== tech));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Invalid email address!");
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      alert(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      let avatarUrl = "";
      if (selectedFile) {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, selectedFile);
        avatarUrl = await getDownloadURL(storageRef);
      } else if (selectedAvatar) {
        avatarUrl = `/public/${selectedAvatar}`;
      }

      const { email, password, ...additionalData } = formData;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        avatarUrl,
        languages: selectedLanguages,
        techStack: techStack,
        ...additionalData,
      });

      alert("Account created successfully!");
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Sign up failed: " + (error as Error).message);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <BasicInfoFields handleChange={handleChange} />
        
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

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPage;