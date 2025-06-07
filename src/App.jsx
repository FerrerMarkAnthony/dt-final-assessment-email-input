import { useEffect, useState } from "react";
import { getData } from "./services/emails";
import "../src/styles/global.css";
import { IoCloseOutline } from "react-icons/io5";
import { FaExclamation } from "react-icons/fa";

function App() {
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchEmails() {
      const result = await getData("emails");
      setData(result);
    }

    fetchEmails();
  }, []);

  const handleStoreEmail = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const email = value.trim().replace(/,$/, "");
      if (email && !emails.includes(email)) {
        setEmails([...emails, email]);
        setValue("");
      }
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleClick = (email) => {
    const emailExists = emails.includes(email);
    if (!emailExists) {
      const newEmails = [...emails, email];
      setEmails(newEmails);
      setValue("");
    }
  };

  const filteredSuggestions = data.filter((data) => {
    const lowerData = data.toLowerCase();
    const lowerValue = value.toLowerCase();

    const matchesSearch = lowerData.includes(lowerValue);
    const notAlreadyAdded = !emails.includes(data);
    return matchesSearch && notAlreadyAdded;
  });

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <>
      <div className="text-sm flex gap-2 flex-wrap items-center border-none p-2 relative bg-white rounded-md max-w-2xl">
        {emails.map((email, index) => {
          const valid = isValidEmail(email);

          return (
            <div
              key={index}
              className={`p-2 rounded text-xs flex items-center font-semibold ${
                valid ? "bg-[#EDEDED] gap-2" : "bg-red-300 gap-1"
              }`}
            >
              {email}
              {!valid && <FaExclamation className="text-red-700" />}
              <IoCloseOutline
                size={13}
                className="cursor-pointer"
                onClick={() => setEmails(emails.filter((_, i) => i !== index))}
              />
            </div>
          );
        })}
        {emails.length === 0 && value === "" && (
          <span className="text-gray-400 absolute left-3 pointer-events-none">
            Enter recipients...
          </span>
        )}
        <div>
          <input
            type="email"
            className="outline-none w-[230px] relative"
            value={value}
            onChange={handleChange}
            onKeyDown={handleStoreEmail}
          />

          {value && filteredSuggestions.length > 0 && (
            <div className="border-none mt-2 rounded-md bg-white w-[300px] shadow-lg max-h-[200px] overflow-y-auto absolute ">
              <ul>
                {filteredSuggestions.map((email, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleClick(email)}
                  >
                    {email}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
