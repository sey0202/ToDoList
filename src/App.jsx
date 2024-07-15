import { useEffect, useRef, useState } from "react";
import "./App.scss";

function App() {
  const ref = useRef();

  //할 일 목록
  const [toDoList, setToDoList] = useState(() => {
    //로컬스토리지(2) 저장소에서 불러오기
    const storage = localStorage.getItem("tasks");
    if (storage == null) return [];
    return JSON.parse(storage);
  });

  //로컬스토리지(1) toDoList가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(toDoList));
  }, [toDoList]);

  //할 일 입력 함수
  const addItem = (e) => {
    e.preventDefault();
    setToDoList([...toDoList, { id: crypto.randomUUID(), task: ref.current.value, completed: false }]);
    ref.current.value = null;
  };

  //할 일 삭제 함수
  const deleteItem = (id) => {
    const isDone = toDoList.find((item) => item.id == id);
    //completed가 false인 (할 일이 완료되지 않은) 요소만 삭제 가능한 조건식
    if (isDone.completed == false) return;
    else {
      setToDoList((item) => {
        return item.filter((item) => item.id !== id);
      });
    }
  };

  //할 일 토글 함수, completed를 바꾸는 작업
  const toggleItem = (id, completed) => {
    setToDoList((items) => {
      return items.map((item) => {
        if (item.id == id) {
          //ID가 같으면 기존 item은 그대로, completed만 새로 변경
          return { ...item, completed };
        } else {
          return item;
        }
      });
    });
  };

  //할 일의 상태에 따른 스타일
  const doneStyle = { textDecoration: "line-through", color: "grey" };
  const doingStyle = { textDecoration: "none", color: "black" };

  return (
    <div className="container">
      <h1>To Do List</h1>
      <form onSubmit={addItem}>
        <input type="text" placeholder="할 일을 입력하세요." ref={ref} />
        <button>+</button>
      </form>

      <ul className="list">
        {toDoList.map((item) => (
          <li key={item.id}>
            <input type="checkbox" id={`chk${item.id}`} onChange={(e) => toggleItem(item.id, e.target.checked)} />
            <label style={item.completed ? doneStyle : doingStyle} htmlFor={`chk${item.id}`}>
              {item.task}
            </label>
            <button className="deleteBtn" onClick={(e) => deleteItem(item.id)}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
