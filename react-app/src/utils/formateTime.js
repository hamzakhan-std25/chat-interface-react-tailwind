 const formateTime=(isoDate)=>{
    const timeString = new Date(isoDate).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return timeString;
}



export default formateTime;

// time formater