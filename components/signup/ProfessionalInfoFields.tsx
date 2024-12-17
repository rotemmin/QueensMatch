const ProfessionalInfoFields = ({ handleChange }: { handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div>
      <input type="text" name="job" placeholder="Job Title" onChange={handleChange} />
      <input type="text" name="workplace" placeholder="Workplace" onChange={handleChange} />
      <input type="number" name="experience" placeholder="Years of Experience" onChange={handleChange} />
      <input type="url" name="github" placeholder="GitHub URL" onChange={handleChange} />
      <input type="url" name="linkedin" placeholder="LinkedIn URL" onChange={handleChange} />
    </div>
  );
  
  export default ProfessionalInfoFields;
  