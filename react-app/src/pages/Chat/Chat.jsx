import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import ChatPanel from "./ChatPanel";

export default function Chat({addNotification}) {
  const [selectedSessionId, setSelectedSessionId] = useState(false);
    const [sideIn, setSideIn] = useState(false);

  return (
    <div className="fullscreen w-full flex">
      <Sidebar  selectedSessionId={selectedSessionId} sideIn={sideIn} setSideIn={setSideIn} setSelectedSessionId={setSelectedSessionId}/>
      <ChatPanel selectedSessionId={selectedSessionId} setSideIn={setSideIn} addNotification={addNotification} />
    </div>
  );
}
  