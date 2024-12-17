const BasicInfoFields = ({
    handleChange,
    emailError,
  }: {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    emailError: string | null;
  }) => (
    <div>
      <label>Email *</label>
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      {emailError && <p style={{ color: "red" }}>{emailError}</p>}
  
      <label>Password *</label>
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
  
      <label>First Name *</label>
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        onChange={handleChange}
        required
      />
  
      <label>Last Name *</label>
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        onChange={handleChange}
        required
      />
    </div>
  );
  
  export default BasicInfoFields; // חייב להיות ייצוא ברירת מחדל
  