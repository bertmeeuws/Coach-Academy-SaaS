import React, {useState} from 'react'
import dateFns, {isSameDay} from "date-fns";
import '../styles/calendar.css'

export default function Calendar() {
        const [currentMonth, setCurrentMonth] = useState(new Date())
        const [selectedDate, setSelectedDate] = useState(new Date())
   
       

        
        
          const renderHeader = () => {
            const dateFormat = "MMMM YYYY";
        
            return (
              <div className="header row flex-middle">
                <div className="col col-start">
                  <div className="icon" onClick={prevMonth}>
                    Previous
                  </div>
                </div>
                <div className="col col-center">
                  <span>{dateFns.format(currentMonth, dateFormat)}</span>
                </div>
                <div className="col col-end" onClick={nextMonth}>
                  <div className="icon">Next</div>
                </div>
              </div>
            );
          }
        
          const renderDays = () => {
            const dateFormat = "dddd";
            const days = [];
        
            let startDate = dateFns.startOfWeek(currentMonth);
            console.log("startdate " + startDate)
        
            for (let i = 0; i < 7; i++) {
              days.push(
                <div className="col col-center" key={i}>
                  {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
                </div>
              );
            }
        
            return <div className="days row">{days}</div>;
          }
        
          const renderCells = () =>{
            
            const monthStart = dateFns.startOfMonth(currentMonth);
            const monthEnd = dateFns.endOfMonth(monthStart);
            const startDate = dateFns.startOfWeek(monthStart);
            const endDate = dateFns.endOfWeek(monthEnd);
        
            const dateFormat = "D";
            const rows = [];
        
            let days = [];
            let day = startDate;
            let formattedDate = "";
        
        
            var result = isSameDay(new Date(2020, 8, 4, 6, 0), new Date(2020, 8, 4, 18, 0))
            console.log(result)
        
           let event = new Date(2020, 11 ,3)
           
            
        
            while (day <= endDate) {
              for (let i = 0; i < 7; i++) {
                formattedDate = dateFns.format(day, dateFormat);
                const cloneDay = day;
                days.push(
                  <div
                    className={`col cell ${
                      !dateFns.isSameMonth(day, monthStart)
                        ? "disabled"
                        : dateFns.isSameDay(day, selectedDate) ? "selecteddd" : ""
                    }`}
                    key={day}
                    onClick={() => onDateClick(dateFns.parse(cloneDay))}
                  >
                   
                   {isSameDay(cloneDay,event) ? "yes" : ""}
        
                    <span className="number">{formattedDate}</span>
                    <span className="bg">{formattedDate}</span>
                  </div>
                );
                day = dateFns.addDays(day, 1);
              }
              rows.push(
                <div className="row" key={day}>
                  {days}
                </div>
              );
              days = [];
            }
            return <div className="body">{rows}</div>;
          }
        
          const onDateClick = day => {
            setSelectedDate(day)
            console.log(selectedDate)
          };
        
          const nextMonth = () => {
           
            setCurrentMonth(dateFns.addMonths(currentMonth, 1))
          };
        
          const prevMonth = () => {
            
            setCurrentMonth(dateFns.subMonths(currentMonth, 1))
          };
        
        
            return (
              <div className="calendar">
                {renderHeader()}
                {renderDays()}
                {renderCells()}
              </div>
            );
          
    
}
