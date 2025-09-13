import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import ChatPanel from "./ChatPanel";

export default function Chat({addNotification}) {
  const [selectedSessionId, setSelectedSessionId] = useState(false);

  return (
    <div className=".fullscreen w-full flex ">
      <Sidebar  selectedSessionId={selectedSessionId} setSelectedSessionId={setSelectedSessionId}/>
      <ChatPanel selectedSessionId={selectedSessionId} addNotification={addNotification} />
      
    </div>
  );
}
