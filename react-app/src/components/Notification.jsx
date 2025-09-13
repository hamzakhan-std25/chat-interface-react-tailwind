import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

export default function Notification({ id, message, remove, index }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {


    const timer = setTimeout(() => {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
        setTimeout(() => remove(id), 500); // wait for animation
      }, 4000);
    }, 200); // show for 4s
    return () => clearTimeout(timer);


  }, [id, remove]);

  return (
    <div
      className={`fixed transition-all duration-500 ease-in-out flex justify-between items-center gap-2
        ${visible ? "right-2 opacity-100" : "right-[100%] opacity-0"}
        bg-blue-500 text-white px-4 py-2 rounded shadow-md`}
      style={{
        top: `${20 + index * 60}px`, // stack notifications
      }}
    >
      <div>{message}</div>
      <button onClick={() => {
        setVisible(false)
        setTimeout(() => {
        remove(id)      
      }, 200);}}>
        <FiX className="hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}

