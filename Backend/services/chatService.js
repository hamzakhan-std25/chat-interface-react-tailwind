const supabase = require( "./supabaseClient.js");

 async function saveMessage({ user_id, user_name, session_id, role, message_text, url = null }) {
  const { data, error } = await supabase
    .from("messages")
    .insert([{ 
      user_id, 
      user_name, 
      session_id, 
      role, 
      message_text, 
      url 
    }])
    .select()
    .single();

  if (error) {
    console.error("Error saving message:", error);
    return null;
  }

  return data;
}



 async function getMessages(session_id) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("session_id", session_id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return data;
}

module.exports = {saveMessage, getMessages}