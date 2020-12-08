import React from "react";
import TodoItem from "../../components/TodoItem/TodoItem";
import InboxItem from "../../components/InboxItem/InboxItem";
import AgendaItem from "../../components/AgendaItem/AgendaItem";

export default function Dashboard() {
  const handleClick = () => {};

  return (
    <div className="dashboard-section dashboard">
      <div className="dashboard-grid">
        <div className="weather rounded shadow padding">
          <h2 className="subtitle">Sunny</h2>
          <p>Kortrijk, West-Vlaanderen</p>
        </div>
        <div className="todos rounded shadow padding">
          <div className="todos-header box-header">
            <h2 className="subtitle">Todos</h2>
            <span onClick={handleClick} className="button-add">
              +
            </span>
          </div>
          <ul>
            <TodoItem />
            <TodoItem />
            <TodoItem />
            <TodoItem />
            <TodoItem />
          </ul>
        </div>
        <div className="stats rounded shadow padding"></div>

        <div className="agenda rounded shadow padding">
          <div className="box-header">
            <h2 className="subtitle">Agenda</h2>
          </div>
          <p className="subtitle dashboard-agenda-date">Today, 30 October</p>
          <AgendaItem />
          <AgendaItem />
          <AgendaItem />

          <p className="subtitle dashboard-agenda-date">Today, 30 October</p>
          <AgendaItem />
          <AgendaItem />
          <AgendaItem />
          <AgendaItem />
          <AgendaItem />
        </div>
        <div className="inbox rounded shadow padding">
          <div className="box-header">
            <h2 className="subtitle">Inbox</h2>
          </div>
          <div className="inbox-grid">
            <p className="inbox-sender smalltext">SENDER</p>
            <p className="inbox-subject smalltext">SUBJECT</p>
            <InboxItem />
            <InboxItem />
            <InboxItem />
          </div>
        </div>
      </div>
    </div>
  );
}
