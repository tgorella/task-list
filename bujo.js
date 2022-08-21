const container = document.querySelector('#container');
const form = document.querySelector('#form');
const LS_KEY = 'MY_TASKS';
const taskList = document.querySelector('#tasks-list');

taskList.innerHTML = getState();

container.addEventListener('click', (event) => {
	if (event.target.classList.contains("done")) {
		event.target.classList.remove('done');
		event.target.classList.remove('in-progress');
		event.target.classList.remove('task-marker');
		event.target.classList.remove('delegate');
		event.target.closest(".task").querySelector('.task-text').classList.remove('del');
		
		saveState();
	} else if (event.target.classList.contains("delegate")) {
		event.target.classList.add('done');
		event.target.classList.remove('delegate');
		event.target.closest(".task").querySelector('.task-text').classList.add('del');
		
		saveState();
	} else if (event.target.classList.contains("forward")) {
		event.target.classList.add('delegate');
		event.target.classList.remove('forward');
		saveState();
	} else if (event.target.classList.contains("in-progress")) {
		event.target.classList.add('forward');
		event.target.classList.remove('in-progress');
		saveState();
	}  else if (event.target.classList.contains("task-marker")) {
		event.target.classList.add('in-progress');
		event.target.classList.remove('task-marker');
		saveState();
	}  else if (event.target.classList.contains("marker")) {
		event.target.classList.add('task-marker');
		saveState();
	} 
	if (event.target.classList.contains("del_btn")) {
		event.target.closest(".task").innerHTML = "";

		saveState();
	} 
});



form.addEventListener('submit', (event) => {

  event.preventDefault();

  const title = event.target.newtitle;
	
  if(!title.value) {
    return
  } else {
    taskList.innerHTML += `<div class="task">
		<div class="marker"></div>
		<div class="marker"></div>
		<div class="marker"></div>
		<div class="marker"></div>
		<div class="marker"></div>
		<div class="marker"></div>
		<div class="marker"></div>
		<div class="task-text">${title.value}</div>
		<div class="del_btn">-</div>
	</div>`;
	
  }

title.value = '';
saveState();
console.log(oldHtml);
})

let oldHtml = taskList.innerHTML;

function saveState() {
	oldHtml = taskList.innerHTML;
	localStorage.setItem(LS_KEY, oldHtml);
	}
	
	
	function getState() {
	const raw = localStorage.getItem(LS_KEY);
	return raw ? raw : "";
	}
