import React, {useState} from 'react'
import Calendar from 'react-calendar';
import "../../assets/css/calendar.css";

function CalendarView() {
    const [date, setDate] = useState(new Date());

    const newsData = {
        "2025-03-15": "Berita tentang React.js dirilis!",
        "2025-03-20": "Event besar di dunia teknologi!",
        "2025-03-25": "Update terbaru tentang AI!",
    };

    const formatDate = (date) => {
        const day = date.getDate();
        const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
        
        // Menentukan suffix (st, nd, rd, th)
        const getDaySuffix = (day) => {
          if (day >= 11 && day <= 13) return "th"; // Kasus khusus 11th, 12th, 13th
          switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
          }
        };
      
        return `${month} ${day}${getDaySuffix(day)}`;
      };

  return (
    <div className='row'>
      <div className='d-flex'>
        <div className="card rounded-0" style={{backgroundColor:'#03045e', width:'500px', height: '470px'}}>
          <div className="h5 d-flex justify-content-center text-white">CREATIVE CONNECT</div>
          <div className="row">
            <div className="d-flex">
              <div className="card-body" style={{width:'300px', color:'white'}}>
                <Calendar onChange={setDate} value={date} className="react-calendar"/>
                <hr />
                <h7>{formatDate(date)} : {newsData[date.toISOString().split("T")[0]] || "Tidak ada berita."}</h7>
              </div>
              <div className="card-body">
                <h6 className="text-uppercase text-white">Task</h6>
                <div className="d-flex flex-column gap-3">
                  {/* Item 1 */}
                  <div className="d-flex border-start border-danger border-4 ps-3">
                    <div>
                      <h7 className="fw-bold text-danger">Daily Challenge - 38</h7>
                      <p className="text-white m-0">Day: 38 Creative Connect challenge calendar.</p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="d-flex border-start border-danger border-4 ps-3">
                    <div>
                      <h7 className="fw-bold text-danger">Daily Challenge - 39</h7>
                      <p className="text-white m-0">Day: 39 Creative Connect challenge calendar.</p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="d-flex border-start border-danger border-4 ps-3">
                    <div>
                      <h7 className="fw-bold text-danger">Daily Challenge - 40</h7>
                      <p className="text-white m-0">Day: 40 Creative Connect challenge calendar.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card bg-danger rounded-0" >
          <div className='mt-2' style={{width:'40px'}}>
            <h6 className="border-bottom border-white border-2 text-white" style={{width:'30px', textAlign:'center'}}>
              31
            </h6>
            <h6 className="border-bottom border-white border-2 text-white" style={{width:'30px'}}>
              1
            </h6>
            <h6 className="border-bottom border-white border-2 text-white" style={{width:'30px'}}>
              2
            </h6>
            <h6 className="border-bottom border-white border-2 text-white" style={{width:'30px'}}>
              3
            </h6>
            <h6 className="border-bottom border-white border-2 text-white" style={{width:'30px'}}>
              4
            </h6>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarView