import Header from "../../components/Header";
// import ChatBotStr from "./ChatBotStr";
import ChatPanel from "./ChatPanel";
// import ChatBot from "./ChatBot";

export default function Chat() {
  return (
    <div className=" w-full grid  ">
      <Header />
      <ChatPanel />
        {/* <ChatBot /> */}
        {/* <ChatBotStr /> */}

    </div>
  );
}
