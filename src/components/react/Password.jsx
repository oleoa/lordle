import { useState } from "react";
import See from "../../assets/see.svg";
import Unsee from "../../assets/unsee.svg";

export default function PasswordInput() {
  const [see, setSee] = useState(false);
  return (
    <div className="w-full relative">
      <input
        type={see ? "text" : "password"}
        name="password"
        placeholder="Password"
      />
      <button
        type="button"
        onClick={() => setSee((s) => !s)}
        className="absolute right-0 top-0 h-full px-4"
      >
        <img src={see ? Unsee.src : See.src} className="w-6" />
      </button>
    </div>
  );
}
