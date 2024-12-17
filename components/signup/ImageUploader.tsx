import { AVATAR_OPTIONS } from "@/types";
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
    handleSwitchMode: (mode: "avatar" | "upload") => void;
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
        <button type="button" onClick={() => handleSwitchMode("upload")}>
          Upload File
        </button>
        <button type="button" onClick={() => handleSwitchMode("avatar")}>
          Choose Avatar
        </button>
      </div>
  
      {/* הצגת האווטארים כאשר במצב בחירת אווטאר */}
      {isAvatarMode && (
        <fieldset>
          <legend>Choose an Avatar</legend>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {AVATAR_OPTIONS.map((avatar) => (
              <img
                key={avatar}
                src={`/avatars/${avatar}`} // נתיב לתמונות האווטארים
                alt={avatar}
                onClick={() => handleAvatarSelect(avatar)} // בחירת אווטאר
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
      {!selectedAvatar && !selectedFile && (
        <p style={{ color: "red" }}>Avatar is required *</p>
      )}
      {/* הצגת שם הקובץ או האווטאר שנבחר */}
      {selectedFile && <p>Selected Image: {selectedFile.name}</p>}
      {selectedAvatar && <p>Selected Avatar: {selectedAvatar}</p>}
    </div>
  );
  
  export default ImageUploader;
  