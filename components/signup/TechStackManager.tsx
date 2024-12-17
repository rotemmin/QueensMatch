interface TechLevel {
    tech: string;
    level: string;
  }
  
  const LEVELS = ["Beginner", "Intermediate", "Advanced"];
  
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
    handleLevelChange: (
      arraySetter: React.Dispatch<React.SetStateAction<any[]>>,
      itemKey: string,
      level: string
    ) => void;
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
              onChange={(e) =>
                handleLevelChange(setTechStack, item.tech, e.target.value)
              }
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
  
  export default TechStackManager;
  