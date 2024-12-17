interface LanguageLevel {
    language: string;
    level: string;
  }
  
  const LEVELS = ["Beginner", "Intermediate", "Advanced"];
  const LANGUAGES = [
    "Python", "JavaScript", "HTML", "CSS", "Java", "C#", 
    "C", "C++", "SQL", "TypeScript", "PHP", "Swift", 
    "Kotlin", "Rust"
  ];
  
  const LanguageSelector = ({
    selectedLanguages,
    setSelectedLanguages,
    handleLanguageChange,
    handleLevelChange,
  }: {
    selectedLanguages: LanguageLevel[];
    setSelectedLanguages: React.Dispatch<React.SetStateAction<LanguageLevel[]>>;
    handleLanguageChange: (language: string) => void;
    handleLevelChange: (
      arraySetter: React.Dispatch<React.SetStateAction<LanguageLevel[]>>,
      itemKey: string,
      level: string
    ) => void;
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
              onChange={(e) =>
                handleLevelChange(setSelectedLanguages, language, e.target.value)
              }
              value={
                selectedLanguages.find((lang) => lang.language === language)?.level ||
                "Beginner"
              }
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
  
  export default LanguageSelector;
  