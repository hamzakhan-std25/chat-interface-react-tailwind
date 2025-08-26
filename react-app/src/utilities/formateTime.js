 const formateTime=(time24h)=>{


    const [hour, minute]= time24h.split(':');
    let ampm= hour>=12 ? 'pm' : 'am'
    let hours = hour % 12;
    hours= hours==0 ? 12 : hours;

    const time12h= hours+":"+minute+" "+ampm;

    return time12h;

}

export default formateTime;

// time formate in created by idid