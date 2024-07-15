import { useEffect, useRef, useState } from "react";
import "./App.scss";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const notify = () => toast('✅ 체크 후 삭제 가능', { style: customStyle });

  const customStyle = {
    minHeight: '40px',
  };



  // 현재 날짜를 가져옵니다.
  const today = new Date();
  // 원하는 형식으로 날짜를 설정합니다.
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

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
    //참고 : trim()은 원래 문자열 앞 뒤의 공백을 없애주는 함수
    const task = ref.current.value.trim();
    if (!task) return; // 입력값이 공백이면 함수 종료
    setToDoList([...toDoList, { id: crypto.randomUUID(), task: task, completed: false }]);
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
      <div className="date"> {formattedDate}</div>

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
            <button
              className="deleteBtn"
              onClick={(e) => {
                deleteItem(item.id);
                notify();
              }}>❌</button>


            <ToastContainer style={{fontSize: "12px", minHeight: "20px"}}
              position="bottom-center"
              autoClose={2000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              theme="dark"
              limit={1}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
